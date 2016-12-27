/**
 * 作者：林创荣
 * 功能：我参加的-我的收藏
 * 时间：2016年9月18日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件

	app.addController("collectionController", collectionController);
	collectionController.$inject = ['$rootScope', 'personalService', '$window'];

	function collectionController($rootScope, personalService, $window) {
		$rootScope.title = "我的收藏";
		var vm = this;

		/*****************变量 begin****************/

		vm.activePanel = "activity"; //默认显示我收藏的活动

		//活动列表分页参数
		vm.activityPageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 10, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: activityPageChangeFn //切换页面函数
		}
		vm.activityArray = []; //活动列表数组

		//众筹列表分页参数
		vm.crowdFundPageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 3, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: crowdFundPageChangeFn //切换页面函数
		}
		vm.crowdFundArray = []; //活动列表数组

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.setActivePanel = setActivePanelFn; //切换选项卡

		vm.getUserCollectActivity = getUserCollectActivityFn; //获取用户收藏的活动
		vm.getUserCollectCrowdFund = getUserCollectCrowdFundFn; //获取用户收藏的众筹

		/*****************函数 end****************/

		(function init() {
			vm.getUserCollectActivity(); ////获取用户收藏的活动
		})();

		function setActivePanelFn(param) {
			if (param == vm.activePanel) {
				return false;
			} else {
				vm.activePanel = param;
				if (param == 'activity') {
					//活动列表分页参数
					vm.activityPageParams = {
						showPage: 5, //显示多少个页码提供用户点击，不会变
						pageSize: 3, //1页显示的数量,不会变
						current: 1, //当前页
						page_count: 1, //总共多少页
						pageChange: activityPageChangeFn //切换页面函数
					}
					vm.getUserCollectActivity();
				} else if (param == 'crowdFund') {
					//众筹列表分页参数
					vm.crowdFundPageParams = {
						showPage: 5, //显示多少个页码提供用户点击，不会变
						pageSize: 3, //1页显示的数量,不会变
						current: 1, //当前页
						page_count: 1, //总共多少页
						pageChange: crowdFundPageChangeFn //切换页面函数
					}
					vm.getUserCollectCrowdFund();
				}
			}

		}
		//
		//
		//
		//
		//
		//-----------------------------获取活动列表-----------------------------------------
		//
		//
		//
		//
		//
		function getUserCollectActivityFn() {
			var params = {
				"username": $rootScope.userInfo.user_name,
				"id": $rootScope.userInfo.id,
				"type": 1, //活动是1，众筹是3
				"pageSize": vm.activityPageParams.pageSize,
				"current": vm.activityPageParams.current
			}
			personalService.getUserCollectActivity(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.activityArray = data.data.list;
						vm.activityPageParams.page_count = data.data.page_count; //总页码
						//请求结束
						vm.loaded1 = true;
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
		//----------------------------活动分页事件------------------------------------------
		//
		//
		//
		//
		//
		function activityPageChangeFn() {
			return function(param) {
				if (parseInt(param) > 0 && parseInt(param) <= vm.activityPageParams.page_count) {
					//修改页码
					vm.activityPageParams.current = parseInt(param);
					//获取数据
					vm.getUserCollectActivity();
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
		//-----------------------------获取众筹列表-----------------------------------------
		//
		//
		//
		//
		//
		function getUserCollectCrowdFundFn() {
			var params = {
				"username": $rootScope.userInfo.user_name,
				"id": $rootScope.userInfo.id,
				"type": 3, //活动是1，众筹是3
				"pageSize": vm.crowdFundPageParams.pageSize,
				"current": vm.crowdFundPageParams.current
			}
			personalService.getUserCollectActivity(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.crowdFundArray = data.data.list;
						vm.crowdFundPageParams.page_count = data.data.page_count; //总页码
						//请求结束
						vm.loaded2 = true;
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
		//----------------------------众筹分页事件------------------------------------------
		//
		//
		//
		//
		//
		function crowdFundPageChangeFn() {
			return function(param) {
				if (parseInt(param) > 0 && parseInt(param) <= vm.crowdFundPageParams.page_count) {
					//修改页码
					vm.crowdFundPageParams.current = parseInt(param);
					//获取数据
					vm.getUserCollectCrowdFund();
					//滚动到顶部
					angular.element($window).scrollTop(0);
				} else {
					console.log("输入非法");
				}
			}
		}

	}
})();