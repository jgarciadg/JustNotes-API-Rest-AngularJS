angular.module('JustNotesAPIREST')
.factory('usersFriendsFactory',['$http', function($http){
	var url = 'https://localhost:8443/JustNotesAPIREST/rest/usersfriends/';
	
    var usersfriendsInterface = {
		getUsersFriends: function(){
            return $http.get(url)
            	.then(function(response){
            		return response.data;
         		});
    	},	
    	getUserFriend: function(id){
    		var urlid = url + id;
            return $http.get(urlid)
            	.then(function(response){
            		return response.data;
         		});
    	},
    	postUserFriend : function(userfriend){
    		return $http.post(url, userfriend)
	    		.then(function(response){
	   			 return response.data;
	          	});
    	},
        deleteUserFriend : function(id){
        	var urlid = url+id;
            return $http.delete(urlid)
            	.then(function(response){
            		return response.status;
            	});
        }
    }
    
    return usersfriendsInterface;
}])