/**
 * 作者：林创荣
 * 功能：添加表单
 * 时间：2016年9月21日
 */
(function() {
	'use strict';
	
	app.addController("addFormController", addFormController);
	addFormController.$inject = ['$rootScope', '$window'];

	function addFormController($rootScope, $window) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "添加表单";
		var vm = this;

	}
})();