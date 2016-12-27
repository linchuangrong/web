/**
 * form表单设置最小值，最大值
 * 林创荣
 * 2016年12月09日
 */
(function() {
	'use strict';

	angular.module("limitSize.directive", [])
		.directive("limitSize", function() {
			return {
				restrict: 'A',
				require: "?ngModel",
				scope: {
					minSize: "@",
					maxSize: "@",
				},
				link: function(scope, ele, attrs, ngModelController) {
					//console.log(scope.minSize);
					//console.log(scope.maxSize);
					if(!ngModelController) return;
					ngModelController.$parsers.push(function(value) {

						var i = parseInt(value);

						if(scope.minSize && !scope.maxSize) {
							//只设置了最小值
							if(i >= scope.minSize) {
								ngModelController.$setValidity("limitSize", true);
							} else {
								ngModelController.$setValidity("limitSize", false);
							}
						} else if(!scope.minSize && scope.maxSize) {
							//只设置了最大值
							if(i <= scope.maxSize) {
								ngModelController.$setValidity("limitSize", true);
							} else {
								ngModelController.$setValidity("limitSize", false);
							}
						} else if(scope.minSize && scope.maxSize) {
							//同时设置了最大值、最小值
							if(i >= scope.minSize && i <= scope.maxSize) {
								ngModelController.$setValidity("limitSize", true);
							} else {
								ngModelController.$setValidity("limitSize", false);
							}
						}

						return value;
					})
				}
			};
		});
})();