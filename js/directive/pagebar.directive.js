/**
 * 分页插件
 * 林创荣
 * 2016年9月15日
 * 注意事项：在pageChange()中，要重新给current赋值，否则页码不会变
 */
(function() {
	'use strict';
	angular.module('pagebar.directive', [])
		.directive('pageBar', function() {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					pageCount: '=', //页码总数
					current: '=', //当前页码
					pageChange: '&', //页面跳转事件
					showPage: '@', //展示的页码数量
					hideJump: '@', //是否隐藏掉 “跳转页码” 输入框
				},
				link: function(scope, ele, attr) {
					scope.inputPage = "";
					scope.pagenums = [];

					//跳转到指定页面
					scope.goToPage = function(toshowPage) {
						if(toshowPage == scope.current) {
							return false;
						} else {
							scope.pageChange()(parseInt(toshowPage.toString()));
						}
					}

					//根据当前页码，设置需要显示的页码
					//比如，当前为5，则显示3，4，5，6，7
					scope.setShowPageNum = function() {
						//如果有正常的值，比如1，2，3
						if(scope.current >= 1) {
							scope.pagenums = [];
							var min = 0; //左侧开始显示的页码
							var max = 0; //右侧结束显示的页码
							if(scope.pageCount >= scope.showPage) {

								min = scope.current - Math.ceil(scope.showPage / 2) + 1;
								max = scope.current + Math.floor(scope.showPage / 2);

								//在左侧
								if(min <= 0) {
									min = 1;
									max = scope.showPage;
								}

								//在右侧
								if(max >= scope.pageCount) {
									max = scope.pageCount;
									//下面这个判断，使页面最少显示的页码，都有scope.showPage个
									min = scope.pageCount - scope.showPage + 1;
								}
							} else {
								min = 1;
								max = scope.pageCount;
							}
							//将页码放进数组里
							for(; min <= max; min++) {
								scope.pagenums.push(min);
							}
							//console.log(scope.pagenums);

							//设置右侧...按钮是否显示。但是根据美观性，这里对应的html已经设置了display:none；所以这个并没有什么卵用。
							if(min > 1) {
								scope.showLeftCircle = true;
							} else {
								scope.showLeftCircle = false;
							}

							//设置右侧...按钮是否显示
							if(max < scope.pageCount) {
								scope.showRightCircle = true;
							} else {
								scope.showRightCircle = false;
							}
						}
					}

					//监听页码是否发生变化
					scope.$watch('current + pageCount', function(newValue, oldValue) {
						scope.setShowPageNum();
					});

					//监听输入框的页码，是否为整数
					scope.$watch('inputPage', function(newValue, oldValue) {
						scope.inputPage = scope.inputPage.replace(/\D/g, '');
					});

					//上一页
					scope.prevPage = function() {
						if(scope.current - 1 <= 0) {
							return false;
						} else {
							//加载数据
							scope.goToPage(scope.current - 1);
						}
					}

					//下一页
					scope.nextPage = function() {
						if(scope.current + 1 > scope.pageCount) {
							return false;
						} else {
							//加载数据
							scope.goToPage(scope.current + 1);
						}
					}

				},
				template: '<div class="page-bar" ng-show="pageCount>0">' +
					'<ul class="pagination">' +
					//第一页
					'<li><a ng-click="goToPage(1)"><span>&laquo;</span></a></li>' +
					//上一页
					'<li><a ng-click="prevPage()"><span>&lsaquo;</span></a></li>' +
					//左侧...
					'<li ng-show="showLeftCircle" style="display:none;"><a>...</a></li>' +
					//默认加载循环出所有li，然后判断每个li的页码是否处于current的左边2个，以及是否处于current的右边2个
					//至于为什么是左边2个，右边2个，是通过计算showPage/2
					//一般showPage等于5 
					//ng-show="(pagenum>(current - showPage/2))&&(pagenum<(current + showPage/2))"
					'<li ng-repeat="pagenum in pagenums" ng-click="goToPage(pagenum)"  ng-class="{active:pagenum==current}"><a>{{pagenum}}</a></li>' +
					//右侧...
					'<li ng-show="showRightCircle"><a>...</a></li>' +
					//下一页
					'<li><a ng-click="nextPage()"><span>&rsaquo;</span></a></li>' +
					//最后一页
					'<li><a ng-click="goToPage(pageCount)"><span>&raquo;</span></a></li>' +
					'</ul>' +
					'<div class="jump-page-box" ng-hide="hideJump">跳至<input type="tel" value="" ng-model="inputPage" />页<button type="button" class="button button-32" ng-click="goToPage(inputPage)">跳转</button></div>' +
					'<div class="page-count-box">共<span ng-bind="pageCount"></span>页</div>' +
					'</div>'
			}
		});
})();

