/**
 * 林创荣
 * 功能：登录、注册
 * 2016年9月28日
 */
(function() {
	'use strict';

	angular.module("login.service", [])
		.service("loginService", loginService);

	loginService.$inject = ["appApiDao"];

	function loginService(appApiDao) {

		this.login = loginFn; //登录
		this.register = registerFn; //注册
		this.getImgCode = getImgCodeFn; //获取图片验证码
		this.checkImgCode = checkImgCodeFn; //校验图片验证码
		this.findPassword = findPasswordFn; //找回密码
		this.weixinLogin = weixinLoginFn; //微信登录

		//登录接口
		function loginFn(params) {
			var url = appApiDao.url.login.login;
			return appApiDao.postData(url, params);
		}

		//注册接口
		function registerFn(params) {
			var url = appApiDao.url.login.register;
			return appApiDao.postData(url, params);
		}

		//图片验证码
		function getImgCodeFn() {
			return appApiDao.url.common.getImageCode + "&t=" + Date.parse(new Date());
		}

		//检验图片验证码
		function checkImgCodeFn(params) {
			var url = appApiDao.url.login.checkImgCode;
			return appApiDao.postData(url, params);
		}

		//找回密码
		function findPasswordFn(params) {
			var url = appApiDao.url.login.findPassword;
			return appApiDao.postData(url, params);
		}

		//微信登录
		function weixinLoginFn() {
			var url = appApiDao.url.login.weixinLogin;
			return appApiDao.postData(url);
		}
	}
})();