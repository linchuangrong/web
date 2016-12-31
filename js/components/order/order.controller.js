/**
 * 作者：林创荣
 * 功能：预约评审
 * 时间：2016年12月19日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/public.service.min.js', 'public.service'); //引入“公共”接口 服务
	app.import('/app/Tpl/web/js/service/service_min/order.service.min.js', 'order.service'); //引入“预约”接口 服务
	app.import('/app/Tpl/web/js/directive/limitSize.directive.js', 'limitSize.directive'); //限制输入范围
	app.import('/app/Tpl/web/js/directive/integer.directive.js', 'integer.directive'); //只能输入整数

	app.addController("orderController", orderController);
	orderController.$inject = ['$rootScope', '$stateParams', 'orderService', 'publicService', '$filter', '$state'];

	function orderController($rootScope, $stateParams, orderService, publicService, $filter, $state) {
		$rootScope.title = "预约";
		var vm = this;

		/*****************变量 begin****************/

		vm.submitForm = {
			"title": "", //项目名称
			"address": "", //项目地点
			"constant": "", //联系人
			"mobile": "", //联系电话
			"email": "", //邮箱
			"content": "", //内容及流程
			"price": "", //金额
			"time": $filter('toTime')(publicService.dateNowStamp),
		}

		vm.flag = {
			addOrderFlag: true, //提交标识量
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.setStopDay = setStopDayFn; //日期时间控件
		vm.addOrder = addOrderFn; //提交预约

		/*****************函数 end****************/

		(function init() {

			if (!$rootScope.userInfo.id) {
				$state.go("login");
				return false;
			}

			if ($stateParams.type == '0') {
				vm.title = "预约评审";
			} else {
				vm.title = "预约评估";

			}
		})();

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
		function setStopDayFn() {
			laydate({
				elem: '#stop_day',
				istime: true, //时，分，秒
				format: 'YYYY-MM-DD hh:mm:ss',
				min: $filter('toTime')(publicService.dateNowStamp), //最小日期是今天8点
				isclear: false, //隐藏清空按钮
				istoday: false, //隐藏掉今天按钮
				choose: function(dates) {
					$rootScope.$apply(function() {
						vm.submitForm.stop_day = dates;
					});
				}
			});
		}

		//
		//
		//
		//
		//
		//----------------------------提交------------------------------------------
		//
		//
		//
		//
		//
		function addOrderFn() {

			//防止重复点击
			if (!vm.flag.addOrderFlag) {
				return false;
			}

			var params = {
				"user_id": $rootScope.userInfo.id,
				"title": vm.submitForm.title, //项目名称
				"address": vm.submitForm.address, //项目地点
				"constant": vm.submitForm.constant, //联系人
				"mobile": vm.submitForm.mobile, //联系电话
				"email": vm.submitForm.email, //邮箱
				"content": vm.submitForm.content, //内容及流程
				"price": vm.submitForm.price, //金额
				"time": $filter('toTimeStamp')(vm.submitForm.time), //时间
				"type": $stateParams.type //0：评审，1：评估
			}

			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.addOrderFlag = false;
			orderService.getAppointmentAdd(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							window.showAutoDialog(data.data.msg);
							$state.go("examineHome");
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {
					//
				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.addOrderFlag = true;
				}

			});
		}

	}
})();