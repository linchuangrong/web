//例子：
//<ul>
//	<li ng-repeat="item in index.oldActiveArray" img-lazy-load>
//		<img class="img-lazy-load" img-lazy-load-src="{{public.imgUrl}}/{{item}}">
//	</li>
//</ul>

angular.module('imgLazyLoad', [])
	.directive('imgLazyLoad', ['$timeout', '$window', function($timeout, $window) {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if(scope.$last === true) {
					$timeout(function() {
						lazyLoadFn();
					});
				}

				function lazyLoadFn() {
					var imgList = getElements("img-lazy-load", "img-lazy-load-src");
					//生成绑定事件
					var eventObj = {
						scrollEvent: function() {
							setImageSrc();
						}
					}
					
					angular.element($window).bind("scroll", eventObj.scrollEvent);
					//立即执行
					setImageSrc();

					function setImageSrc() {
						var scrollTop = angular.element($window).scrollTop();
						var winHeight = angular.element($window).height();
						for(var i = 0; i < imgList.length; i++) {
							var offsetTop = angular.element(imgList[i]).offset().top;
							//判断图片是否在可视窗口内
							if(isScrollToView(offsetTop, scrollTop, winHeight)) {
								angular.element(imgList[i]).attr("src", angular.element(imgList[i]).attr("img-lazy-load-src"));
								//动画效果：立即隐藏，然后渐显
								angular.element(imgList[i]).fadeOut(0).fadeIn(300);
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
					//获取到需要懒加载背景图片的dom对象后，把class删除，防止又被重复获取
					var elements = element.parent().find("." + name).removeClass("." + name);
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