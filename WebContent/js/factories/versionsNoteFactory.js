angular.module('JustNotesAPIREST')
.factory('versionsNoteFactory',['$http', function($http){
	var url = 'https://localhost:8443/JustNotesAPIREST/rest/notes/';
    var versionsNotesInterface = {
    	getVersions : function(id){
            return $http.get(url + id + '/versions')
              	.then(function(response){
        			 return response.data;
               	});
    	},
    	postVersion : function(version){
    		console.log(url + version.idn + '/versions')
    		return $http.post(url + version.idn + '/versions', version)
	    		.then(function(response){
	   			 return response.data;
	          	});
    	}
    }
    return versionsNotesInterface;
}])