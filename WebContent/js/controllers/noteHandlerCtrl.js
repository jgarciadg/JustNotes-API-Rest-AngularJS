angular.module('JustNotesAPIREST')
.controller('noteHandlerCtrl', ['$routeParams','$location','notesFactory', 'usersnotesFactory', 'labelsFactory', 'versionsNoteFactory',
	function($routeParams, $location, notesFactory, usersnotesFactory, labelsFactory, versionsNoteFactory){
    var noteHandlerVM = this;
    noteHandlerVM.colors = [
        {name : "NO COLOR", id : 0},
        {name : "GREEN", id : 1},
        {name : "BLUE", id : 2},
        {name : "PINK", id : 3},
        {name : "BLACK", id : 4}];
    noteHandlerVM.noteinfo={};
    noteHandlerVM.noteinfo.note={};
    noteHandlerVM.noteinfo.usernote={};
    noteHandlerVM.noteinfo.labels=[];
	noteHandlerVM.noteinfo.labelsinaline = "";
	noteHandlerVM.validationMessages = []; 
	noteHandlerVM.error = false;
	
    noteHandlerVM.functions = {
		where : function(route){
   			return $location.path() == route;
   		},
   		readNote : function(idn) {
			notesFactory.getNote(idn)
				.then(function(response){
					console.log("Reading note with idn: ", idn," Response: ", response);
					
					noteHandlerVM.noteinfo.note = response;
					usersnotesFactory.getUserNote(idn)
					.then(function(response){noteHandlerVM.noteinfo.usernote = response},
						  function(response){console.log("Error reading usernote")});
					labelsFactory.getLabels(idn)
					.then(function(response){
						noteHandlerVM.noteinfo.labels=response;
						for ( var label in noteHandlerVM.noteinfo.labels) {
							noteHandlerVM.noteinfo.labelsinaline += noteHandlerVM.noteinfo.labels[label].content + ', ';
						}
					},
						function(response){console.log("Error reading labels")});
					
					console.log("Reading noteinfo with idn: ", idn," Response: ", noteHandlerVM.noteinfo);
				}, function(response){
					console.log("Error reading note");
					$location.path('/');
				})
		},
		createNote : function() {
			noteHandlerVM.error = false;
			noteHandlerVM.validationMessages = [];
			if (noteHandlerVM.noteinfo.note.title === undefined || noteHandlerVM.noteinfo.note.title.trim().length == 0 || noteHandlerVM.noteinfo.note.title.length < 4) {
				noteHandlerVM.validationMessages.push("The title must be higher than 3 characters or lower than .");
			} else if (noteHandlerVM.noteinfo.note.title.length > 25) {
				noteHandlerVM.validationMessages.push("The title cannot be higher than 25 characters.");
			} else if (!noteHandlerVM.noteinfo.note.title.replace(/ /g, ' ').match("[a-zA-Z][a-zA-Z0-9_-]*")) {
				noteHandlerVM.validationMessages.push("Invalid Title (Pattern allowed:[a-zA-Z][a-zA-Z0-9_-]*).");
			}

			var words = noteHandlerVM.noteinfo.note.title.split(" ");
			for (word in words) {
				if (words[word].length > 12) {
					noteHandlerVM.validationMessages.push("The words cannot be higher than 12 characters.");
					break;
				}
			}

			if (noteHandlerVM.noteinfo.note.content === undefined || noteHandlerVM.noteinfo.note.content.length == 0 || noteHandlerVM.noteinfo.note.content.length < 11) {
				noteHandlerVM.validationMessages.push("The content must be higher than 10 characters.");
			} else if (noteHandlerVM.noteinfo.note.content.length > 1000) {
				noteHandlerVM.validationMessages.push("The content cannot be higher than 1000 characters.");
			} else if (!noteHandlerVM.noteinfo.note.content.replace(/ /g, ' ').match("[a-zA-Z][a-zA-Z0-9_-]*")) {
				noteHandlerVM.validationMessages.push("Invalid Content (Pattern allowed:[a-zA-Z][a-zA-Z0-9_-]*).");
			}
			if(noteHandlerVM.validationMessages.length > 0) 
				noteHandlerVM.error = true;
			
			if(!noteHandlerVM.error){
				noteHandlerVM.noteinfo.note.idn = 0;
				if(noteHandlerVM.noteinfo.note.urlimage === undefined)
					noteHandlerVM.noteinfo.note.urlimage = "https://localhost:8443/JustNotesAPIREST/images/Logo.png";
		        notesFactory.postNote(noteHandlerVM.noteinfo.note)
					.then(function(response){						
						console.log("Creating note. Response:", response);
						noteHandlerVM.noteinfo.note.idn = parseInt(response);
	    				console.log(noteHandlerVM.noteinfo.note.idn);

						noteHandlerVM.noteinfo.usernote.idu = 0;//DONT MATTER
						noteHandlerVM.noteinfo.usernote.idn = noteHandlerVM.noteinfo.note.idn;//DONT MATTER
						noteHandlerVM.noteinfo.usernote.owner = 1;
						noteHandlerVM.noteinfo.usernote.archived = 0;
						noteHandlerVM.noteinfo.usernote.pinned = 0;
						noteHandlerVM.noteinfo.usernote.intrash = 0;
						if(noteHandlerVM.noteinfo.usernote.color === undefined)
							noteHandlerVM.noteinfo.usernote.color = 0;
						usersnotesFactory.putUserNote(noteHandlerVM.noteinfo.usernote)
						.then(function(response){console.log("Usernote updated", noteHandlerVM.noteinfo.usernote);},
							function(response){console.log("Error updating usernote")});

						var labels = [];
						if(noteHandlerVM.noteinfo.labelsinaline.length > 0)
							labels = noteHandlerVM.noteinfo.labelsinaline.trim().split(',');
						
						for(label in labels){
							var labelinfo = {};
							labelinfo.idn = noteHandlerVM.noteinfo.note.idn;
							labelinfo.content = labels[label].trim().replace(/ /g, ' ');
							console.log(labelinfo.content)
							labelsFactory.postLabel(labelinfo)
							.then(function(response){console.log("Label created correctly"); noteHandlerVM.noteinfo.labels.push(labelinfo);},
								function(response){console.log("Error creating a label")});
						}
						
						var version = {};
						version.idu = noteHandlerVM.noteinfo.usernote.idu;
						version.idn = noteHandlerVM.noteinfo.usernote.idn;
						version.owner = noteHandlerVM.noteinfo.usernote.owner;
						version.archived = noteHandlerVM.noteinfo.usernote.archived;
						version.pinned = noteHandlerVM.noteinfo.usernote.pinned;
						version.intrash = noteHandlerVM.noteinfo.usernote.intrash;
						version.color = noteHandlerVM.noteinfo.usernote.color;
						version.title = noteHandlerVM.noteinfo.note.title;
						version.content = noteHandlerVM.noteinfo.note.content;
						version.urlimage = noteHandlerVM.noteinfo.note.urlimage;
						
						var date = new Date();
						version.timestamp = date.getFullYear().toString();
						if(date.getMonth() < 10) version.timestamp += "0" +(date.getMonth()+1).toString();
						else version.timestamp += (date.getMonth()+1).toString();
						if(date.getDate() < 10) version.timestamp += "0" +date.getDate().toString();
						else version.timestamp += date.getDate().toString();
						if(date.getHours() < 10) version.timestamp += "0" +date.getHours().toString();
						else version.timestamp += date.getHours().toString();
						if(date.getMinutes() < 10) version.timestamp += "0" +date.getMinutes().toString();
						else version.timestamp += date.getMinutes().toString();
						if(date.getSeconds() < 10) version.timestamp += "0" +date.getSeconds().toString();
						else version.timestamp += date.getSeconds().toString();
						
						versionsNoteFactory.postVersion(version)
						.then(function(response){
							console.log("Version Created")
						}, function(response){
							console.log("Error creating a version")
						})
	    			}, function(response){
	    				console.log("Error creating the note");
	    			});
			}
		},
		updateNote : function() {
			noteHandlerVM.error = false;
			noteHandlerVM.validationMessages = [];
			if (noteHandlerVM.noteinfo.note.title === undefined || noteHandlerVM.noteinfo.note.title.trim().length == 0 || noteHandlerVM.noteinfo.note.title.length < 4) {
				noteHandlerVM.validationMessages.push("The title must be higher than 3 characters or lower than .");
			} else if (noteHandlerVM.noteinfo.note.title.length > 25) {
				noteHandlerVM.validationMessages.push("The title cannot be higher than 25 characters.");
			} else if (!noteHandlerVM.noteinfo.note.title.replace(/ /g, ' ').match("[a-zA-Z][a-zA-Z0-9_-]*")) {
				noteHandlerVM.validationMessages.push("Invalid Title (Pattern allowed:[a-zA-Z][a-zA-Z0-9_-]*).");
			}

			var words = noteHandlerVM.noteinfo.note.title.split(" ");
			for (word in words) {
				if (words[word].length > 12) {
					noteHandlerVM.validationMessages.push("The words cannot be higher than 12 characters.");
					break;
				}
			}

			if (noteHandlerVM.noteinfo.note.content === undefined || noteHandlerVM.noteinfo.note.content.length == 0 || noteHandlerVM.noteinfo.note.content.length < 11) {
				noteHandlerVM.validationMessages.push("The content must be higher than 10 characters.");
			} else if (noteHandlerVM.noteinfo.note.content.length > 1000) {
				noteHandlerVM.validationMessages.push("The content cannot be higher than 1000 characters.");
			} else if (!noteHandlerVM.noteinfo.note.content.replace(/ /g, ' ').match("[a-zA-Z][a-zA-Z0-9_-]*")) {
				noteHandlerVM.validationMessages.push("Invalid Content (Pattern allowed:[a-zA-Z][a-zA-Z0-9_-]*).");
			}
			if(noteHandlerVM.validationMessages.length > 0) 
				noteHandlerVM.error = true;
			
			if(!noteHandlerVM.error){
				if(noteHandlerVM.noteinfo.note.urlimage === undefined || noteHandlerVM.noteinfo.note.urlimage.length == 0)
					noteHandlerVM.noteinfo.note.urlimage = "https://localhost:8443/JustNotesAPIREST/images/Logo.png";
				notesFactory.putNote(noteHandlerVM.noteinfo.note)
					.then(function(response){
						console.log("Updating note with id:", noteHandlerVM.noteinfo.note.idn," Response:", response);
						usersnotesFactory.putUserNote(noteHandlerVM.noteinfo.usernote)
						.then(function(response){console.log("Usernote Updated", noteHandlerVM.noteinfo.usernote);},
							function(response){console.log("Error updating usernote")});

						labelsFactory.getLabels(noteHandlerVM.noteinfo.note.idn)
						.then(function(response){
							var oldlabels = response;
							
							var labels = noteHandlerVM.noteinfo.labelsinaline.split(',');
							for(label in labels){
								var labelinfo = {};
								labelinfo.idn = noteHandlerVM.noteinfo.note.idn;
								labelinfo.content = labels[label].trim();
								
								var contenida = false;
								for(oldlabel in oldlabels){
									if(oldlabels[oldlabel].content == labelinfo.content)
										contenida = true;
								}
								if(!contenida)
									labelsFactory.postLabel(labelinfo)
									.then(function(response){console.log("Label created correctly"); noteHandlerVM.noteinfo.labels.push(labelinfo);},
										function(response){console.log("Error creating a label")});
							}
							
							for(oldlabel in oldlabels){
								if(!labels.map(Function.prototype.call, String.prototype.trim).includes(oldlabels[oldlabel].content))
									labelsFactory.deleteLabel(oldlabels[oldlabel].idn, oldlabels[oldlabel].content)
									.then(function(response){console.log("Old label removed")},
										function(response){console.log("Error deleting a label")})
							}
							
							var version = {};
							version.idu = noteHandlerVM.noteinfo.usernote.idu;
							version.idn = noteHandlerVM.noteinfo.usernote.idn;
							version.owner = noteHandlerVM.noteinfo.usernote.owner;
							version.archived = noteHandlerVM.noteinfo.usernote.archived;
							version.pinned = noteHandlerVM.noteinfo.usernote.pinned;
							version.intrash = noteHandlerVM.noteinfo.usernote.intrash;
							version.color = noteHandlerVM.noteinfo.usernote.color;
							version.title = noteHandlerVM.noteinfo.note.title;
							version.content = noteHandlerVM.noteinfo.note.content;
							version.urlimage = noteHandlerVM.noteinfo.note.urlimage;
							
							var date = new Date();
							version.timestamp = date.getFullYear().toString();
							if(date.getMonth() < 10) version.timestamp += "0" +(date.getMonth()+1).toString();
							else version.timestamp += (date.getMonth()+1).toString();
							if(date.getDate() < 10) version.timestamp += "0" +date.getDate().toString();
							else version.timestamp += date.getDate().toString();
							if(date.getHours() < 10) version.timestamp += "0" +date.getHours().toString();
							else version.timestamp += date.getHours().toString();
							if(date.getMinutes() < 10) version.timestamp += "0" +date.getMinutes().toString();
							else version.timestamp += date.getMinutes().toString();
							if(date.getSeconds() < 10) version.timestamp += "0" +date.getSeconds().toString();
							else version.timestamp += date.getSeconds().toString();
							
							console.log(version)
							versionsNoteFactory.postVersion(version)
							.then(function(response){
								console.log("Version Created")
							}, function(response){
								console.log("Error creating a version")
							})
						},function(response){"Error getting labels"})
						
	    			}, function(response){
	    				console.log("Error updating note");
	    			});
			}
		},
		deleteNote : function(id) {
			notesFactory.deleteNote(id)
				.then(function(response){
					console.log("Deleting note with id:",id," Response:", response);
					
				}, function(response){
					console.log("Error deleting note");
				})
		},
		noteHandlerSwitcher : function(){
			if (noteHandlerVM.functions.where('/createNote')){
				console.log($location.path());
				noteHandlerVM.functions.createNote();
			}
			else if (noteHandlerVM.functions.where('/editNote/'+noteHandlerVM.noteinfo.note.idn)){
				console.log($location.path());
				noteHandlerVM.functions.updateNote();
			}
			else if (noteHandlerVM.functions.where('/deleteNote/'+noteHandlerVM.noteinfo.note.idn)){
				console.log($location.path());
				noteHandlerVM.functions.deleteNote(noteHandlerVM.noteHandlerVM.noteinfo.note.idn);
			}
			if(!noteHandlerVM.error)
				$location.path('/');
		}
    }
	console.log("Entering noteHandlerCtrl with $routeParams.ID=",$routeParams.ID);
   	if ($routeParams.ID!=undefined) noteHandlerVM.functions.readNote($routeParams.ID);
}]);