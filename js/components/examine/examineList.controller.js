/**
 * 作者：林创荣
 * 功能：项目评审
 * 时间：2016年10月21日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件

	app.addController("examineListController", examineListController);
	examineListController.$inject = ['$rootScope', '$window'];

	function examineListController($rootScope, $window) {
		
		
		
		//  ========== 
		//  = 页面已废弃 = 
		//  ========== 
		
		
		angular.element($window).scrollTop(0);
		$rootScope.title = "项目评审";
		var vm = this;

		vm.selectType = "全部"; //行业筛选
		vm.selectProgress = "全部"; //项目进程
		vm.selectSort = "全部"; //项目排序

		vm.setSelectActive = setSelectActiveFn; //设置被选中active

		/**
		 * 分页
		 */
		vm.currentPage = 10;
		vm.showPageSize = 5;
		vm.pageCount = 33;
		vm.pageChange = pageChangeFn;

		//
		//
		//
		//
		//
		//----------------------------菜单选项的点击事件------------------------------------------
		//
		//
		//
		//
		//
		function setSelectActiveFn($event, type, param) {
			angular.element($event.target).addClass("active").parent().siblings().find("a").removeClass("active");
			vm[type] = param;
			console.log(vm.selectType);
			console.log(vm.selectProgress);
			console.log(vm.selectSort);
			angular.element($event.target).find(".iconfont").toggleClass("rotate");

		}
		//
		//
		//
		//
		//
		//----------------------------分页数据的加载------------------------------------------
		//
		//
		//
		//
		//
		function pageChangeFn() {
			return function(param) {
				console.log("跳转到的页面" + param);
				vm.currentPage=param;
			}
		}
	}
})();