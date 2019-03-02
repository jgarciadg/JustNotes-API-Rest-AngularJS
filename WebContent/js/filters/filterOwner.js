angular.module('JustNotesAPIREST')
.filter('filterOwner', function(){
	return function(input){
		var notes = [];
		console.log("Filtering by Owner")
		angular.forEach(input, function(noteinfo) {
			if (noteinfo.usernote.owner == 1 && noteinfo.usernote.archived == 0 && noteinfo.usernote.intrash == 0) 
             notes.push(noteinfo);  
        })
        return notes;
	}
})