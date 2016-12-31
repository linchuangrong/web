/**
 * 作者：林创荣
 * 功能：预约评审
 * 时间：2016年12月19日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/public.service.min.js', 'public.service'); //引入“公共”接口 服务
	app.import('/app/Tpl/web/js/service/service_min/order.service.min.js', 'order.service'); //引入“预约”接口 服务

	app.addController("orderEstimateController", orderEstimateController);
	orderEstimateController.$inject = ['$rootScope', '$stateParams', 'orderService', 'publicService', '$filter'];

	function orderEstimateController($rootScope, $stateParams, orderService, publicService, $filter) {
		$rootScope.title = "预约评审";
		var vm = this;

		/*****************变量 begin****************/

		vm.submitForm = {
			stop_day: $filter('toTime')(publicService.dateNowStamp),
			image:"",
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.setStopDay = setStopDayFn; //日期时间控件

		/*****************函数 end****************/

		(function init() {})();

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

	}
})();