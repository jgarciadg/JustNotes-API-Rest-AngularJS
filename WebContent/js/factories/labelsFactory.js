angular.module('JustNotesAPIREST')
.factory('labelsFactory',['$http', function($http){
	var url = 'https://localhost:8443/JustNotesAPIREST/rest/labels/';
    var labelsInterface = {
    	getLabels : function(id){
    		var urlid = url + id;
            return $http.get(urlid)
              	.then(function(response){
        			 return response.data;
               	});
    	},
    	postLabel: function(label){
    		return $http.post(url, label)
	    		.then(function(response){
	   			 return response.data;
	          	});
    	},
        deleteLabel: function(id, content){
        	var urlmodified = url+id+"/"+content;
            return $http.delete(urlmodified)
            	.then(function(response){
            		return response.status;
            	});
        }	
    }
    return labelsInterface;
}])