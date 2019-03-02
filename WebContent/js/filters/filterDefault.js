angular.module('JustNotesAPIREST')
.filter('filterDefault', function(){
	return function(input){
		var notes = [];
		console.log("Filtering by Default")
		angular.forEach(input, function(noteinfo) {
           if (noteinfo.usernote.archived == 0 && noteinfo.usernote.intrash == 0) 
             notes.push(noteinfo);  
        })
        return notes;
	}
})