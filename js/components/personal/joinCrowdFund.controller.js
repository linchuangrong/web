/**
 * 作者：林创荣
 * 功能：我的众筹
 * 时间：2016年9月18日
 */
(function() {
	'use strict';
	
	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件

	app.addController("joinCrowdFundController", joinCrowdFundController);
	joinCrowdFundController.$inject = ['$rootScope', 'personalService', '$window'];

	function joinCrowdFundController($rootScope, personalService, $window) {
		$rootScope.title = "我的众筹";
		var vm = this;

		/*****************变量 begin****************/

		//活动列表分页参数
		vm.pageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 10, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn //切换页面函数
		}
		vm.crowdFundArray = []; //众筹列表数组

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getCrowdFundList = getCrowdFundListFn; //获取众筹列表
		vm.setActivityStop = setActivityStopFn; //设置众筹是否已经结束（进行中，已结束）

		/*****************函数 end****************/

		(function init() {
			vm.getCrowdFundList();
		})();

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
		function getCrowdFundListFn() {
			var params = {
				"username": $rootScope.userInfo.user_name,
				"id": $rootScope.userInfo.id,
				"pageSize": vm.pageParams.pageSize,
				"current": vm.pageParams.current,
				"type": 3
			}
			personalService.getUserJoinActivity(params).success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if(data.data.code == 20000) {
						vm.crowdFundArray = data.data.list;
						vm.pageParams.page_count = data.data.page_count; //总页码
						//请求结束
						vm.loaded = true;
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
		//-----------------------------检查众筹是否已经结束（param=结束时间）-----------------------------------------
		//
		//
		//
		//
		//
		function setActivityStopFn(param) {
			var now = Date.parse(new Date()) / 1000;
			if(now >= param) {
				return true; //已经停止
			} else {
				return false; //进行中
			}
		}

	}
})();