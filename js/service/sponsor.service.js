/**
 * 作者：林创荣
 * 功能：主办方接口
 * 时间：2016年11月8日
 */
(function() {
	'use strict';

	angular.module("sponsor.service", [])
		.service("sponsorService", sponsorService);

	sponsorService.$inject = ["appApiDao"];

	function sponsorService(appApiDao) {
		this.getSponsorList = getSponsorListFn; //主办方列表
		this.getSponsorDetail = getSponsorDetailFn; //主办方详情
		this.getSponsorFocus = getSponsorFocusFn; //主办方详情
		this.getUserFocusFlag = getUserFocusFlagFn; //判断用户是否关注了主办方
		this.getSponsorDetailList = getSponsorDetailListFn; //主办方发布的活动、众筹

		//主办方列表
		function getSponsorListFn(params) {
			var url = appApiDao.url.sponsor.getSponsorList;
			return appApiDao.getData(url, params);
		}

		//主办方详情
		function getSponsorDetailFn(params) {
			var url = appApiDao.url.sponsor.getSponsorDetail;
			return appApiDao.getData(url, params);
		}

		//关注主办方
		function getSponsorFocusFn(params) {
			var url = appApiDao.url.sponsor.getSponsorFocus;
			return appApiDao.postData(url, params);
		}

		//判断用户是否关注了主办方
		function getUserFocusFlagFn(params) {
			var url = appApiDao.url.sponsor.getUserFocusFlag;
			return appApiDao.postData(url, params);
		}

		//主办方发布的活动、众筹
		function getSponsorDetailListFn(params) {
			var url = appApiDao.url.sponsor.getSponsorDetailList;
			return appApiDao.getData(url, params);
		}
	}
})();