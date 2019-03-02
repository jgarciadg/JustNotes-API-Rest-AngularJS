angular.module('JustNotesAPIREST')
.filter('filterInTrash', function(){
	return function(input){
		var notes = [];
		console.log("Filtering by Trash")
		angular.forEach(input, function(noteinfo) {
           if (noteinfo.usernote.intrash === 1) 
             notes.push(noteinfo);  
        })
        return notes;
	}
})