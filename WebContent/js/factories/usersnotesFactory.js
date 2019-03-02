angular.module('JustNotesAPIREST')
.factory('usersnotesFactory',['$http', function($http){
	var url = 'https://localhost:8443/JustNotesAPIREST/rest/usersnotes/';
    var usersnotesInterface = {
		getUsersNotes: function(){
            return $http.get(url)
            	.then(function(response){
            		return response.data;
         		});
    	},	
    	getUserNote: function(id){
    		var urlid = url + id;
            return $http.get(urlid)
            	.then(function(response){
            		return response.data;
         		});
    	},
    	getUsersNotesShared : function(idu) {
    		var urlquery = url + 'shared?idfriend=' + idu;
    		return $http.get(urlquery)
	         	.then(function(response){
	         		return response.data;
	      		});
    	},
    	postUserNote : function(usernote){
    		return $http.post(url, usernote)
	    		.then(function(response){
	    			console.log(response.data)
	   			 return response.data;
	          	});
    	},
    	putUserNote : function(usernote){
    		var urlid = url+usernote.idn;
            return $http.put(urlid, usernote)
            	.then(function(response){
      				 return response.status;
  				});                   
    	},
        deleteUserNote : function(id){
        	var urlid = url+id;
            return $http.delete(urlid)
            	.then(function(response){
            		return response.status;
            	});
        },
        getUsersNotesSimpleSearch : function(query){
        	var urlquery = url + 'searchq?query=' + query;
	        return $http.get(urlquery)
	    	.then(function(response){
	    		return response.data;
	 		});
        }
    }
    
    return usersnotesInterface;
}])