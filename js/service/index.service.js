/**
 * 作者：林创荣
 * 功能：首页index的数据接口
 * 时间：2016年10月21日
 */
(function() {
	'use strict';

	angular.module("index.service", [])
		.service("indexService", indexService);

	indexService.$inject = ["appApiDao"];

	function indexService(appApiDao) {
		this.getIndexData = getIndexDataFn;//轮播图
		this.getIndexHot = getIndexHotFn; //热门推荐
		this.getIndexSuccess = getIndexSuccessFn; //往期精彩活动
		this.getCrowdFunding = getCrowdFundingFn; //公益众筹
		this.getIndexSponsor = getIndexSponsorFn; //主办方

		//轮播图
		function getIndexDataFn(params) {
			var url = appApiDao.url.index.getIndexImage;
			return appApiDao.getData(url, params);
		}

		//热门推荐
		function getIndexHotFn(params) {
			var url = appApiDao.url.index.getIndexHot;
			return appApiDao.getData(url, params);
		}

		//往期精彩活动
		function getIndexSuccessFn() {
			var url = appApiDao.url.index.getIndexSuccess;
			return appApiDao.getData(url);
		}

		//公益众筹
		function getCrowdFundingFn(params) {
			var url = appApiDao.url.index.getCrowdFunding;
			return appApiDao.getData(url, params);
		}

		//公益众筹
		function getIndexSponsorFn() {
			var url = appApiDao.url.index.getIndexSponsor;
			return appApiDao.getData(url);
		}

	}
})();