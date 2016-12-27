/**
 * 作者：林创荣
 * 功能：公益众筹
 * 时间：2016年10月8日
 */
(function() {
	'use strict';
	
	app.import('/app/Tpl/web/js/directive/backgroundLazyLoad.directive.js', 'backgroundLazyLoad.directive'); //懒加载背景图片插件

	app.addController("crowdFundController", crowdFundController);
	crowdFundController.$inject = ['$rootScope', '$window'];

	function crowdFundController($rootScope, $window) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "公益众筹";
		var vm = this;
		
		vm.crowdfundingArray = ["example-slide-1.jpg", "example-slide-2.jpg", "example-slide-3.jpg", "example-slide-4.jpg"];

	}
})();