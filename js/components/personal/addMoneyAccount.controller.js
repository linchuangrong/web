/**
 * 作者：林创荣
 * 功能：帐户设置-收款帐户
 * 时间：2016年9月19日
 */
(function() {
	'use strict';

	app.addController("addMoneyAccountController", addMoneyAccountController);
	addMoneyAccountController.$inject = ['$rootScope', 'personalService', '$state'];

	function addMoneyAccountController($rootScope, personalService, $state) {
		$rootScope.title = "帐户设置-添加收款帐户";
		var vm = this;

		//如果已经绑定了支付宝，则进入此界面，马上跳转出去，并提示已经绑定过
		if($rootScope.userInfo.is_alipay == 1) {
			window.showAutoDialog("您已经绑定过支付宝了，不可重复绑定");
			$state.go("personal.moneyAccount");
		}

		/*****************变量 begin****************/

		//支付宝表单
		vm.setAliPayForm = {
			alipay_user: "", //支付宝账号
			rep_alipay_user: "", //支付宝账号2
			real_name: "", //真实姓名
			verify_coder: "" //验证码
		}
		vm.flag = {
			setAliPayFlag: true //标识量
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.setAliPaySubmit = setAliPaySubmitFn;

		/*****************函数 end****************/

		//
		//
		//
		//
		//
		//---------------------------------绑定支付宝-------------------------------------
		//
		//
		//
		//
		//
		function setAliPaySubmitFn() {

			if(vm.setAliPayForm.alipay_user != vm.setAliPayForm.rep_alipay_user) {
				window.showAlertTip("两次帐号不一致");
				return false;
			}

			//防止重复点击
			if(vm.flag.setAliPayFlag == false) {
				return false;
			}

			var params = {
				"id": $rootScope.userInfo.id, //用户id
				"username": $rootScope.userInfo.user_name, //用户名
				"alipay_user": vm.setAliPayForm.alipay_user, // 支付宝账号
				"rep_alipay_user": vm.setAliPayForm.rep_alipay_user, // 支付宝账号2
				"real_name": vm.setAliPayForm.real_name, //真实姓名
				"verify_coder": vm.setAliPayForm.verify_coder //验证码
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			//设置为false
			vm.flag.setAliPayFlag = false;
			//接口请求
			personalService.setAliPay(params).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if(data.data.code == 20000) {
							window.showAutoDialog(data.data.msg);
							//页面跳转
							$state.go("personal.moneyAccount");
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch(e) {
					//TODO handle the exception
				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.setAliPayFlag = true;
				}

			});
		}

	}
})();