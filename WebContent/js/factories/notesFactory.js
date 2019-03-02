angular.module('JustNotesAPIREST')
.factory('notesFactory',['$http', function($http){
	var url = 'https://localhost:8443/JustNotesAPIREST/rest/notes/';
    var notesInterface = {
    	getNotes : function(){
            return $http.get(url)
              	.then(function(response){
        			 return response.data;
               	});
    	},
    	getNote : function(id){
    		var urlid = url + id;
            return $http.get(urlid)
            	.then(function(response){
            		return response.data;
         		});
    	},
    	postNote : function(note){
    		return $http.post(url, note)
	    		.then(function(response){
	   			 return response.headers().location.substr(51);
	          	});
    	},
    	putNote : function(note){
    		var urlid = url+note.idn;
            return $http.put(urlid, note)
            	.then(function(response){
      				 return response.status;
  				});                   
    	},
        deleteNote: function(id){
        	var urlid = url+id;
            return $http.delete(urlid)
            	.then(function(response){
            		return response.status;
            	});
        }	
    }
    return notesInterface;
}])