/*样式*/
/*
    div.page-bar {
	  font-size: 14px;
	  -moz-user-select: none;
	  -webkit-user-select: none;
	  -ms-user-select: none;
	}
	div.page-bar .pagination {
	  display: inline-block;
	  vertical-align: middle;
	  padding-left: 0;
	  border-radius: 4px;
	}
	div.page-bar .pagination > li {
	  display: inline;
	}
	div.page-bar .pagination > li > a,
	div.page-bar .pagination > li > span {
	  cursor: pointer;
	  position: relative;
	  float: left;
	  padding: 6px 12px;
	  margin-left: -1px;
	  font-size: 14px;
	  line-height: 20px;
	  color: #5cb85c;
	  text-decoration: none;
	  background-color: #fff;
	  border: 1px solid #ddd;
	}
	div.page-bar .pagination > li > a:hover,
	div.page-bar .pagination > li > span:hover {
	  z-index: 3;
	  color: #449d44;
	  background-color: #eee;
	  border-color: #ddd;
	}
	div.page-bar .pagination > li:first-child > a,
	div.page-bar .pagination > li:first-child > span {
	  margin-left: 0;
	  border-top-left-radius: 4px;
	  border-bottom-left-radius: 4px;
	}
	div.page-bar .pagination > li:last-child > a,
	div.page-bar .pagination > li:last-child > span {
	  border-top-right-radius: 4px;
	  border-bottom-right-radius: 4px;
	}
	div.page-bar .pagination > .active > a,
	div.page-bar .pagination > .active > a:hover,
	div.page-bar .pagination > .active > span,
	div.page-bar .pagination > .active > span:hover {
	  z-index: 2;
	  color: #fff;
	  cursor: default;
	  background-color: #5cb85c;
	}
	div.page-bar .jump-page-box {
	  line-height: 34px;
	  color: #888888;
	  display: inline-block;
	  margin-left: 30px;
	}
	div.page-bar .jump-page-box input {
	  line-height: normal;
	  margin: 0 5px;
	  padding-left: 5px;
	  padding-right: 5px;
	  width: 50px;
	  height: 32px;
	  font-size: 14px;
	  border: 1px solid #ddd;
	  -moz-border-radius: 4px;
	  -webkit-border-radius: 4px;
	  border-radius: 4px;
	  overflow: hidden;
	  text-align: center;
	  vertical-align: bottom;
	  -webkit-transform: translate(0, -1px);
	  -moz-transform: translate(0, -1px);
	  -ms-transform: translate(0, -1px);
	  transform: translate(0, -1px);
	}
	div.page-bar .jump-page-box .button {
	  margin: 0 5px;
	  vertical-align: bottom;
	  -webkit-transform: translate(0, -1px);
	  -moz-transform: translate(0, -1px);
	  -ms-transform: translate(0, -1px);
	  transform: translate(0, -1px);
	}
	div.page-bar .page-count-box {
	  margin-left: 20px;
	  line-height: 34px;
	  color: #888888;
	  display: inline-block;
	}
 */