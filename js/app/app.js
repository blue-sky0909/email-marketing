// Athena Mail Editor

var meApp = angular.module('meApp', ['ngSanitize', 'ui.codemirror', 'ngAnimate', 'ngTouch', 'ui.router', 'ui.bootstrap', 'LocalStorageModule', 'dndLists', 'ngFileUpload', 'InlineTextEditor', 'color.picker', 'rzModule', 'toastr']);

meApp.config(function($httpProvider, $stateProvider, $urlRouterProvider, $sceProvider, localStorageServiceProvider) {
	$stateProvider
	.state('welcome', {
		views: {
			'mainContent': {
				templateUrl: "partials/welcome/welcomeView.html"
			}
		},
		url: '/'
	})
	.state('editTemplate', {
		views: {
			'mainContent': {
				templateUrl: "partials/editTemplate/editTemplateView.html"
			}
		},
		data: {'mailId': undefined, 'title': undefined, 'subject': undefined, 'dropzone': undefined}
	})
	.state('getTemplate', {
		views: {
			'mainContent': {
				templateUrl: "partials/editTemplate/editTemplateView.html"
			}
		},
		url: "/mail/{mailId:int}"
	});

	$urlRouterProvider.otherwise('/');

	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

	$httpProvider.defaults.transformRequest.push(function(data) {
		var requestStr;
		if (data) {
			data = JSON.parse(data);
			for (var key in data) {
				if (requestStr) {
					requestStr += "&" + key + "=" + data[key];
				} else {
					requestStr = key + "=" + data[key];
				}
			}
		}
		return requestStr;
	});

	localStorageServiceProvider
		.setPrefix('meMaster')
		.setStorageCookie(30, '/');
});

meApp.run(['$state', function ($state) {
	$state.transitionTo('welcome');
}]);

// System Font Families
var fontFamilies = [
	{ fontName: "Arial", family: "Arial, 'Helvetica Neue', Helvetica, sans-serif" },
	{ fontName: "Comic Sans MS", family: "'comic sans ms', sans-serif" },
	{ fontName: "Courier New", family: "Courier New,Courier,Lucida Sans Typewriter,Lucida Typewriter,monospace" },
	{ fontName: "Georgia", family: "Georgia,Times,Times New Roman,serif" },
	{ fontName: "Lucida Sans Unicode", family: "Lucida Sans Unicode" },
	{ fontName: "Tahoma", family: "Tahoma,Verdana,Segoe,sans-serif" },
	{ fontName: "Times New Roman", family: "TimesNewRoman,Times New Roman,Times,Baskerville,Georgia,serif" },
	{ fontName: "Trebuchet MS", family: "Trebuchet MS,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Tahoma,sans-serif" },
	{ fontName: "Verdana", family: "Verdana,Geneva,sans-serif" }
];