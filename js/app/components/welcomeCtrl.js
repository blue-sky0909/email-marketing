meApp.controller('welcomeCtrl', function ($scope, $state, $interval,mailsFact, $http) {
	$scope.initReadyTemplates = function () {
		mailsFact.getDefaultMails().success(function(response) {
			$scope.readyTemplates = response;
		});

		$state.get('editTemplate').data.mailId = undefined;
	};

	$scope.selectTpl = function(index) {
		var tplData = $scope.readyTemplates[index];
		$state.get('editTemplate').data = tplData;
		$state.get('editTemplate').data.dropzone = angular.fromJson(tplData.data);
		$state.go('editTemplate', {});
	}

	$interval(function() {
		var url = "http://cloud.directiq.com/integration/editor/KeepAlive.aspx";
		$http({
			url: url,
			method: 'POST',
			cache : false ,
			processData: false , 
			contentType:false
		});
	          }, 100 * 300);

});
