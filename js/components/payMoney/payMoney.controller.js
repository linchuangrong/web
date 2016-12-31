/**
 * 作者：林创荣
 * 功能：订单支付
 * 时间：2016年11月18日
 */

(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/pay.service.min.js', 'pay.service'); //引入“支付”接口服务

	app.addController("payMoneyController", payMoneyController);
	payMoneyController.$inject = ['$rootScope', '$stateParams', 'payService', '$timeout'];

	function payMoneyController($rootScope, $stateParams, payService, $timeout) {
		$rootScope.title = "订单支付";
		var vm = this;

		/*****************变量 begin****************/

		vm.orderId = $stateParams.id; //订单编号
		vm.price = $stateParams.price; //价格、单价
		vm.num = $stateParams.num ? $stateParams.num : 1; //数量
		vm.Project_type = $stateParams.Project_type || '0'; //项目类型：0活动众筹，1评审评估

		vm.selectPayType = "wechat"; //默认支付宝
		vm.wechatUrl = ""; //微信支付二维码地址

		vm.payStatus = false; //支付结果

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getOrderPayUrl = getOrderPayUrlFn; //获取订单详情
		vm.setActive = setActiveFn; //选项支付方式
		vm.getOrderStatus = getOrderStatusFn; //查询支付结果状态

		/*****************函数 end****************/

		(function init() {
			//未登录，让其先登录
			if (!$rootScope.userInfo.id) {
				$state.go("login");
				return false;
			}

			vm.jumpUrl = $stateParams.url ? $stateParams.url : "personal.home";
		})();

		//
		//
		//
		//
		//
		//----------------------------获取订单的付款链接------------------------------------------
		//
		//
		//
		//
		//
		function getOrderPayUrlFn() {
			var params = {
				"type": "wechat",
				"order_no": vm.orderId,
				"user_id": $rootScope.userInfo.id,
				"Project_type": vm.Project_type
			}
			payService.getOrderPayUrl(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.wechatUrl = "https://eitty.cn/PhalApi/Library/Wechat_Pay/example/qrcode.php?data=" + data.data.code_url;
					} else {
						window.showAutoDialog(data.data.msg);
						return false;
					}
				}
			});

			vm.getOrderStatus(); //查询支付结果状态
		}
		//
		//
		//
		//
		//
		//----------------------------选项支付方式------------------------------------------
		//
		//
		//
		//
		//
		function setActiveFn(param) {
			vm.selectPayType = param;
		}
		//
		//
		//
		//
		//
		//----------------------------查询支付结果状态------------------------------------------
		//
		//
		//
		//
		//
		function getOrderStatusFn() {
			var params = {
				"order_no": $stateParams.id,
				"Project_type": vm.Project_type
			}
			payService.getOrderStatus(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//支付成功
							if (data.data.order_status == "1") {
								vm.payStatus = true;
								vm.deal_price = data.data.price;
							}
						} else {
							window.showAutoDialog(data.data.msg);
							return false;
						}
					}
				} catch (e) {
					//
				} finally {
					if (data.data.order_status != '1' && $rootScope.currentRouter == 'payMoney') {
						//轮循
						$timeout(function() {
							vm.getOrderStatus();
						}, 5000);
					}
				}
			});

		}

	}
})();