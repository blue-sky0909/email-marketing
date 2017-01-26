meApp.directive("scrollHeightDetector", function($window) {
	function getOffset (elem, fixedPosition) {
		var
			x = 0,
			y = 0,
			scrollX = 0,
			scrollY = 0;
		while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
			x += elem.offsetLeft;
			y += elem.offsetTop;
			if (!fixedPosition && elem.tagName === 'BODY') {
				scrollX += document.documentElement.scrollLeft || elem.scrollLeft;
				scrollY += document.documentElement.scrollTop || elem.scrollTop;
			} else {
				scrollX += elem.scrollLeft;
				scrollY += elem.scrollTop;
			}
			elem = elem.offsetParent;
		}
		return {
			top: y,
			left: x,
			scrollX: scrollX,
			scrollY: scrollY
		};
	}
	
	var getElemPos = function(element) {
		var
			distance = 0,
			elemHeight = 35,
			elemMarginBottom = 3,
			elemOffsetPos = getOffset(element[0], true),
			scrollPos = document.documentElement.scrollTop || 0;
		
		var distance = elemOffsetPos.top - scrollPos - (elemHeight + elemMarginBottom);

		return 'top:' + distance + 'px';
	}
	
	return {
       restrict : "A",
       link : function(scope, element, attrs) {
			element.on('click', function (event) {
				element.children('.inline-toolbar')[0].style.cssText = getElemPos(element);
			});

			angular.element($window).on('scroll', function (event) {
				element.children('.inline-toolbar')[0].style.cssText = getElemPos(element);
			});
        }
    }
});