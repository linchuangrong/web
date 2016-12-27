/**
 * 作者：林创荣
 * 功能：发布活动
 * 		url地址里，有传参数id即为编辑活动
 * 时间：2016年9月21日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/activity.service.js', 'activity.service'); //引入“活动”接口 服务

	app.addController("peopleListController", peopleListController);
	peopleListController.$inject = ['$rootScope', '$window', 'activityService', '$stateParams'];

	function peopleListController($rootScope, $window, activityService, $stateParams) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "名单管理";
		var vm = this;
		vm.id = $stateParams.id;

		/*****************变量 begin****************/

		vm.showTab = 'free'; //默认显示免费票名单

		vm.freeArray = []; //免费票名单
		vm.chargeArray = []; //收费票名单

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getPeopleList = getPeopleListFn; //获取名单列表

		/*****************函数 end****************/

		(function() {

			vm.getPeopleList(); //获取名单列表

		})();

		//
		//
		//
		//
		//
		//----------------------------获取名单列表------------------------------------------
		//
		//
		//
		//
		//
		function getPeopleListFn() {
			var params = {
				"deal_id": $stateParams.id,
			}
			activityService.getPeopleList(params).success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if(data.data.code == 20000) {
						vm.chargeArray = data.data.Charge_ticket;
						vm.freeArray = data.data.Free_ticket;

						if(vm.freeArray.length == '0') {
							vm.showTab = "charge";
						}
					} else {
						window.showAutoDialog(data.data.msg);
					}
				}
			});
		}
	}
})();