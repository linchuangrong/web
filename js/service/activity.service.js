/**
 * 作者：林创荣
 * 功能：活动相关的接口
 * 时间：2016年10月21日
 */
(function() {
	'use strict';

	angular.module("activity.service", [])
		.service("activityService", activityService);

	activityService.$inject = ["appApiDao"];

	function activityService(appApiDao) {
		this.addActivity = addActivityFn; //添加活动
		this.getActivityType = getActivityTypeFn; //获取活动类别，形式，标签等
		this.addFreeTicket = addFreeTicketFn; //添加免费票
		this.addChargeTicket = addChargeTicketFn; //添加收费票
		this.deleteChargeTicket = deleteChargeTicketFn; //删除收费票
		this.detail = detailFn; //活动详情
		this.getTicket = getTicketFn; //活动门票详情
		this.getActivityList = getActivityListFn; //获取活动列表
		this.focusActivity = focusActivityFn; //收藏活动
		this.getUserFocusFlag = getUserFocusFlagFn; //获取用户是否已经收藏了活动、众筹
		this.getUserSinUpForm = getUserSinUpFormFn; //提交报名表
		this.joinActivity = joinActivityFn; //参加活动
		this.getTicketInfo = getTicketInfoFn; //获取单一票详情
		this.getPeopleList = getPeopleListFn; //获取报名用户信息

		//添加活动
		function addActivityFn(params) {
			var url = appApiDao.url.activity.addActivity;
			return appApiDao.postData(url, params);
		}

		//获取活动类别，形式，标签等
		function getActivityTypeFn() {
			var url = appApiDao.url.activity.getActivityType;
			var params = {
				"act": "active"
			}
			return appApiDao.getData(url, params);
		}

		//添加免费票
		function addFreeTicketFn(params) {
			var url = appApiDao.url.activity.addFreeTicket;
			return appApiDao.postData(url, params);
		}

		//添加收费票
		function addChargeTicketFn(params) {
			var url = appApiDao.url.activity.addChargeTicket;
			return appApiDao.postData(url, params);
		}

		//删除收费票
		function deleteChargeTicketFn(params) {
			var url = appApiDao.url.activity.deleteChargeTicket;
			return appApiDao.postData(url, params);
		}

		//活动详情
		function detailFn(params) {
			var url = appApiDao.url.activity.detail;
			return appApiDao.getData(url, params);
		}

		//活动门票详情
		function getTicketFn(params) {
			var url = appApiDao.url.activity.getTicket;
			return appApiDao.getData(url, params);
		}

		//活动门票详情
		function getActivityListFn(params) {
			var url = appApiDao.url.activity.getActivityList;
			return appApiDao.getData(url, params);
		}

		//收藏活动
		function focusActivityFn(params) {
			var url = appApiDao.url.activity.focusActivity;
			return appApiDao.postData(url, params);
		}

		//判断用户是否收藏了活动、众筹
		function getUserFocusFlagFn(params) {
			var url = appApiDao.url.activity.getUserFocusFlag;
			return appApiDao.postData(url, params);
		}

		//提交报名表
		function getUserSinUpFormFn(params) {
			var url = appApiDao.url.activity.getUserSinUpForm;
			return appApiDao.postData(url, params);
		}

		//参加活动
		function joinActivityFn(params) {
			var url = appApiDao.url.activity.joinActivity;
			return appApiDao.postData(url, params);
		}

		//获取单一票详情
		function getTicketInfoFn(params) {
			var url = appApiDao.url.activity.getTicketInfo;
			return appApiDao.postData(url, params);
		}
		
		//获取报名用户信息
		function getPeopleListFn(params){
			var url = appApiDao.url.activity.getPeopleList;
			return appApiDao.getData(url, params);
		}
	}
})();