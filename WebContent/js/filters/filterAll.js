angular.module('JustNotesAPIREST')
.filter('filterAll', function(){
	return function(input){
		var notes = [];
		console.log("Filtering by Archived")
		angular.forEach(input, function(noteinfo) {
           if (noteinfo.usernote.intrash == 0) 
             notes.push(noteinfo);  
        })
        return notes;
	}
})