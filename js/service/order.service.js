/**
 * 作者：林创荣
 * 功能：预约
 * 时间：2016年11月18日
 */
(function() {
	'use strict';

	angular.module("order.service", [])
		.service("orderService", orderService);

	orderService.$inject = ['appApiDao'];

	function orderService(appApiDao) {
		
		this.getAppointmentAdd = getAppointmentAddFn; //预约评审、预约评估
		this.getAppointmentDel = getAppointmentDelFn; //取消预约

		//预约评审、预约评估
		function getAppointmentAddFn(params) {
			var url = appApiDao.url.order.getAppointmentAdd;
			return appApiDao.postData(url, params);
		}

		//取消预约
		function getAppointmentDelFn(params) {
			var url = appApiDao.url.order.getAppointmentDel;
			return appApiDao.postData(url, params);
		}
	}
})();