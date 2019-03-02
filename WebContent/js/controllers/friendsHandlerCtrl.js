angular.module('JustNotesAPIREST')
.controller('friendsHandlerCtrl', ['$rootScope','$routeParams','$location','usersFriendsFactory', 'usersFactory', 'profileimagesFactory', 'usersnotesFactory', 'notesFactory', 'notificationsFactory',
	function($rootScope, $routeParams, $location, usersFriendsFactory, usersFactory, profileimagesFactory, usersnotesFactory, notesFactory, notificationsFactory){
	var friendsHandlerVM = this;
	
	friendsHandlerVM.friends = [];
	friendsHandlerVM.username = "";
	friendsHandlerVM.friendsSelected=[];
	friendsHandlerVM.validationMessages = [];
	
	friendsHandlerVM.functions = {
		where : function(route){
			if($location.path().includes('seeSearchedUsers') && route.includes('seeSearchedUsers'))
				return true;
			else if($location.path().includes('shareNoteWithFriends') && route.includes('shareNoteWithFriends'))
				return true;
			else 
				return $location.path() == route;
   		},
   		listNotifications : function(){
   			var notifications = $rootScope.notifications;
   			for(notification in notifications){
   				var friendinfo = {};
   				friendinfo.notification = notifications[notification];
				friendsHandlerVM.functions.getUser(friendinfo, notifications[notification].idrequest);
				
				friendsHandlerVM.friends.push(friendinfo);
   			}
   		},
   		acceptNotifications : function() {
   			console.log(friendsHandlerVM.friendsSelected)
   			for(friendinfo in friendsHandlerVM.friendsSelected){
   				usersFactory.getUser()
   				.then(function(response){
   					var user = response;
   					var userfriend = {};
   	   				userfriend.idu = user.idu;
   	   				userfriend.idfriend = friendsHandlerVM.friendsSelected[friendinfo].user.idu;
   	   				
   	   				$rootScope.notifications.indexOf()
   	   				usersFriendsFactory.postUserFriend(userfriend)
   	   				.then(function(response){
   	   					console.log("Notifications Accepted");
   	   					
   	   					var reverseuserfriend = {};
   						reverseuserfriend.idu = userfriend.idfriend;
						reverseuserfriend.idfriend = userfriend.idu;
	   	   				
	   	   				usersFriendsFactory.postUserFriend(reverseuserfriend)
	   	   				.then(function(response){}, function(response){});
	   					notificationsFactory.deleteNotification(friendsHandlerVM.friendsSelected[friendinfo].user.idu)
	   					.then(function(response){console.log("Notification Deleted")}, function(response){console.log("Error deleting notification")})
							
						var idx = friendsHandlerVM.friendsSelected.indexOf(friendsHandlerVM.friendsSelected[friendinfo]);
	   					if (idx > -1) 
	   						friendsHandlerVM.friendsSelected.splice(idx, 1);
   	   				},
   						function(response){console.log("Error in the notification")});
   				}, function(response){console.log("Error getting the user")})
   			}
			$location.path("/myFriends");
   		},
   		shareNote : function(){
   			for(friendinfo in friendsHandlerVM.friendsSelected){
   				var usernote = {};
   				usernote.idu = friendsHandlerVM.friendsSelected[friendinfo].user.idu;//DONT MATTER
				usernote.idn = parseInt($routeParams.ID);//DONT MATTER
				usernote.owner = 0;
				usernote.archived = 0;
				usernote.pinned = 0;
				usernote.intrash = 0;
				
				usersnotesFactory.postUserNote(usernote)
				.then(function(response){console.log("Usernote Created");},
					function(response){console.log("Error creating a usernote")});
   			}
   			$location.path("/shareNoteWithFriends/" + $routeParams.ID)
   		},
   		addFriendToShare : function(friendinfo){
			var idx = friendsHandlerVM.friendsSelected.indexOf(friendinfo);
			if (idx > -1) 
				friendsHandlerVM.friendsSelected.splice(idx, 1);
		    else 
		    	friendsHandlerVM.friendsSelected.push(friendinfo);
		},
		sendNotification : function(idu) {
			console.log("MANDANDO NOTIFICACION AL USUARIO CON IDU: ", idu);
			usersFactory.getUser()
				.then(function(response){
					var user = response;
					var notification = {};
					notification.idu = idu;
					notification.idrequest = user.idu;
					
					notificationsFactory.postNotification(notification)
					.then(function(response){ console.log("Notification Sent")},
						function(response){ console.log("Error sending notification")})
				});
		},
		removeFriend : function(friendinfo) {
			usersFriendsFactory.deleteUserFriend(friendinfo.userfriend.idfriend)
			.then(function(response){
				var index = friendsHandlerVM.friends.indexOf(friendinfo);
				if(index != -1) 
					friendsHandlerVM.friends.splice(index, 1);
			}, function(response){
				console.log("Error removing UserFriend")
			});
		},
		goToUsersSearched(){
			friendsHandlerVM.validationMessages = [];
			if (friendsHandlerVM.username.length < 4) 
				friendsHandlerVM.validationMessages.push("The username must be higher than 4 characters or lower than .");
			
			if (friendsHandlerVM.validationMessages.length == 0)
				$location.path('/seeSearchedUsers/'+friendsHandlerVM.username);
		},
		searchUsers(username){
			usersFactory.getUsersByPattern(username)
			.then(function(response){
				var users = response;
				for (var user in users) {
					var friendinfo = {};
					friendinfo.user = users[user];
					friendsHandlerVM.functions.getProfileImage(friendinfo, friendinfo.user.idi);
					
					friendsHandlerVM.friends.push(friendinfo);
				}
			})
		},
		getUser(friendinfo, idu){
			usersFactory.getUserByIdu(idu)
			.then(function(response){
				friendinfo.user = response;
				friendsHandlerVM.functions.getProfileImage(friendinfo, friendinfo.user.idi);

			}, function(response){
				console.log("Error getting User with idu : " + usersfriends[userfriend].idfriend);
			});
		},
		getProfileImage(friendinfo, idu){
			profileimagesFactory.getProfileImage(idu)
			.then(function(response){ 
				friendinfo.profileimage = response;
			}, function(response) {
				console.log("Error getting Profile Image")
			});
		},
		getCommonNotes(friendinfo, idu) {
			usersnotesFactory.getUsersNotesShared(idu)
			.then(function(response){
				friendinfo.notesshared = [];
				console.log(response)
				var usersnotes = response;
				
				for (var usernote in usersnotes) {
					var noteinfo = {};
					noteinfo.usernote = usersnotes[usernote];
					
					notesFactory.getNote(noteinfo.usernote.idn)
					.then(function(response){noteinfo.note = response},
						function(response){console.log("Error getting Note for idn " + noteinfo.usernote.idn)})
					;
					friendinfo.notesshared.push(noteinfo);
				}
			}, function(response){
				console.log("Error getting UsersNotesShared")
			});
		},
		getAll : function() {
			usersFriendsFactory.getUsersFriends()
			.then(function(response){
				var usersfriends = response;

				for (var userfriend in usersfriends) {
					var friendinfo = {};
					friendinfo.userfriend = usersfriends[userfriend];
					
					friendsHandlerVM.functions.getUser(friendinfo, usersfriends[userfriend].idfriend);
					friendsHandlerVM.functions.getCommonNotes(friendinfo, usersfriends[userfriend].idfriend);
					
					friendsHandlerVM.friends.push(friendinfo);
				}
			}, function(response){
				console.log("Error getting UsersFriends")
			});
		},
		
		readFriends : function() {
			friendsHandlerVM.functions.getAll()	
		}
	}
	if (friendsHandlerVM.functions.where('/myFriends'))
		friendsHandlerVM.functions.readFriends();
	else if(friendsHandlerVM.functions.where('/seeSearchedUsers/'+ $routeParams.userName))
		friendsHandlerVM.functions.searchUsers($routeParams.userName);
	else if(friendsHandlerVM.functions.where('/shareNoteWithFriends/'+ $routeParams.ID))
		friendsHandlerVM.functions.readFriends();
	else if(friendsHandlerVM.functions.where('/seeNotifications'))
		friendsHandlerVM.functions.listNotifications();

}])