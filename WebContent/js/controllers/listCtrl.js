angular.module('JustNotesAPIREST')
.controller('listCtrl', ['$rootScope', '$routeParams', '$location','$filter', 'notesFactory', 'labelsFactory', 'usersnotesFactory', 'versionsNoteFactory', 'usersFactory',
	function($rootScope, $routeParams, $location, $filter, notesFactory, labelsFactory, usersnotesFactory, versionsNoteFactory, usersFactory){
	var listVM = this;
	listVM.colorKeyValue = [
		{key:'No Color', value: 0},
		{key:'Green', value:1},
		{key:'Blue', value:2},
		{key:'Pink', value:3},
		{key:'Black', value:4}
		];
	
	//advanced search
	listVM.colorSelected = "0";
	listVM.typeSelected = "pinned";
	listVM.sharedNotesSelected = "0";
	listVM.titleSelected = "";
	
	listVM.notesinfo = [];
	listVM.allnotesinfo = [];
	
	listVM.howMany = [0, 0, 0, 0, 0];
	
	listVM.labels = [];
	
	listVM.noteToDelete = {};

	listVM.functions = {
		searchNotes : function(){
			$rootScope.colorSelected = listVM.colorSelected;
			$rootScope.typeSelected = listVM.typeSelected;
			$rootScope.sharedNotesSelected = listVM.sharedNotesSelected;
			$rootScope.titleSelected = listVM.titleSelected;
			console.log($rootScope)
			$location.path("/notesSearched")
		},
		loadNotesSearched : function() {
			
			usersnotesFactory.getUsersNotesSimpleSearch($rootScope.titleSelected)
			.then(function(response){
				var usersnotes = response;
				usersnotes = usersnotes.filter(usernote => usernote.color == parseInt($rootScope.colorSelected));
				usersnotes = usersnotes.filter(usernote => usernote.owner != parseInt($rootScope.sharedNotesSelected));
				console.log(usersnotes)
				switch($rootScope.typeSelected ){
				case "pinned":
					usersnotes = usersnotes.filter(usernote => usernote.pinned == 1);
					break;
				case "archived":
					usersnotes = usersnotes.filter(usernote => usernote.archived == 1);
					break;
				case "intrash":
					usersnotes = usersnotes.filter(usernote => usernote.intrash == 1);
					break;
				case "dontmatter":
					break;
				}
				for (var usernote in usersnotes) {
    				var noteinfo = {};
    				noteinfo.usernote = usersnotes[usernote];
    				listVM.functions.getNote(noteinfo, usersnotes[usernote].idn);
					listVM.functions.getLabels(noteinfo, usersnotes[usernote].idn);
					listVM.notesinfo.push(noteinfo);
    			}
			}, function(response){console.log("Error getting the usersnotes")})

		},
		filterColor : function(color){
			console.log("filtering Colors", color)
			
			listVM.notesinfo = [];
			if(color == -1)
				listVM.notesinfo = listVM.allnotesinfo;
			else
				for (var noteinfo in listVM.allnotesinfo) 
					if(listVM.allnotesinfo[noteinfo].usernote.color == color)
						listVM.notesinfo.push(listVM.allnotesinfo[noteinfo]);
		},
		filterLabels : function(label){
			console.log("filtering Labels", label)

			listVM.notesinfo = [];
			if(label == -1)
				listVM.notesinfo = listVM.allnotesinfo;
			else
				for (var noteinfo in listVM.allnotesinfo) 
					for(ilabel in listVM.allnotesinfo[noteinfo].labels)
						if(listVM.allnotesinfo[noteinfo].labels[ilabel].content == label)
							listVM.notesinfo.push(listVM.allnotesinfo[noteinfo]);
		},
		pinNote : function(noteinfo) {
			noteinfo.usernote.pinned = (noteinfo.usernote.pinned == 1) ? 0 : 1;
			
			usersnotesFactory.putUserNote(noteinfo.usernote)
			.then(function(response){
				console.log("Pinned/Unpinned usernote with idn: " + noteinfo.usernote.idn);
			})
		},
		removeLabels : function(noteinfo) {
			for(label in noteinfo.labels)
				for (labelVM in listVM.labels)
					if(listVM.labels[labelVM].content == noteinfo.labels[label].content){
						listVM.labels[labelVM].howmany -= 1;
						if(listVM.labels[labelVM].howmany == 0){
							var index = listVM.labels.indexOf(listVM.labels[labelVM]);
							if(index != -1) 
								listVM.labels.splice(index, 1);
						}
					}
		},
		toTrashNote : function(noteinfo) {
			noteinfo.usernote.intrash = (noteinfo.usernote.intrash == 1) ? 0 : 1;
			
			usersnotesFactory.putUserNote(noteinfo.usernote)
			.then(function(response){
				console.log("ToTrash/Recover usernote with idn: " + noteinfo.usernote.idn);
			})
			if ((!listVM.functions.where('/seeInTrash') && noteinfo.usernote.intrash == 1)
					|| (listVM.functions.where('/seeInTrash') && noteinfo.usernote.intrash == 0)){ 
				var index = listVM.notesinfo.indexOf(noteinfo);
				if(index != -1) 
					listVM.notesinfo.splice(index, 1);
				listVM.howMany[noteinfo.usernote.color] -= 1;
				
				listVM.functions.removeLabels(noteinfo);
			}
		},
		archiveNote : function(noteinfo) {
			noteinfo.usernote.archived = (noteinfo.usernote.archived == 1) ? 0 : 1;
			
			if(!listVM.functions.where('/seeAll'))
				listVM.functions.removeLabels(noteinfo);

			usersnotesFactory.putUserNote(noteinfo.usernote)
			.then(function(response){
				console.log("Archived/DisArchived usernote with idn: " + noteinfo.usernote.idn);
				if (!listVM.functions.where('/seeAll') && ((!listVM.functions.where('/seeArchived') && noteinfo.usernote.archived == 1)
						|| (listVM.functions.where('/seeArchived') && noteinfo.usernote.archived == 0))){ 
					var index = listVM.notesinfo.indexOf(noteinfo);
					if(index != -1) 
						listVM.notesinfo.splice(index, 1);
					listVM.howMany[noteinfo.usernote.color] -= 1;

				}
			})
		},
		checkDeleteNote : function(noteinfo) {
			console.log("CheckDeleteNote", noteinfo)
			$location.path('/checkDeleteNotes/'+noteinfo.usernote.idn);
		},
		emptyTrash : function() {
			console.log("EmptyTrash", listVM.notesinfo)
			
			var array = listVM.notesinfo;
			for(var noteinfo in array){
				if(array[noteinfo].usernote.owner == 1){
					notesFactory.deleteNote(array[noteinfo].usernote.idn)
					.then(function(response){
						console.log("Removed Note with idn: " + array[noteinfo].usernote.idn)
					}, function(response){
						console.log("Error removing Note")
					})
				}else{
					usersnotesFactory.deleteUserNote(array[noteinfo].usernote.idn)
					.then(function(response){
						console.log("Removed UsersNotes with idn: " + array[noteinfo].usernote.idn)
					}, function(response){
						console.log("Error removing UsersNotes")
					})
				}
			}
			$location.path('/');
		},
		frequentColors : function() {
			for(index in listVM.notesinfo)
				listVM.howMany[listVM.notesinfo[index].usernote.color] += 1;
		},
		loadVersions : function(id) {
			versionsNoteFactory.getVersions(id)
			.then(function(response){
				var versions = response;
				for (version in versions){
					var noteinfo = {};
					
					noteinfo.usernote = {};
					noteinfo.usernote.idn = versions[version].idn;
					noteinfo.usernote.idu = versions[version].idu;
					noteinfo.usernote.owner = versions[version].owner;
					noteinfo.usernote.archived = versions[version].archived;
					noteinfo.usernote.pinned = versions[version].pinned;
					noteinfo.usernote.intrash = versions[version].intrash;
					noteinfo.usernote.color = versions[version].color;
					
					noteinfo.note = {};
					noteinfo.note.idn = versions[version].idn;
					noteinfo.note.title = versions[version].title;
					noteinfo.note.content = versions[version].content;
					noteinfo.note.urlimage = versions[version].urlimage;
					
					noteinfo.version = versions[version];
					
					listVM.functions.getUser(noteinfo, noteinfo.usernote.idu);
					
					listVM.notesinfo.push(noteinfo);
				}
				listVM.allnotes = listVM.notesinfo;
				listVM.notesinfo
					.sort(function(a, b){
						return a.version.timestamp < b.version.timestamp;
					})
			}, function(reponse){
				console.log("Error getting versions")
			})
		},
		recoverVersion : function(noteinfo){
			notesFactory.putNote(noteinfo.note)
			.then(function(response){console.log("Note Recovered")}, 
				function(response){console.log("Error recovering the note")});
			
			usersnotesFactory.putUserNote(noteinfo.usernote)
			.then(function(response){console.log("Usernote Recovered");},
				function(response){console.log("Error recovering usernote")});
		},
		where : function(route){
   			return $location.path() == route;
   		},
   		getUser : function(noteinfo, idu){
   			usersFactory.getUserByIdu(idu)
			.then(function(response){noteinfo.user = response;},
				function(response){console.log("Error getting the User of the version")})
		},
		getNote : function(noteinfo, idn){
			notesFactory.getNote(idn)
			.then(function(response){noteinfo.note = response},
				function(response){console.log("Error getting usernote for idn " + idn)})
			;
		},
		getLabels : function(noteinfo, idn){
			labelsFactory.getLabels(idn)
				.then(function(response){
					noteinfo.labels = response;
					for(infolabel in noteinfo.labels){
						var labels = listVM.labels;
						var exists = false;
						for (label in labels)
							if(labels[label].content == noteinfo.labels[infolabel].content)
								exists = true;
						if(!exists){
							var labelinfo = {};
							labelinfo.content = noteinfo.labels[infolabel].content;
							labelinfo.howmany = 1;
							listVM.labels.push(labelinfo);
						}else{
							var index = 0;
							for (label in labels)
								if(labels[label].content == noteinfo.labels[infolabel].content)
									index = label;
							labels[index].howmany += 1;
						}
					}
					listVM.labels
					.sort(function(a, b){
						return a.howmany < b.howmany;
					})
					console.log(listVM.labels)
				},
				function(response){console.log("Error getting labels for idn " + idn)})
		},
		getANoteInfo : function(idn) {
			usersnotesFactory.getUserNote(parseInt(idn))
			.then(function(response){
				var noteinfo = {};
				noteinfo.usernote = response;
				listVM.functions.getNote(noteinfo, noteinfo.usernote.idn);
				listVM.functions.getLabels(noteinfo, noteinfo.usernote.idn);
				listVM.notesinfo.push(noteinfo);
			}, function(response){console.log("Error getting the usernote")});
		},
		getNotesByUserNotes : function(text){
			usersnotesFactory.getUsersNotesSimpleSearch(text)
			.then(function(response){
				var usersnotes = response;
    			for (var usernote in usersnotes) {
    				var noteinfo = {};
    				noteinfo.usernote = usersnotes[usernote];
    				listVM.functions.getNote(noteinfo, usersnotes[usernote].idn);
					listVM.functions.getLabels(noteinfo, usersnotes[usernote].idn);
					listVM.notesinfo.push(noteinfo);
    			}
			}, function(response){
				console.log("Error getting the usersnotes")
			});
		},
		getAll : function(){
			usersnotesFactory.getUsersNotes()
			.then(function(response){
    			var usersnotes = response;
    			for (var usernote in usersnotes) {
    				var noteinfo = {};
    				noteinfo.usernote = usersnotes[usernote];
    				listVM.functions.getNote(noteinfo, usersnotes[usernote].idn);
					listVM.allnotesinfo.push(noteinfo);
    			}
    			
    			if (listVM.functions.where('/seeMyNotes')){listVM.notesinfo = $filter('filterOwner')(listVM.allnotesinfo);}
    			else if (listVM.functions.where('/seeArchived')){listVM.notesinfo = $filter('filterArchived')(listVM.allnotesinfo);}
    			else if (listVM.functions.where('/seePinned')){listVM.notesinfo = $filter('filterPinned')(listVM.allnotesinfo);}
    			else if (listVM.functions.where('/seeShared')){listVM.notesinfo = $filter('filterShared')(listVM.allnotesinfo);}
    			else if (listVM.functions.where('/seeInTrash') || listVM.functions.where('/checkDeleteNotes')){listVM.notesinfo = $filter('filterInTrash')(listVM.allnotesinfo);}
    			else if (listVM.functions.where('/')){listVM.notesinfo = $filter('filterDefault')(listVM.allnotesinfo);}
    			else listVM.notesinfo = $filter('filterAll')(listVM.allnotesinfo);;
    			
    			for (noteinfo in listVM.notesinfo)
					listVM.functions.getLabels(listVM.notesinfo[noteinfo], listVM.notesinfo[noteinfo].usernote.idn);
    			
    			listVM.allnotesinfo = listVM.notesinfo;

    			listVM.functions.frequentColors();
    		}, function(response){
	    			console.log("Error reading notes");
	    	});			
		},
		readNotes : function() {
			if (listVM.functions.where('/checkDeleteNotes/'+$routeParams.ID)) listVM.functions.getANoteInfo($routeParams.ID)
			else listVM.functions.getAll()	
		}
	}
	if (listVM.functions.where('/seeNotesSearchedByQuery/'+$routeParams.TEXT))
		listVM.functions.getNotesByUserNotes($routeParams.TEXT)
	else if(listVM.functions.where('/seeVersions/'+$routeParams.ID))
		listVM.functions.loadVersions($routeParams.ID);
	else if(listVM.functions.where('/notesSearched'))
		listVM.functions.loadNotesSearched();
	else if(!listVM.functions.where('/searchNotes'))
		listVM.functions.readNotes();
	else console.log()
}])