/**
 * 作者：林创荣
 * 功能：软件开发
 * 时间：2016年12月14日
 */
(function() {
	'use strict';

	app.addController("softwareController", softwareController);
	softwareController.$inject = ['$rootScope', '$window'];

	function softwareController($rootScope, $window) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "软件开发";
		var vm = this;

		/*****************变量 begin****************/

		

		/*****************变量 end****************/

		/*****************函数 begin****************/

		

		/*****************函数 end****************/

	}
})();