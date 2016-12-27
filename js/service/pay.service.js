/**
 * 作者：林创荣
 * 功能：支付
 * 时间：2016年10月26日
 */
(function() {
	'use strict';

	angular.module("pay.service", [])
		.service("payService", payService);

	payService.$inject = ["appApiDao"];

	function payService(appApiDao) {
		this.getOrderPayUrl = getOrderPayUrlFn; //获取订单的付款链接
		this.getOrderStatus = getOrderStatusFn; //查询订单是否付款成功

		//获取订单的付款链接
		function getOrderPayUrlFn(params) {
			var url = appApiDao.url.pay.getOrderPayUrl;
			return appApiDao.postData(url, params);
		}

		//查询订单是否付款成功
		function getOrderStatusFn(params) {
			var url = appApiDao.url.pay.getOrderStatus;
			return appApiDao.postData(url, params);
		}
	}
})();