angular.module('JustNotesAPIREST', ['ngRoute'])
.config(function($routeProvider){
	$routeProvider
	.when("/", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/seeAll", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/seeMyNotes", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/seeArchived", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/seeInTrash", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/seeVersions/:ID", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/checkDeleteNotes", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "checkDeleteNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/checkDeleteNotes/:ID", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "checkDeleteNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/seePinned", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/seeShared", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/seeNotesSearchedByQuery/:TEXT", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html",
		resolve: {
			delay: function($q, $timeout) {
			var delay = $q.defer();
			$timeout(delay.resolve, 500);
			return delay.promise;
			}
		}
	})
	.when("/myFriends", {
		controller: "friendsHandlerCtrl",
		controllerAs: "friendsHandlerVM",
		templateUrl: "listFriendsTemplate.html"
    })
    .when("/seeNotifications", {
		controller: "friendsHandlerCtrl",
		controllerAs: "friendsHandlerVM",
		templateUrl: "listFriendsTemplate.html"
    })
    .when("/shareNoteWithFriends/:ID", {
		controller: "friendsHandlerCtrl",
		controllerAs: "friendsHandlerVM",
		templateUrl: "listFriendsTemplate.html"
    })
	.when("/createNote", {
		controller: "noteHandlerCtrl",
		controllerAs: "noteHandlerVM",
		templateUrl: "noteHandlerTemplate.html"
    })
    .when("/editNote/:ID", {
    	controller: "noteHandlerCtrl",
    	controllerAs: "noteHandlerVM",
    	templateUrl: "noteHandlerTemplate.html"
    })
    .when("/deleteNote/:ID", {
    	controller: "noteHandlerCtrl",
    	controllerAs: "noteHandlerVM",
    	templateUrl: "noteHandlerTemplate.html"
    })
	.when("/searchNotes", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "searchNotesTemplate.html"
	})
	.when("/notesSearched", {
		controller: "listCtrl",
		controllerAs: "listVM",
		templateUrl: "listNotesTemplate.html"
	})
	.when("/editUserDetails", {
		controller: "userHandlerCtrl",
		controllerAs: "userHandlerVM",
		templateUrl: "userDetailsTemplate.html"
	})
	.when("/listProfileImages", {
		controller: "profileimagesCtrl",
		controllerAs: "profileimagesVM",
		templateUrl: "listProfileImagesTemplates.html"
	})
	.when("/checkDeleteUser", {
		controller: "userHandlerCtrl",
		controllerAs: "userHandlerVM",
		templateUrl: "seeDeleteUserPage.html"
	})
	.when("/searchUsers", {
		controller: "friendsHandlerCtrl",
		controllerAs: "friendsHandlerVM",
		templateUrl: "searchFriendsTemplate.html"
	})
	.when("/seeSearchedUsers/:userName", {
		controller: "friendsHandlerCtrl",
		controllerAs: "friendsHandlerVM",
		templateUrl: "listFriendsTemplate.html"
	})
})



