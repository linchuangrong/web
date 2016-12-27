/**
 * 作者：林创荣
 * 功能：帐户设置-收款帐户
 * 时间：2016年9月19日
 */
(function() {
	'use strict';

	app.addController("moneyAccountController", moneyAccountController);
	moneyAccountController.$inject = ['$rootScope', 'personalService'];

	function moneyAccountController($rootScope, personalService) {
		$rootScope.title = "帐户设置-收款帐户";
		var vm = this;

		vm.alipay_name = "";
		vm.alipay_user = "";
		vm.card_num = 0; //银行卡数量
		//
		//
		//
		//
		//
		//-----------------------------获取当前用户绑定的支付宝，绑定的银行卡数量-----------------------------------------
		//
		//
		//
		//
		//
		var params = {
			"id": $rootScope.userInfo.id,
			"username": $rootScope.userInfo.user_name
		}
		personalService.getUserPayInfo(params).success(function(data) {
			if(data.ret != 200) {
				window.showAutoDialog(data.msg);
			} else {
				if(data.data.code == 20000) {
					vm.alipay_name = data.data.alipay_name;
					vm.alipay_user = data.data.alipay_user;
					vm.card_num = data.data.card_num;
				} else {
					window.showAutoDialog(data.data.msg);
				}
			}
		});
	}
})();