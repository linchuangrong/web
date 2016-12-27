/**
 * 林创荣
 * 功能：动态加载js
 * 2016年9月28日
 */
(function() {
	'use strict';
	
	app.import('/app/Tpl/web/js/libs/ocLazyLoad/ocLazyLoad.js', 'oc.lazyLoad'); //引入oclazyload
	
	angular.module("load.file", ["oc.lazyLoad"])
		.service("loadFile", ["$ocLazyLoad", function($ocLazyLoad) {
			this.load = function(src) {
				return function() {
					return $ocLazyLoad.load(src);
				}
			}
		}]);
})()