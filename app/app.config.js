angular.
	module('nlpTool').
	config(['$locationProvider', '$routeProvider',
		function config($locationProvider, $routeProvider) {
			$locationProvider.hashPrefix('!');

			$routeProvider.
				when('/login', {
					template: '<login></login>'
				}).
				when('/nlp-main-page', {
					template: '<nlp-main-page></nlp-main-page>'
				}).
				otherwise('/login');
		}
	]);