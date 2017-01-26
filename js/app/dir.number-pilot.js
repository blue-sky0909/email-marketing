meApp.directive('numberPilot', [
	'$timeout', '$interval',
	function($timeout, $interval) {
		
		var defaults = {
            min: 0,
            max: 10000,
            step: 1,
            timeout: 600,
            hideSideButtons: false
        };
		
		var assign = function(dest, src) {
            for (var key in src) {
                if (!dest[key]) {
                    dest[key] = src[key];
                }
            }
            return dest;
        };

        var isNumber = function(value) {
            var val = Number(value);
            return !isNaN(val) && val == value;
        };

        var toNumber = function(value) {
            return Number(value);
        };

        var checkNumber = function(value) {
            if (!isNumber(value)) {
                throw new Error('value [' + value + '] is not a valid number');
            }
        };

        var getTarget = function(e) {
            if (e.touches && e.touches.length > 0) {
                return angular.element(e.touches[0].target);
            }
            return angular.element(e.target);
        };

        var getType = function(e) {
            return getTarget(e).attr('type');
        };

        var transform = function(opts) {
            for (var key in opts) {
                var value = opts[key];
                opts[key] = toNumber(value);
            }
        };
		
		return {
			restrict: 'E',
			scope: {
				'modelVar': '=ngModel',
				'min': '=', // @
				'max': '=',
				'step': '=',
				'change': '&',
				'hideSideButtons': '='
			},
			require: 'ngModel',
			replace: true,
			link: function($scope, element) {

				$scope.opts = assign({
                        min: $scope.min,
                        max: $scope.max,
                        step: $scope.step,
                        hideSideButtons: $scope.hideSideButtons === undefined ? false : $scope.hideSideButtons
                    }, defaults);

                    checkNumber($scope.opts.min);
                    checkNumber($scope.opts.max);
                    checkNumber($scope.opts.step);

                    transform($scope.opts);

                    $scope.modelVar = parseInt($scope.modelVar);
					
                    $scope.$watch('modelVar', function(newValue) {
						
						if (newValue > $scope.opts.max) {
							newValue = $scope.opts.max;
						} else if (!isFinite(newValue) || newValue < $scope.opts.min) {
							newValue = $scope.opts.min;
						}
						
						$scope.modelVar = parseInt(newValue);
						$scope.change();
						
                        $scope.canDown = newValue > $scope.opts.min;
                        $scope.canUp = newValue < $scope.opts.max;
                    });

                    var changeNumber = function($event) {
                        var type = getType($event);
                        if ('up' === type) {
                            if ($scope.modelVar >= $scope.opts.max) {
                                return;
                            }
                            $scope.modelVar += $scope.opts.step;
                        } else if ('down' === type) {
                            if ($scope.modelVar <= $scope.opts.min) {
                                return;
                            }
                            $scope.modelVar -= $scope.opts.step;
                        }
                        $scope.change();
                    };

                    var timeoutPro;
                    var intervalPro;
                    var start;
                    var end;
                    var addon = element.find('span');

                    addon.on('click', function(e) {

                        changeNumber(e);
                        $scope.$apply();
                        e.stopPropagation();

                    });

                    addon.on('touchstart', function(e) {
                        getTarget(e).addClass('active');
                        start = new Date().getTime();
                        timeoutPro = $timeout(function() {
                            intervalPro = $interval(function() {
                                changeNumber(e);
                            }, 200);
                        }, $scope.opts.timeout);
                        e.preventDefault();
                    });

                    addon.on('touchend', function(e) {
                        end = new Date().getTime();
                        if (intervalPro) {
                            $interval.cancel(intervalPro);
                            intervalPro = undefined;
                        }
                        if (timeoutPro) {
                            $timeout.cancel(timeoutPro);
                            timeoutPro = undefined;
                        }
                        if ((end - start) < $scope.opts.timeout) {
                            changeNumber(e);
                            $scope.$apply();
                        }
                        getTarget(e).removeClass('active');
                    });

                    $scope.$on('$destroy', function() {
                        addon.off('touchstart touchend click');
                    });

			},
			template: '<div class="input-group numberModifier">'+
			'<span class="input-group-addon" type="down" ng-disabled="!canDown" ng-hide="opts.hideSideButtons">-</span>'+
			'<input type="text" class="form-control" ng-model="modelVar" placeholder="Number" ng-style="{width: opts.hideSideButtons ? \'100%\' : \'58%\'}">'+
			'<span class="input-group-addon" type="up" ng-disabled="!canUp" ng-hide="opts.hideSideButtons">+</span></div>'
		};
	}
]);