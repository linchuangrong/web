/**
 * 作者：林创荣
 * 功能：活动列表
 * 时间：2016年9月13日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/backgroundLazyLoad.directive.js', 'backgroundLazyLoad.directive'); //懒加载背景图片插件
	app.import('/app/Tpl/web/js/service/public.service.js', 'public.service'); //引入“公共接口”服务
	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件
	app.import('/app/Tpl/web/js/service/activity.service.js', 'activity.service'); //引入“众筹”接口 服务

	app.addController("activityListController", activityListController);
	activityListController.$inject = ['$rootScope', '$window', 'activityService', 'publicService', '$stateParams'];

	function activityListController($rootScope, $window, activityService, publicService, $stateParams) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "活动中心";
		var vm = this;

		/*****************变量 begin****************/

		vm.searchForm = {
			"address": "", //城市
			"cate": "", //活动类型
			"time": "", //时间
			"keyword": "" //搜索关键字
		}

		//活动列表分页参数
		vm.pageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 10, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn //切换页面函数
		}

		vm.activityListArray = []; //活动列表数组
		vm.activityTypeArray = []; //活动类型数组
		vm.rightListArray = ["example-slide-1.jpg", "example-slide-2.jpg", "example-slide-3.jpg", "example-slide-4.jpg"]; //右侧活动列表数组

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getActivityList = getActivityListFn; //获取活动列表数据

		vm.setSelectActive = setSelectActiveFn; //设置被选中active

		vm.showDate = showDateFn; //显示日期插件

		/*****************函数 end****************/

		(function init() {

			vm.searchForm.address = $stateParams.address; //城市地址
			vm.searchForm.cate = $stateParams.cate; //活动类型
			vm.searchForm.time = $stateParams.time; //筛选时间
			vm.searchForm.keyword = $stateParams.keyword; //搜索关键字

			vm.getActivityList(); //活动数组

		})();

		//
		//
		//
		//
		//
		//----------------------------活动类别，形式，标签------------------------------------------
		//
		//
		//
		//
		//
		//获取活动类别，形式，标签等
		function getActivityTypeFn() {
			publicService.getActivityType().success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					var result = data.data;
					if (result.code == 20000) {
						vm.activityTypeArray = result.cate; //活动类别
					}
				}
			});
		}

		//
		//
		//
		//
		//
		//----------------------------日期时间控件------------------------------------------
		//
		//
		//
		//
		//
		function showDateFn() {
			laydate({
				elem: '#selectDateInput',
				istime: false, //取消时，分，秒
				format: 'YYYY-MM-DD',
				//min: laydate.now(), //最小日期是今天
				isclear: false, //隐藏清空按钮
				istoday: false, //隐藏掉今天按钮
				choose: function(dates) {
					$rootScope.$apply(function() {
						vm.selectDateInput = dates;
						vm.searchForm.time = dates;

						vm.getActivityList();
					});
				}
			});
		}

		//
		//
		//
		//
		//
		//----------------------------获取活动列表数据------------------------------------------
		//
		//
		//
		//
		//
		function getActivityListFn() {

			var params = {
				"deal_type": 1,
				"pageSize": vm.pageParams.pageSize,
				"current": vm.pageParams.current,
				"address": vm.searchForm.address, //地点
				"cate": vm.searchForm.cate, //类型
				"keyword": vm.searchForm.keyword, //搜索关键字
				"start_time": publicService.getTimeStamp(vm.searchForm.time).startTimeStamp, //开始时间
				"end_time": publicService.getTimeStamp(vm.searchForm.time).endTimeStamp, //结束时间
			}
			activityService.getActivityList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.activityListArray = data.data.list;
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
					vm.getActivityList();
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
		//----------------------------页面顶部筛选事件------------------------------------------
		//
		//
		//
		//
		//
		function setSelectActiveFn(name, param) {
			//设置筛选参数
			vm.searchForm[name] = param;
			//分页页码为1页
			vm.pageParams.current = 1;
			//获取数据
			vm.getActivityList();
		}
	}
})();