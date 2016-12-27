/**
 * 作者：林创荣
 * 功能：个人中心
 * 时间：2016年9月18日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件

	app.addController("personalHomeController", personalHomeController);
	personalHomeController.$inject = ['$rootScope', 'personalService', '$filter', '$window'];

	function personalHomeController($rootScope, personalService, $filter, $window) {
		$rootScope.title = "个人中心";
		var vm = this;

		/*****************变量 begin****************/

		//分页参数
		vm.pageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 10, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn //切换页面函数
		}

		vm.activityArray = []; //发布的活动列表   或者    参与的活动列表

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getActiivtyList = getActiivtyListFn; //获取活动列表
		vm.setActivityStop = setActivityStopFn; //设置活动是否已经结束（进行中，已结束）

		/*****************函数 end****************/

		(function init() {
			vm.getActiivtyList();
		})();

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
		function getActiivtyListFn() {
			if ($rootScope.userInfo.identity_conditions == '0') {
				//获取主办方添加的活动列表
				var params = {
					"id": $rootScope.userInfo.id,
					"username": $rootScope.userInfo.user_name,
					"pageSize": vm.pageParams.pageSize,
					"current": vm.pageParams.current,
					"type": 1
				}
				personalService.getUserAddActivity(params).success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							vm.activityArray = data.data.list;
							vm.pageParams.page_count = data.data.page_count; //总页码
							//请求结束
							vm.loaded1 = true;
							//循环添加一个属性，记录年月
							angular.forEach(vm.activityArray, function(data) {
								data["year_month"] = $filter('toYearMonth')(data["begin_time"]);
							});
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}

				});
			} else {
				//获取用户参与的活动
				var params = {
					"id": $rootScope.userInfo.id,
					"username": $rootScope.userInfo.user_name,
					"pageSize": vm.pageParams.pageSize,
					"current": vm.pageParams.current,
					"type": 1
				}
				personalService.getUserJoinActivity(params).success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							vm.activityArray = data.data.list;
							vm.pageParams.page_count = data.data.page_count; //总页码
							//请求结束
							vm.loaded2 = true;
							//循环添加一个属性，记录年月
							angular.forEach(vm.activityArray, function(data) {
								data["year_month"] = $filter('toYearMonth')(data["begin_time"]);
							});
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				});
			}
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
					vm.getActiivtyList();
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
		//-----------------------------检查活动是否已经结束（param=结束时间）-----------------------------------------
		//
		//
		//
		//
		//
		function setActivityStopFn(param) {
			var now = Date.parse(new Date()) / 1000;
			if (now >= param) {
				return true; //已经停止
			} else {
				return false; //进行中
			}
		}

	}
})();