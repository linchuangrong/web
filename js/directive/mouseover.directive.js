/**
 * Created by Chunangrong on 2016/10/20.
 * 主要功能是为了“项目评审”的评分功能
 */
(function() {
	'use strict';

	angular.module("ngMouseOver.directive", [])
		.directive("ngMouseOver", function() {
			return {
				scope: {
					siblingDom: '@',
					activeIndex: "=",
					validPoints: '='
				},
				link: function(scope, ele, attr) {

					scope.activeIndex = ''; //默认是选中空下标
					scope.validPoints = ''; //默认是无分

					ele.on("mouseover", scope.siblingDom, mouseoverFn);
					ele.on("click", scope.siblingDom, clickFn);
					ele.on("mouseout", scope.siblingDom, mouseoutFn);

					function mouseoverFn(event) {
						var dom = angular.element(event.target);
						dom.addClass("active").siblings().removeClass("active");
					}

					function mouseoutFn(event) {
						var dom = ele.find(scope.siblingDom).eq(scope.activeIndex); //找到被点击active的元素
						dom.addClass("active").siblings().removeClass("active");
					}

					function clickFn(event) {
						var dom = angular.element(event.target);
						scope.activeIndex = dom.index(); //下标
						scope.validPoints = dom.text(); //实际得分
						dom.addClass("active").siblings().removeClass("active");
						//console.log("点击的下标：" + scope.activeIndex);
						//console.log("实际得分：" + scope.validPoints);
					}
				}
			}
		});
})();