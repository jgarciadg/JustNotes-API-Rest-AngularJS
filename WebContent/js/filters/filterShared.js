angular.module('JustNotesAPIREST')
.filter('filterShared', function(){
	return function(input){
		var notes = [];
		console.log("Filtering by Shared")
		angular.forEach(input, function(noteinfo) {
           if (noteinfo.usernote.owner === 0 && noteinfo.usernote.archived == 0 && noteinfo.usernote.intrash == 0) 
             notes.push(noteinfo);  
        })
        return notes;
	}
})