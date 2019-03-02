angular.module('JustNotesAPIREST')
.controller('headerCtrl', ['$rootScope', '$location', 'usersnotesFactory', 'usersFactory', 'profileimagesFactory', '$location', 'notificationsFactory',
	function($rootScope, $location, usersnotesFactory, usersFactory, profileimagesFactory, $location, notificationsFactory){
    var headerViewModel = this;
    headerViewModel.user={};
    headerViewModel.textToSearch = "";
    headerViewModel.notifications=[];
    headerViewModel.functions = {
		where : function(route){
   			return $location.path() == route;
   		},
		readUser : function() {
			usersFactory.getUser()
				.then(function(response){
					$rootScope.user = response;
					
					profileimagesFactory.getProfileImage($rootScope.user.idi)
					.then(function(response){
						console.log("Getting profileimage with idi: ", $rootScope.user.idi)
						$rootScope.profileimage = response;
					});
					
					console.log("Getting user with idu: ", $rootScope.user.idu);
    			}, function(response){
    				console.log("Error Response: ", response);
    			});
		},
		getAllBySearch : function(){
			$location.path('/seeNotesSearchedByQuery/'+headerViewModel.textToSearch)
		}
    }
	headerViewModel.functions.readUser();
    headerViewModel.notifications = 
    	notificationsFactory.getNotifications()
    	.then(function(response){
    		headerViewModel.notifications = response;
    		$rootScope.notifications = response;
    	});
}])