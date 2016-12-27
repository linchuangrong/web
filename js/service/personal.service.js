/**
 * 作者：林创荣
 * 功能：个人中心
 * 时间：2016年10月21日
 */
(function() {
	'use strict';

	angular.module("personal.service", [])
		.service("personalService", personalService);

	personalService.$inject = ['$rootScope', "appApiDao"];

	function personalService($rootScope, appApiDao) {
		this.getUserIndex = getUserIndexFn; //获取最新的个人资料
		this.getUserAddActivity = getUserAddActivityFn; //获取用户发布的活动
		this.getUserJoinActivity = getUserJoinActivityFn; //获取用户参与的活动
		this.getUserCollectActivity = getUserCollectActivityFn; //获取用户收藏的活动
		this.getFocusSponsorList = getFocusSponsorListFn; //我关注的主办方列表
		this.getUserSetInfo = getUserSetInfoFn; //获取用户资料设置里的个人资料数据
		this.updateUserInfo = updateUserInfoFn; //修改用户资料
		this.updatePassword = updatePasswordFn; //修改登录密码
		this.updateMobile = updateMobileFn; //修改手机
		this.updateEmail = updateEmailFn; //修改邮箱
		this.updatePayPassword = updatePayPasswordFn; //修改支付
		this.setIdCard = setIdCardFn; //实名认证
		this.setCompany = setCompanyFn; //企业认证
		this.setSponsor = setSponsorFn; //主办方资料设置
		this.setAliPay = setAliPayFn; //绑定支付宝
		this.addBank = addBankFn; //绑定银行卡
		this.deleteBank = deleteBankFn; //删除银行卡
		this.getBankList = getBankListFn; //获取银行卡列表
		this.setInvoice = setInvoiceFn; //发票设置
		this.getInvoiceProject = getInvoiceProjectFn; //发票项目 
		this.getInvoice = getInvoiceFn; //发票详情
		this.getUserRealCenter = getUserRealCenterFn; //安全中心实名认证返回数据
		this.getUserAddressList = getUserAddressListFn; //用户收货地址列表
		this.addAddress = addAddressFn; //添加收货地址
		this.setDefaultAddress = setDefaultAddressFn; //设置默认收货地址
		this.editAddress = editAddressFn; //用户编辑收货地址
		this.deleteAddress = deleteAddressFn; //删除收货地址
		this.getUserPayInfo = getUserPayInfoFn; //获取用户的支付宝收款帐户信息
		this.wxBindPhone = wxBindPhoneFn; //微信用户，初次登录绑定手机
		this.getExamineList = getExamineListFn; //我的评审评估

		//获取最新的个人资料
		function getUserIndexFn() {
			var url = appApiDao.url.personal.getUserIndex;
			var params = {
				"username": $rootScope.userInfo.user_name
			}
			return appApiDao.postData(url, params);
		}

		//获取用户发布的活动
		function getUserAddActivityFn(params) {
			var url = appApiDao.url.personal.myActivity;
			return appApiDao.postData(url, params);
		}

		//获取用户参与的活动
		function getUserJoinActivityFn(params) {
			var url = appApiDao.url.personal.joinActivity;
			return appApiDao.postData(url, params);
		}

		//获取用户收藏的活动
		function getUserCollectActivityFn(params) {
			var url = appApiDao.url.personal.getUserFocusDeal;
			return appApiDao.postData(url, params);
		}

		//我关注的主办方列表
		function getFocusSponsorListFn(params) {
			var url = appApiDao.url.personal.getFocusSponsorList;
			return appApiDao.getData(url, params);
		}

		//获取用户资料设置里的个人资料数据
		function getUserSetInfoFn(params) {
			var url = appApiDao.url.personal.getUserSetInfo;
			return appApiDao.postData(url, params);
		}

		//修改用户资料
		function updateUserInfoFn(params) {
			var url = appApiDao.url.personal.getUserSetAdd;
			return appApiDao.postData(url, params);
		}

		//修改登录密码
		function updatePasswordFn(params) {
			var url = appApiDao.url.personal.updatePassword;
			return appApiDao.postData(url, params);
		}

		//修改手机
		function updateMobileFn(params) {
			var url = appApiDao.url.personal.updateMobile;
			return appApiDao.postData(url, params);
		}

		//修改邮箱
		function updateEmailFn(params) {
			var url = appApiDao.url.personal.updateEmail;
			return appApiDao.postData(url, params);
		}

		//修改支付密码
		function updatePayPasswordFn(params) {
			var url = appApiDao.url.personal.updatePayPassword;
			return appApiDao.postData(url, params);
		}

		//实名认证
		function setIdCardFn(params) {
			var url = appApiDao.url.personal.setIdCard;
			return appApiDao.postData(url, params);
		}

		//企业认证
		function setCompanyFn(params) {
			var url = appApiDao.url.personal.setCompany;
			return appApiDao.postData(url, params);
		}

		//主办方资料设置
		function setSponsorFn(params) {
			var url = appApiDao.url.personal.setSponsor;
			return appApiDao.postData(url, params);
		}

		//绑定支付宝
		function setAliPayFn(params) {
			var url = appApiDao.url.personal.setAliPay;
			return appApiDao.postData(url, params);
		}

		//绑定银行卡
		function addBankFn(params) {
			var url = appApiDao.url.personal.addBank;
			return appApiDao.postData(url, params);
		}

		//删除银行卡
		function deleteBankFn(params) {
			var url = appApiDao.url.personal.deleteBank;
			return appApiDao.postData(url, params);
		}

		//获取银行卡列表
		function getBankListFn(params) {
			var url = appApiDao.url.personal.getBankList;
			return appApiDao.getData(url, params);
		}

		//发票设置
		function setInvoiceFn(params) {
			var url = appApiDao.url.personal.setInvoice;
			return appApiDao.postData(url, params);
		}

		//发票设置
		function getInvoiceProjectFn(params) {
			var url = appApiDao.url.personal.getInvoiceProject;
			return appApiDao.getData(url, params);
		}

		//发票详情
		function getInvoiceFn(params) {
			var url = appApiDao.url.personal.getInvoice;
			return appApiDao.getData(url, params);
		}

		//安全中心实名认证返回数据
		function getUserRealCenterFn(params) {
			var url = appApiDao.url.personal.getUserRealCenter;
			return appApiDao.postData(url, params);
		}

		//用户收货地址列表
		function getUserAddressListFn(params) {
			var url = appApiDao.url.personal.getUserAddressList;
			return appApiDao.postData(url, params);
		}

		//添加收货地址
		function addAddressFn(params) {
			var url = appApiDao.url.personal.addAddress;
			return appApiDao.postData(url, params);
		}

		//设置默认收货地址
		function setDefaultAddressFn(params) {
			var url = appApiDao.url.personal.setDefaultAddress;
			return appApiDao.postData(url, params);
		}

		//用户编辑收货地址
		function editAddressFn(params) {
			var url = appApiDao.url.personal.editAddress;
			return appApiDao.postData(url, params);
		}

		//删除收货地址
		function deleteAddressFn(params) {
			var url = appApiDao.url.personal.deleteAddress;
			return appApiDao.postData(url, params);
		}

		//获取用户的支付宝收款帐户信息
		function getUserPayInfoFn(params) {
			var url = appApiDao.url.personal.getUserPayInfo;
			return appApiDao.postData(url, params);
		}

		//微信用户，初次登录绑定手机
		function wxBindPhoneFn(params) {
			var url = appApiDao.url.personal.wxBindPhone;
			return appApiDao.postData(url, params);
		}

		//我的评审评估
		function getExamineListFn(params) {
			var url = appApiDao.url.personal.getExamineList;
			return appApiDao.getData(url, params);
		}
	}
})();