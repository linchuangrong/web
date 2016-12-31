/**
 * 作者：林创荣
 * 功能：我参加的-我的关注
 * 时间：2016年9月18日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件
	app.import('/app/Tpl/web/js/service/service_min/sponsor.service.min.js', 'sponsor.service'); //引入“主办方”接口 服务

	app.addController("concernController", concernController);
	concernController.$inject = ['$rootScope', 'personalService', '$window', 'sponsorService', '$state'];

	function concernController($rootScope, personalService, $window, sponsorService, $state) {
		$rootScope.title = "我的关注";
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
		vm.sponsorArray = []; //参与的活动

		vm.flag = {
			cancelFocusFlag: true, //取消关注按钮 
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getFocusSponsorList = getFocusSponsorListFn; //获取用户关注的主办方
		vm.cancelFocus = cancelFocusFn; //取消关注

		/*****************函数 end****************/

		(function init() {
			vm.getFocusSponsorList();
		})();

		//
		//
		//
		//
		//
		//-----------------------------获取用户关注的主办方-----------------------------------------
		//
		//
		//
		//
		//
		function getFocusSponsorListFn() {
			var params = {
				"username": $rootScope.userInfo.user_name,
				"user_id": $rootScope.userInfo.id,
				"pageSize": vm.pageParams.pageSize,
				"current": vm.pageParams.current,
				"type": 1
			}
			personalService.getFocusSponsorList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.sponsorArray = data.data.list;
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
				if (parseInt(param) > 0 && parseInt(param) <= vm.pageParams.page_count) {
					//修改页码
					vm.pageParams.current = parseInt(param);
					//获取数据
					vm.getFocusSponsorList();
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
		//----------------------------取消关注------------------------------------------
		//
		//
		//
		//
		//
		function cancelFocusFn(id) {

			if (!vm.flag.cancelFocusFlag) {
				return false;
			}

			var params = {
				"user_id": $rootScope.userInfo.id,
				"sponsor_id": id,
				"username": $rootScope.userInfo.user_name
			}
			vm.flag.cancelFocusFlag = false;
			sponsorService.getSponsorFocus(params).success(function(data) {
				try {
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
				} catch (e) {

				} finally {
					vm.flag.cancelFocusFlag = true;
				}

			});
		}

	}
})();