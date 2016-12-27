/**
 * 作者：林创荣
 * 功能：机构名录
 * 时间：2016年12月14日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/companyList.service.js', 'companyList.service'); //引入“机构名录”接口服务
	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件

	app.addController("companyListController", companyListController);
	companyListController.$inject = ['$rootScope', '$stateParams', 'companyListService', '$window'];

	function companyListController($rootScope, $stateParams, companyListService, $window) {
		$rootScope.title = "机构名录";
		var vm = this;

		/*****************变量 begin****************/

		//分页参数
		vm.pageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 3, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn //切换页面函数
		}

		vm.companyListArray = [];

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getCompanyList = getCompanyListFn; //获取机构名录

		vm.setCompany = setCompanyFn; //选择机构

		/*****************函数 end****************/

		(function init() {

			vm.getCompanyList(); //获取机构名录

		})();

		//
		//
		//
		//
		//
		//----------------------------机构名录------------------------------------------
		//
		//
		//
		//
		//
		function getCompanyListFn() {
			var params = {
				"pageSize": vm.pageParams.pageSize,
				"current": vm.pageParams.current,
			}
			companyListService.getCompanyList(params)
				.success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							vm.companyListArray = data.data.list;
							vm.pageParams.page_count = data.data.page_count;
							vm.selectCompany = data.data.list[0]; //默认选中第一个
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				});
		}
		//
		//
		//
		//
		//
		//----------------------------分页事件------------------------------------------
		//
		//
		//
		//
		//
		function pageChangeFn() {
			return function(param) {
				if (parseInt(param) > 0 && parseInt(param) <= vm.pageParams.page_count) {
					//修改页码
					vm.pageParams.current = parseInt(param);
					//获取数据
					vm.getCompanyList();
					//滚动到顶部
					angular.element($window)
						.scrollTop(0);
				} else {
					console.log("输入非法");
				}
			}
		}

		function setCompanyFn(item) {
			vm.selectCompany = item;
		}
	}
})();