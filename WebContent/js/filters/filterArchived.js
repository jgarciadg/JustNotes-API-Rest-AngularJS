angular.module('JustNotesAPIREST')
.filter('filterArchived', function(){
	return function(input){
		var notes = [];
		console.log("Filtering by Archived")
		angular.forEach(input, function(noteinfo) {
           if (noteinfo.usernote.archived == 1 && noteinfo.usernote.intrash == 0) 
             notes.push(noteinfo);  
        })
        return notes;
	}
})