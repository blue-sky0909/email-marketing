meApp.controller('uploaderCtrl', function ($scope, $http, $timeout, Upload, msgFact) {
	
	$scope.$watch('itemPic', function (itemPic) {
		$scope.formUpload = false;
        if (itemPic != null) {
        	if (!angular.isArray(itemPic)) {
                $scope.itemPic = itemPic = [itemPic];
            }
            for (var i = 0; i < itemPic.length; i++) {
                
                $scope.errorMsg = null;
                (function (f) {
                    upload(f);
                })(itemPic[i]);
            }
        }
    });

    $scope.uploadPic = function(file) {
        $scope.formUpload = true;
        if (file != null) {
            upload(file)
        }
    };

    function upload(file) {
    	uploadUsingUpload(file);
    }

	$scope.username = "John Doe";

    function uploadUsingUpload(file) {
        var uploadUrl = "https://cloud.directiq.com/integration/editor/upload.aspx";  
        file.upload = Upload.upload({
            url: uploadUrl,
            method: 'POST',
            fields: {username: $scope.username},
            file: file,
        });

        file.upload.then(function (resp) {
            $timeout(function () {
                console.log(resp);
                file.results = resp.data;
				
                if (angular.isDefined($scope.item)) {
                    $scope.item.module.attrs.src = file.results.baseUrl + file.results.filename;
                    $scope.item.module.attrs.filename = file.results.filename;

                    msgFact.info('Successfully Uploaded');
                } else if (angular.isDefined($scope.agent)) {
                    $scope.agent.module.attrs.src = file.results.baseUrl + file.results.filename;
                    $scope.agent.module.attrs.filename = file.results.filename;

                    msgFact.info('Successfully Changed');
                };
            });
        }, function (resp) {
            if (resp.status > 0)
                $scope.errorMsg = resp.status + ': ' + resp.data;
        });

        file.upload.progress(function (evt) {
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
            // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    }
    
    angular.element(window).bind('dragover', function (e) {
        e.preventDefault();
    });
    angular.element(window).bind('drop', function (e) {
        e.preventDefault();
    });
});
