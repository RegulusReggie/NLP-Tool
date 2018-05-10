// Register 'login' component

angular.
	module('login').
	component('login', {
		templateUrl: 'login/login.template.html',
		controller: ['UserAuth', '$location',
			function LoginController(UserAuth, $location) {
				var self = this
				self.authenticate = function() {
					if (self.user.username == 'Reggie') {
						$location.url('/nlp-main-page')
					} else {
						self.result = 'Bad auth'
					}
				}
			}
		]
	})