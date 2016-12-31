/**
 * 作者：林创荣
 * 功能：主办方列表
 * 时间：2016年10月24日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件
	app.import('/app/Tpl/web/js/service/service_min/sponsor.service.min.js', 'sponsor.service'); //引入“主办方”接口 服务

	app.addController("sponsorListController", sponsorListController);
	sponsorListController.$inject = ['$rootScope', '$window', 'sponsorService', '$state', '$stateParams'];

	function sponsorListController($rootScope, $window, sponsorService, $state, $stateParams) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "主办方列表";
		var vm = this;

		/*****************变量 begin****************/

		vm.sponsorArray = [];

		//分页参数
		vm.pageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 12, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn //切换页面函数
		}

		vm.searchForm = {
			select_type: "", //行业中文汉字
			sort: "ASC", //ASC,DESC
			orderBy: "", //排序条件(fans,reg_time,build_count)
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getSponsorList = getSponsorListFn; //获取主办方列表数据
		vm.setSelectActive = setSelectActiveFn; //设置被选中active
		vm.focusSponsor = focusSponsorFn; //关注主办方，这个函数因为界面修改，已经不会触发了

		/*****************函数 end****************/

		(function init() {
			vm.getSponsorList();
		})();

		//
		//
		//
		//
		//
		//----------------------------获取主办方列表数据------------------------------------------
		//
		//
		//
		//
		//
		function getSponsorListFn() {
			var params = {
				"pageSize": vm.pageParams.pageSize,
				"current": vm.pageParams.current,
				"select_type": vm.searchForm.select_type,
				"orderBy": vm.searchForm.orderBy,
				"sort": vm.searchForm.sort,
				"keyword": ($stateParams.keyword && angular.element("#search-input").val()) ? $stateParams.keyword : '', //搜索关键字
			}
			sponsorService.getSponsorList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.sponsorArray = data.data.list;
						vm.pageParams.page_count = data.data.page_count;
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
					vm.getSponsorList();
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
			if (iconfont) {
				if (iconfont.hasClass("up")) {
					iconfont.removeClass("up");
					vm.searchForm.sort = "DESC"; //从大到小排序
				} else {
					iconfont.addClass("up");
					vm.searchForm.sort = "ASC"; //从小到大排序
				}
			}

			//分页页码为1页
			vm.pageParams.current = 1;

			//获取数据
			vm.getSponsorList();
		}
		//
		//
		//
		//
		//
		//----------------------------关注主办方------------------------------------------
		//
		//
		//
		//
		//
		function focusSponsorFn(id) {
			var params = {
				"user_id": $rootScope.userInfo.id,
				"sponsor_id": id,
				"username": $rootScope.userInfo.user_name
			}
			sponsorService.getSponsorFocus(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if (data.data.code == 20000) {
						window.showAlertTip(data.data.msg);
						$state.reload();
					} else {
						window.showAlertTip(data.data.msg);
					}
				}
			});
		}
	}
})();