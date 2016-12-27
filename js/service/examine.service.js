/**
 * 作者：林创荣
 * 功能：评审评估
 * 时间：2016年12月15日
 */
(function() {
	'use strict';

	angular.module("examine.service", [])
		.service("examineService", examineService);

	examineService.$inject = ["appApiDao"];

	function examineService(appApiDao) {
		this.getReviewPrice = getReviewPriceFn; //评审评估模板报价
		this.setReviewOrder = setReviewOrderFn; //评审评估生成订单
		this.check = checkFn; //检查表单是否合法
		this.submitReviewForm = submitReviewFormFn; //保存评审评估表单
		this.getReviewDetail = getReviewDetailFn; //获取评审评估详情，用于生成评分界面
		this.open = openFn; //开评
		this.submitScore = submitScoreFn; //提交评分
		this.getProjectArray = getProjectArrayFn; //查询评分表下的项目A,B,C...
		this.getProjectScore = getProjectScoreFn; //查询某项目A的评分结果
		this.close = closeFn; //结束评审、结束评估
		this.getReviewScoreAverage = getReviewScoreAverageFn; //查询个人评审评估总分平均分
		this.getReportPrice = getReportPriceFn; //查询评估电子报告，纸质报告价格
		this.setReportOrder = setReportOrderFn; //创建评估电子报告、纸质报告订单
		this.editReport = editReportFn; //编辑报告
		this.getProjectResultArray = getProjectResultArrayFn; //查询评审评估结果(项目)
		this.getReviewResult = getReviewResultFn; //查询评审评估项目评分

		//获取订单的付款链接
		function getReviewPriceFn(params) {
			var url = appApiDao.url.examine.getReviewPrice;
			return appApiDao.postData(url, params);
		}

		//查询订单是否付款成功
		function setReviewOrderFn(params) {
			var url = appApiDao.url.examine.setReviewOrder;
			return appApiDao.postData(url, params);
		}

		//检查表单是否合法
		function checkFn(params) {
			var url = appApiDao.url.examine.check;
			return appApiDao.postData(url, params);
		}

		//保存评审评估表单
		function submitReviewFormFn(params) {
			var url = appApiDao.url.examine.submitReviewForm;
			return appApiDao.postData(url, params);
		}

		//获取评审评估详情，用于生成评分界面
		function getReviewDetailFn(params) {
			var url = appApiDao.url.examine.getReviewDetail;
			return appApiDao.getData(url, params);
		}

		//获取评审评估详情，用于生成评分界面
		function openFn(params) {
			var url = appApiDao.url.examine.open;
			return appApiDao.postData(url, params);
		}

		//提交评分
		function submitScoreFn(params) {
			var url = appApiDao.url.examine.submitScore;
			return appApiDao.postData(url, params);
		}

		//查询评分表下的项目A,B,C...
		function getProjectArrayFn(params) {
			var url = appApiDao.url.examine.getProjectArray;
			return appApiDao.postData(url, params);
		}

		//查询某项目A的评分结果
		function getProjectScoreFn(params) {
			var url = appApiDao.url.examine.getProjectScore;
			return appApiDao.postData(url, params);
		}

		//结束评审，结束评估
		function closeFn(params) {
			var url = appApiDao.url.examine.close;
			return appApiDao.postData(url, params);
		}

		//查询个人评审评估总分平均分
		function getReviewScoreAverageFn(params) {
			var url = appApiDao.url.examine.getReviewScoreAverage;
			return appApiDao.postData(url, params);
		}

		//查询评估电子报告，纸质报告价格
		function getReportPriceFn(params) {
			var url = appApiDao.url.examine.getReportPrice;
			return appApiDao.getData(url, params);
		}

		//创建评估电子报告、纸质报告订单
		function setReportOrderFn(params) {
			var url = appApiDao.url.examine.setReportOrder;
			return appApiDao.postData(url, params);
		}

		//编辑报告
		function editReportFn(params) {
			var url = appApiDao.url.examine.editReport;
			return appApiDao.postData(url, params);
		}

		//查询评审评估结果(项目)
		function getProjectResultArrayFn(params) {
			var url = appApiDao.url.examine.getProjectResultArray;
			return appApiDao.postData(url, params);
		}

		//查询评审评估项目评分
		function getReviewResultFn(params) {
			var url = appApiDao.url.examine.getReviewResult;
			return appApiDao.postData(url, params);
		}
	}
})();