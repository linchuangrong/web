/**
 * 作者：林创荣
 * 功能：评审/评估
 * 时间：2016年12月09日
 */
(function() {
	'use strict';

	app.addController("examineHomeController", examineHomeController);
	examineHomeController.$inject = ['$rootScope', '$window'];

	function examineHomeController($rootScope, $window) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "评审/评估";
		var vm = this;

		vm.show1 = true;
		vm.show2 = true;
		vm.show3 = true;

	}
})();