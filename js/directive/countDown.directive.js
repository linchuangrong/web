/**
 * 2016年9月16日 
 * 倒计时
 * 参数：
 * 		countDownSize	倒计时总时间
 * 		startText		默认文字
 * 		clickFunc		点击事件
 * 		canClick		判断input是否通过了校验规则，true：通过    false:不通过
 */
(function() {
	'use strict';
	angular.module('countDown.directive', [])
		.directive('countDown', function($interval) {
			return {
				restrict: 'A',
				scope: {
					startText: '@', //默认文字
					clickFunc: '&', //点击事件
				},
				link: function(scope, ele, attr) {
					var interval = null;
					angular.element(ele).bind("click", setTime);

					function setTime($event) {
						//判断当前按钮，是否可以点击
						if(attr.canclick == "false" || attr.canclick == false) {
							console.log("input验证不通过，点击无效");
							return false;
						} else {
							console.log("input验证通过，触发点击事件");
							var countdown = attr.countDownSize;
							var $dom = angular.element($event.target);

							//当倒计时未开始时，才开启倒计时
							if(interval == null) {
								$dom.attr("disable", true)
								.addClass("disabled")
								.val("倒计时" + countdown + "s")
								.css("width","auto");

								function startInterval() {
									if(countdown == 0) {
										$dom.attr("disable", false)
											.removeClass("disabled")
											.val(scope.startText || "获取验证码")
											.css("width","auto");

										countdown = scope.countdownSize;
										$interval.cancel(interval); //清除计时器
										interval = null; //倒计时结束
										return false;
									} else {
										countdown--;
										$dom.attr("disable", true)
											.addClass("disabled")
											.val("倒计时" + countdown + "s")
											.css("width","auto");
									}
								}
								interval = $interval(startInterval, 1000);
								scope.clickFunc(); //执行点击事件
							}
						}
					}
				},
			}
		});
})();