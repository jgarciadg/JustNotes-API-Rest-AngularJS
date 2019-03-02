angular.module('JustNotesAPIREST')
.controller('registerCtrl', ['$window', 'usersFactory',
	function($window, usersFactory){
    var registerVM = this;
    registerVM.user = {};
    registerVM.user.idu = 1;
    registerVM.user.idi = 1;
    registerVM.user.username = "";
    registerVM.user.email = "";
    registerVM.user.password = "";
    registerVM.verifiedPassword = "";
    
    registerVM.errors = [];
    
    registerVM.functions = {
		registerUser : function() {
			if(registerVM.functions.validate()){
				usersFactory.getUserByUsername(registerVM.user.username)
					.then(function(response){
						registerVM.errors.push("The user " + registerVM.user.username + " exists.");
					},
					function(response){
						usersFactory.getUserByEmail(registerVM.user.email)
							.then(function(response){
								registerVM.errors.push("The email " + registerVM.user.email + " exists.");
							},
							function(response){
								usersFactory.postUser(registerVM.user)
								.then(function(response){
									console.log("User Registered");
									$window.location.href = 'https://localhost:8443/JustNotesAPIREST/LoginServlet';
				    			}, function(response){
				    				console.log("Error Response: ", response);
				    			})
							})
					});
			}
		},
		validate : function() {
			registerVM.errors = [];
			if (registerVM.user.username === undefined || registerVM.user.username.trim().length == 0) {
				registerVM.errors.push("Fill in the Username field.");
			} else if (registerVM.user.username.length > 16) {
				registerVM.errors.push("Username length cannot be higher than 16 characters.");
			} else if (registerVM.user.username.length < 3) {
				registerVM.errors.push("Username length must be higher than 3 characters.");
			} else if (registerVM.user.username.includes(" ")) {
				registerVM.errors.push("Username cannot have blank spaces.");
			} else if (!registerVM.user.username.match("[a-zA-Z][a-zA-Z0-9_-]*")) {
				registerVM.errors.push("Invalid Username (Pattern allowed:[a-zA-Z][a-zA-Z0-9_-]*).");
			}

			if (registerVM.user.password == null || registerVM.user.password.trim().length == 0) {
				registerVM.errors.push("Fill in the Password field.");
			} else if (registerVM.user.password.length > 40) {
				registerVM.errors.push("Password length cannot be higher than 40 characters.");
			} else if (registerVM.user.password.length < 6) {
				registerVM.errors.push("Password length must be higher than 6 characters.");
			} else if (registerVM.user.password.includes(" ")) {
				registerVM.errors.push("Password cannot have blank spaces.");
			} else if (!registerVM.user.password.match("(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]*")) {
				registerVM.errors.push("Invalid password. It must contain at least 1 upper case and 1 number.");
			}

			if (registerVM.user.email == null || registerVM.user.email.trim().length == 0) {
				registerVM.errors.push("Fill in the email field.");
			} else if (registerVM.user.email.length > 70) {
				registerVM.errors.push("Email length cannot be higher than 70 characters.");
			} else if (registerVM.user.email.includes(" ")) {
				registerVM.errors.push("Email cannot have blank spaces.");
			} else if (!registerVM.user.email.match("[a-zA-Z0-9_\\.\\+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-\\.]+")) {
				registerVM.errors.push("Invalid Email.");
			}
			
	
			if(registerVM.verifiedPassword != registerVM.user.password){
				registerVM.errors.push("Password must be equals to Verified Password.");				
			}
			
			console.log(registerVM.errors)
			if (registerVM.errors.length == 0){return true;}
			else { return false;}
		}
    }

}])