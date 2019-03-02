angular.module('JustNotesAPIREST')
.controller('profileimagesCtrl', ['$rootScope', '$location','profileimagesFactory', 'usersFactory',
	function($rootScope, $location, profileimagesFactory, usersFactory){
	var profileimagesVM = this;
	
	var profileimages = [];
	profileimagesVM.functions = {
		getProfileImages : function(){
			profileimagesFactory.getProfileImages()
				.then(function(response){console.log("Getting Profile Images"); profileimagesVM.profileimages = response},
					function(response){console.log("Error getting profileimages")})
				;
		}, 
		
		changeProfileImage : function(idi) {
			$rootScope.user.idi = idi;
			
			profileimagesFactory.getProfileImage($rootScope.user.idi)
			.then(function(response){
				console.log("Getting profileimage with idi: ", $rootScope.user.idi)
				$rootScope.profileimage = response;
			});
			
			var user = $rootScope.user;
			usersFactory.putUser(user)
			.then(function(response){ $location.path("/editUserDetails") },
				function(response){ console.log("Error updating User")})
		}
	}
	profileimagesVM.functions.getProfileImages();
}])