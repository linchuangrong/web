/**
 * 作者：林创荣
 * 功能：众筹中心
 * 时间：2016年9月28日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/backgroundLazyLoad.directive.js', 'backgroundLazyLoad.directive'); //懒加载背景图片插件
	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件
	app.import('/app/Tpl/web/js/service/crowdFund.service.js', 'crowdFund.service'); //引入“个人中心”接口 服务

	app.addController("crowdFundListController", crowdFundListController);
	crowdFundListController.$inject = ['$rootScope', '$window', 'crowdFundService'];

	function crowdFundListController($rootScope, $window, crowdFundService) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "众筹中心";
		var vm = this;

		/*****************变量 begin****************/

		vm.selectType = "全部"; //行业筛选
		vm.selectProgress = "全部"; //项目进程
		vm.selectSort = "全部"; //项目排序

		vm.crowdFundTypeArray = []; //众筹类型
		vm.crowdFundArray = [];

		vm.searchForm = {
			welfare_cate: "", //众筹类型
			process: "", //
			sort: "", //
			orderBy: "ASC", //ASC,DESC
		}

		//活动列表分页参数
		vm.pageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 12, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn //切换页面函数
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getCrowdFundTypeList = getCrowdFundTypeListFn; //获取众筹类型
		vm.getCrowdFundList = getCrowdFundListFn;
		vm.setSelectActive = setSelectActiveFn; //设置被选中active

		/*****************函数 end****************/

		(function init() {
			vm.getCrowdFundTypeList();
			vm.getCrowdFundList();
		})();

		//
		//
		//
		//
		//
		//----------------------------获取众筹类型------------------------------------------
		//
		//
		//
		//
		//
		function getCrowdFundTypeListFn() {
			crowdFundService.getCrowdFundTypeList().success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if(data.data.code == 20000) {
						vm.crowdFundTypeArray = data.data.list;
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
		//----------------------------获取众筹列表数据------------------------------------------
		//
		//
		//
		//
		//
		function getCrowdFundListFn() {

			var params = {
				deal_type: '3',
				pageSize: vm.pageParams.pageSize,
				current: vm.pageParams.current,
				welfare_cate: vm.searchForm.welfare_cate, //众筹类型
				process: vm.searchForm.process, //进度
				sort: vm.searchForm.sort, //排序
				orderBy: vm.searchForm.orderBy, //ASC,DESC
			}

			crowdFundService.getCrowdFundList(params).success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if(data.data.code == 20000) {
						vm.crowdFundArray = data.data.list;
						vm.pageParams.page_count = data.data.page_count;
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
				if(parseInt(param) > 0 && parseInt(param) <= vm.pageParams.page_count) {
					//修改页码
					vm.pageParams.current = parseInt(param);
					//获取数据
					vm.getCrowdFundList();
					//滚动到顶部
					angular.element($window).scrollTop(0);
				} else {
					console.log("输入非法");
				}
			}
		}
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
		function setSelectActiveFn($event, name, param) {

			//设置筛选参数
			vm.searchForm[name] = param;

			//设置排序
			var iconfont = angular.element($event.target).find(".iconfont");
			if(iconfont) {
				if(iconfont.hasClass("up")) {
					iconfont.removeClass("up");
					vm.searchForm.orderBy = "DESC"; //从大到小排序
				} else {
					iconfont.addClass("up");
					vm.searchForm.orderBy = "ASC"; //从小到大排序
				}
			}

			//分页页码为1页
			vm.pageParams.current = 1;

			//获取数据
			vm.getCrowdFundList();
		}
	}
})();