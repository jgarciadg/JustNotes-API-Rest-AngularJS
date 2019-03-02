angular.module('JustNotesAPIREST')
.filter('filterPinned', function(){
	return function(input){
		var notes = [];
		console.log("Filtering by Pinned")
		angular.forEach(input, function(noteinfo) {
           if (noteinfo.usernote.pinned === 1 && noteinfo.usernote.archived == 0 && noteinfo.usernote.intrash == 0) 
             notes.push(noteinfo);  
        })
        return notes;
	}
})