/**
 * 作者：林创荣
 * 功能：评论
 * 时间：2016年11月25日
 */
(function() {
	'use strict';

	angular.module("comment.service", [])
		.service("commentService", commentService);

	commentService.$inject = ["appApiDao"];

	function commentService(appApiDao) {
		this.getCommentList = getCommentListFn; //获取评论一级列表、分页
		this.getReplyList = getReplyListFn; ////获取评论二级列表
		this.addComment = addCommentFn; //发布评论、回复

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
	}
})();