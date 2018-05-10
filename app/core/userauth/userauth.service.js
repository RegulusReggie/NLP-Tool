angular.
	module('core.userauth').
	factory('UserAuth', ['$resource',
		function($resource) {
			return $resource('login', {}, {
        		auth: {
          			method: 'POST',
          			params: {phoneId: 'phones'},
          			isArray: true
        		}
      		});
		}
	]);