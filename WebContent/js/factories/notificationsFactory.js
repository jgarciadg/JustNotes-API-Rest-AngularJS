angular.module('JustNotesAPIREST')
.factory('notificationsFactory',['$http', function($http){
	var url = 'https://localhost:8443/JustNotesAPIREST/rest/notifications/';
    var notificationsInterface = {
    	getNotifications : function(){
            return $http.get(url)
              	.then(function(response){
        			 return response.data;
               	});
    	},
    	postNotification : function(notification){
    		return $http.post(url, notification)
	    		.then(function(response){
	   			 	return response.data;
	          	});
    	},
        deleteNotification: function(id){
        	var urlid = url+id;
            return $http.delete(urlid)
            	.then(function(response){
            		return response.status;
            	});
        }	
    }
    return notificationsInterface;
}])