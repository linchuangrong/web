/**
 * 作者：林创荣
 * 功能：众筹相关的接口
 * 时间：2016年11月8日
 */
(function() {
	'use strict';

	angular.module("crowdFund.service", [])
		.service("crowdFundService", crowdFundService);

	crowdFundService.$inject = ["appApiDao"];

	function crowdFundService(appApiDao) {
		this.getCrowdFundList = getCrowdFundListFn; //众筹列表
		this.getCrowdFundTypeList = getCrowdFundTypeListFn; //众筹分类
		this.creatRepay = creatRepayFn; //添加回报
		this.deleteRepay = deleteRepayFn; //删除回报
		this.addCrowdFund = addCrowdFundFn; //发布众筹
		this.detail = detailFn; //众筹详情
		this.getUserFocusFlag = getUserFocusFlagFn; //获取用户是否已经收藏了活动、众筹
		this.focusCrowdFund = focusCrowdFundFn; //收藏活动
		this.getPeopleList = getPeopleListFn; //项目支持者
		this.addProjectProgress = addProjectProgressFn; //添加项目进展
		this.getRepayInfo = getRepayInfoFn; //获取单一回报详情
		this.getCommentList = getCommentListFn; //获取评论一级列表、分页
		this.getReplyList = getReplyListFn; ////获取评论二级列表
		this.addComment = addCommentFn; //发布评论、回复
		this.getCreateOrder = getCreateOrderFn; //进入创建订单页面，获取基本数据
		this.creatOrderSubmit = creatOrderSubmitFn; //创建订单

		//众筹列表
		function getCrowdFundListFn(params) {
			var url = appApiDao.url.crowdFund.getCrowdFundList;
			return appApiDao.getData(url, params);
		}

		//众筹分类
		function getCrowdFundTypeListFn() {
			var url = appApiDao.url.crowdFund.getCrowdFundTypeList;
			return appApiDao.getData(url);
		}

		//添加回报
		function creatRepayFn(params) {
			var url = appApiDao.url.crowdFund.creatRepay;
			return appApiDao.postData(url, params);
		}

		//删除回报
		function deleteRepayFn(params) {
			var url = appApiDao.url.crowdFund.deleteRepay;
			return appApiDao.postData(url, params);
		}

		//发布众筹
		function addCrowdFundFn(params) {
			var url = appApiDao.url.crowdFund.addCrowdFund;
			return appApiDao.postData(url, params);
		}

		//众筹详情
		function detailFn(params) {
			var url = appApiDao.url.activity.detail;
			return appApiDao.getData(url, params);
		}

		//判断用户是否收藏了活动、众筹
		function getUserFocusFlagFn(params) {
			var url = appApiDao.url.activity.getUserFocusFlag;
			return appApiDao.postData(url, params);
		}

		//收藏活动
		function focusCrowdFundFn(params) {
			var url = appApiDao.url.activity.focusActivity;
			return appApiDao.postData(url, params);
		}

		//项目支持者
		function getPeopleListFn(params) {
			var url = appApiDao.url.crowdFund.getPeopleList;
			return appApiDao.postData(url, params);
		}

		//添加项目进展
		function addProjectProgressFn(params) {
			var url = appApiDao.url.crowdFund.addProjectProgress;
			return appApiDao.postData(url, params);
		}

		//获取单一回报详情
		function getRepayInfoFn(params) {
			var url = appApiDao.url.crowdFund.getRepayInfo;
			return appApiDao.getData(url, params);
		}

		//获取评论一级列表、分页
		function getCommentListFn(params) {
			var url = appApiDao.url.crowdFund.getCommentList;
			return appApiDao.getData(url, params);
		}

		//获取评论二级列表
		function getReplyListFn(params) {
			var url = appApiDao.url.crowdFund.getReplyList;
			return appApiDao.getData(url, params);
		}

		//发布评论、回复
		function addCommentFn(params) {
			var url = appApiDao.url.crowdFund.addComment;
			return appApiDao.postData(url, params);
		}

		//进入创建订单页面，获取基本数据
		function getCreateOrderFn(params) {
			var url = appApiDao.url.crowdFund.getCreateOrder;
			return appApiDao.getData(url, params);
		}
		
		//创建订单
		function creatOrderSubmitFn(params) {
			var url = appApiDao.url.crowdFund.creatOrderSubmit;
			return appApiDao.postData(url, params);
		}
	}
})();