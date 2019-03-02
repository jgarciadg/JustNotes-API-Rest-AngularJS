angular.module('JustNotesAPIREST')
.controller('userHandlerCtrl', ['$window','$rootScope','usersFactory','profileimagesFactory', 
	function($window, $rootScope, usersFactory, profileimagesFactory){
    var userHandlerVM = this;
    userHandlerVM.functions = {
		readUser : function() {
			usersFactory.getUser()
				.then(function(response){
					$rootScope.user = response;
					console.log($rootScope)
					profileimagesFactory.getProfileImage($rootScope.user.idi)
					.then(function(response){
						console.log("Getting profileimage with idi: ", $rootScope.user.idi);
						$rootScope.profileimage = response;
					});
					console.log("Getting user with id: ", $rootScope.user.idu," Response: ", response);
    			}, function(response){
    				console.log("Error reading user data");
    			})
		},
		updateUser : function() {
			usersFactory.putUser($rootScope.user)
				.then(function(response){ console.log("Updating User");},
						function(response) { console.log("Error updating user")})
		},
		deleteUser : function() {
			usersFactory.deleteUser()
				.then(function(response) { console.log("Deleting User"); $window.location.href = 'https://localhost:8443/JustNotesAPIREST/notes/LogoutServlet';},
						function(response) { console.log("Error Deleting User"); });
		}
    }
    userHandlerVM.functions.readUser();
}])