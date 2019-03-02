angular.module('JustNotesAPIREST')
.factory('usersFactory',['$http', function($http){
	var url = 'https://localhost:8443/JustNotesAPIREST/rest/users/';
	
    usersInterface = {
    	getUser : function(){
			console.log("Getting User from API")
			return $http.get(url).then(function(response){
         		 user = response.data;
         		 return response.data;})
	        
    	},
    	getUserByIdu : function(id){
    		var urlid = url + id;
    		return $http.get(urlid).then(function(response){
        		 return response.data;})
    	},
    	getUserByUsername : function(username) {
    		var urlQuery = url + "u?username=" + username;
    		console.log(urlQuery)
    		return $http.get(urlQuery).then(function(response){
    		     console.log("Respuesta", response.data)
        		 return response.data;})
    	},
    	getUserByEmail : function(email) {
    		var urlQuery = url + "e?email=" + email;
    		return $http.get(urlQuery).then(function(response){
    		     console.log("Respuesta", response.data)
        		 return response.data;})
    	},
    	getUsersByPattern : function(username) {
    		var urlQuery = url + "usernamePattern?username=" + username;
    		return $http.get(urlQuery).then(function(response){
    		     console.log("Respuesta", response.data)
        		 return response.data;})
    	},
    	postUser : function(user){
    		return $http.post(url, user)
	    		.then(function(response){
	   			 	user = response.data;
	    			return response.data;
	          	});
    	},
    	putUser : function(userUpdated){
            return $http.put(url, userUpdated)
            	.then(function(response){
                 	 console.log("User changed", user)
      				 return response.status;
  				});                   
    	},
        deleteUser: function(){
            return $http.delete(url)
            	.then(function(response){
            		return response.status;
            	});
        },
         
    }
    return usersInterface;
}])