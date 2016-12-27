/**
 * tooltip插件
 * 林创荣
 * 2016年10月25日
 */
(function() {
	'use strict';

	angular.module("tooltip.directive", [])
		.directive('tooltip', function() {
			return {
				scope: {
					tooltipBackground: '@'
				},
				link: function(scope, element, attrs) {
					//1.生成、获取dom元素
					var $tooltip = $('<div id="tooltip-dom"><div id="tooltip-text"></div><i></i></div>');
					//2.清空tip里的文本
					$tooltip.find("#tooltip-text").html('');
					//3.获取小三角形dom元素
					var $i = $tooltip.find("i");
					//4.获取触发事件的dom元素
					var _this = angular.element(element);
					//5.绑定事件
					_this.hover(function() {
						//tooltip的样式
						var tooltipParams = {
							"background": "rgba(0,0,0,0.8)",
							"color": "#FFFFFF",
							"font-size": "12px",
							"border-radius": "5px",
							"padding": "10px",
							"position": "absolute",
							"top": "0px",
							"left": "0px",
							"z-index": "999999",
							"line-height": "20px",
							"display": "none"
						}

						//小三角形的样式
						var triangleParams = {
							"position": "absolute",
							"left": "20px",
							"bottom": "-16px",
							"width": "0",
							"height": "0",
							"border-left": "solid 8px transparent",
							"border-right": "solid 8px transparent",
							"border-bottom": "solid 8px transparent",
							"border-top": "solid 8px " + (scope.tooltipBackground || "rgba(0,0,0,0.8)")
						}

						var tooltipStyle = "";
						var triangleStyle = "";

						//6.设置tooltip的样式
						tooltipParams.background = scope.tooltipBackground || "rgba(0,0,0,0.8)";
						for(var i in tooltipParams) {
							tooltipStyle += i + ":" + tooltipParams[i] + ";";
						}
						$tooltip.attr("style", tooltipStyle);

						//7.设置小三角的样式
						var triangleStyle = "";
						for(var i in triangleParams) {
							triangleStyle += i + ":" + triangleParams[i] + ";";
						}
						$i.attr("style", triangleStyle);

						//8.获取需要显示的文本
						$tooltip.find("#tooltip-text").html(_this.attr("tooltip-data"));

						//9.放到body里
						angular.element("body").append($tooltip);

						//10.计算物理位置
						var fatherLeft = _this.offset().left; //获取父元素距离窗口的距离
						var fatherTop = _this.offset().top;
						var fatherWidth = _this.outerWidth(); //父元素的width
						var tooltipWidth = $tooltip.outerWidth(); //tooltip消息框的width
						var toolTipHeight = $tooltip.outerHeight(); //tooltip消息框的height

						//11.tip消息框的位置
						var tipLeft = (fatherLeft + (fatherWidth - tooltipWidth) / 2);
						var tipTop = fatherTop - toolTipHeight - 10;

						//12.小三角的位置
						(function() {
							var triangleLeft = tooltipWidth / 2 - 8; //减8是因为三角形有8px的边框线
							//13.tip消息框：特殊处理,如果tip文字 太长，位置需要调整
							if(tipLeft <= 0) {
								tipLeft = 1;
								triangleLeft = (fatherLeft + (fatherWidth - tooltipWidth) / 2) + tooltipWidth / 2 - 8; //减8是因为三角形有8px的边框线
							}
							//设置小三角的位置
							$tooltip.find("i").css("left", triangleLeft + "px");
						})();

						//14.显示tooltip
						$tooltip.css({
							"left": tipLeft + "px",
							"top": tipTop + "px"
						}).fadeIn(300);

					}, function() {
						//隐藏
						$tooltip.remove();
					});
				}
			}
		})
})();