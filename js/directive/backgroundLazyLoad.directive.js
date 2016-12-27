/**
 * 背景图片懒加载
 * 林创荣
 * 2016年9月15日
 * 例子：
 * 	<ul>
		<li ng-repeat="item in index.oldActiveArray" background-lazy-load>
			<a href="javascript:;" class="background-lazy-load" lazy-load-src="{{public.imgUrl}}/{{item}}"></a>
		</li>
	</ul>
 */
angular.module('backgroundLazyLoad.directive', [])
	.directive('backgroundLazyLoad', ['$timeout', '$window', function($timeout, $window) {
		return {
			restrict: 'A',
			link: function(scope, ele, attr) {
				if(scope.$last === true) {
					//console.log("懒加载");
					$timeout(function() {
						lazyLoadFn();
					});
				}

				function lazyLoadFn() {
					var imgList = getElements("background-lazy-load", "lazy-load-src");
					//生成绑定事件
					var eventObj = {
						scrollEvent: function() {
							setImageSrc();
						}
					}

					//绑定滚动事件
					angular.element($window).bind("scroll", eventObj.scrollEvent);
					//立即执行
					setImageSrc();

					function setImageSrc() {
						var scrollTop = angular.element($window).scrollTop();
						var winHeight = angular.element($window).height();
						for(var i = 0; i < imgList.length; i++) {
							//console.log("进入循环查找中...");
							var offsetTop = angular.element(imgList[i]).offset().top;
							//判断图片是否在可视窗口内
							if(isScrollToView(offsetTop, scrollTop, winHeight)) {
								//console.log("找到了");
								angular.element(imgList[i]).css("background-image", "url('" + angular.element(imgList[i]).attr("lazy-load-src") + "')");
								//动画效果：立即隐藏，然后渐显
								angular.element(imgList[i]).fadeOut(0).fadeIn(700);
								//加载图片后，删除掉数组里的图片的占位
								imgList.splice(i, 1);
								//因为删除掉一个图片后，数组长度会减1，所以这里i要减1
								i--;
							}
						}
						//如果某个循环里的图片已经加载结束，则解绑scroll事件
						if(imgList.length == 0) {
							angular.element($window).unbind("scroll", eventObj.scrollEvent);
							//console.log("解绑成功");
							return false;
						}
					}
				}

				function getElements(name, attr) {
					//var elements=document.getElementsByTagName(name);
					//var elements = document.querySelectorAll(name);
					//获取到需要懒加载背景图片的dom对象后，把class删除，防止又被重复获取
					var elements = ele.parent().find("." + name).removeClass("." + name);
					var arrays = [];
					for(var i = 0; i < elements.length; i++) {
						if(angular.element(elements[i]).attr(attr)) {
							arrays.push(elements[i]);
						}
					}
					return arrays;
				}

				function isScrollToView(offsetTop, scrollTop, winHeight) {
					//判断图片是否在可视窗口内
					//需要满足条件： “滚动条距离+浏览器窗口高>图片位置”    而且    “滚动条距离<图片位置”
					return scrollTop + winHeight > offsetTop && scrollTop < offsetTop;
				}
			}
		}
	}]);