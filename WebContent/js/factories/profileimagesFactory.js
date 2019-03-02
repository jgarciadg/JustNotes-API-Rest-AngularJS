angular.module('JustNotesAPIREST')
.factory('profileimagesFactory',['$http', function($http){
	var url = 'https://localhost:8443/JustNotesAPIREST/rest/profileimages/';
    var profilesimagesInterface = {
    	getProfileImages : function(){
            return $http.get(url)
              	.then(function(response){
        			 return response.data;
               	});
    	},
    	getProfileImage : function(id){
    		var urlid = url + id;
            return $http.get(urlid)
              	.then(function(response){
        			 return response.data;
               	});
    	}
    }
    return profilesimagesInterface;
}])