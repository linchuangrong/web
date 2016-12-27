/**
 * 作者：林创荣
 * 功能：首页
 * 时间：2016年9月12日
 */
(function() {
	'use strict';

	//app.import('/app/Tpl/web/js/service/index.service.js', 'index.service'); //引入“首页indexService”数据接口服务

	app.addController("indexController", indexController);
	indexController.$inject = ['$rootScope', '$interval', '$window', '$scope'];

	function indexController($rootScope, $interval, $window, $scope) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "益齐，公益一起做";
		var vm = this;
	
	}
})();