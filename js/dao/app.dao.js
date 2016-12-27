/**
 * 需要依赖app.config.js--appConfig
 */

(function() {
	'use strict';

	angular.module('app.dao', ['app.config'])
		.service('appApiDao', appApiDao);

	appApiDao.$inject = ['$http', 'appConfig'];

	function appApiDao($http, appConfig) {
		var url = {
			common: {
				//图片验证码
				getImageCode: appConfig.newApiUrl + '?service=ImageCode.getImageCode',
				//获取地区省市联动
				getArea: appConfig.newApiUrl + '?service=Commonlist.getCommon',
				//退出登录
				exit: appConfig.newApiUrl + '?service=User.getLoginOut',
				//获取用户绑定的手机号、邮箱，然后发送验证码
				getSmsEmailCode: appConfig.newApiUrl + '?service=SendCode.getSendCode',
				//获取银行列表
				getBankList: appConfig.newApiUrl + '?service=Commonlist.getBankList',
				//活动分类，形式，标签
				getActivityType: appConfig.newApiUrl + '?service=Commonlist.getDealCtw',
			},
			login: {
				//登录
				login: appConfig.newApiUrl + "?service=User.getLogin",
				//注册
				register: appConfig.newApiUrl + '?service=User.getRegister',
				//忘记密码
				findPassword: appConfig.newApiUrl + '?service=User.getUserPasswordEdit',
				//微信登录
				weixinLogin: appConfig.newApiUrl + '?service=User.getWxCode',
			},
			index: {
				getIndexImage: appConfig.newApiUrl + '?service=Commonlist.getIndexImage',
				//热门推荐
				getIndexHot: appConfig.newApiUrl + '?service=List.getIndexHot',
				//往期精彩活动
				getIndexSuccess: appConfig.newApiUrl + '?service=List.getIndexSuccess',
				//公益众筹
				getCrowdFunding: appConfig.newApiUrl + '?service=List.getIndexWelfare',
				//主办方
				getIndexSponsor: appConfig.newApiUrl + '?service=List.getIndexSponsor',
			},
			activity: {
				//发布活动
				addActivity: appConfig.newApiUrl + '?service=Addactive.getAddProduct',
				//活动分类，形式，标签
				getActivityType: appConfig.newApiUrl + '?service=Commonlist.getDealCtw',
				//添加免费票
				addFreeTicket: appConfig.newApiUrl + '?service=Addactive.getAddTicketFree',
				//添加收费票种
				addChargeTicket: appConfig.newApiUrl + '?service=Addactive.getAddTicket',
				//删除收费票
				deleteChargeTicket: appConfig.newApiUrl + '?service=Addactive.getDelTicket',
				//活动详情
				detail: appConfig.newApiUrl + '?service=Activedeal.getActiveDeal',
				//活动门票详情
				getTicket: appConfig.newApiUrl + '?service=Activedeal.getCheckTicket',
				//获取活动列表
				getActivityList: appConfig.newApiUrl + '?service=List.getWelfareList',
				//收藏活动
				focusActivity: appConfig.newApiUrl + '?service=Activedeal.getFocusDeal',
				//检测用户是否收藏了活动、众筹
				getUserFocusFlag: appConfig.newApiUrl + '?service=Activedeal.getUserFocusDeal',
				//提交报名表
				getUserSinUpForm: appConfig.newApiUrl + '?service=JoinDeal.getUserSinUpForm',
				//参加活动
				joinActivity: appConfig.newApiUrl + '?service=JoinDeal.getUserJoinDeal',
				//获取单一票详情
				getTicketInfo: appConfig.newApiUrl + '?service=Activedeal.getTicketOne',
				//获取报名用户信息
				getPeopleList: appConfig.newApiUrl + '?service=Activedeal.getJoinDealFrom',

			},
			personal: {
				//获取个人中心首页信息
				getUserIndex: appConfig.newApiUrl + '?service=User.getUserIndex',
				//我发布的活动
				myActivity: appConfig.newApiUrl + '?service=User.getUserDeal',
				//我参与的活动
				joinActivity: appConfig.newApiUrl + '?service=User.getUserJoinDeal',
				//收藏的活动
				getUserFocusDeal: appConfig.newApiUrl + '?service=User.getUserFocusDeal',
				//我关注的主办方列表
				getFocusSponsorList: appConfig.newApiUrl + '?service=User.getFocusSponsorCount',
				//修改用户个人信息
				getUserSetAdd: appConfig.newApiUrl + '?service=User.getUserSetAdd',
				//修改用户登录密码
				updatePassword: appConfig.newApiUrl + '?service=User.getUserSafePwd',
				//绑定、解绑 -- 手机号码
				updateMobile: appConfig.newApiUrl + '?service=User.getUserSafeMobile',
				//绑定、解绑 -- 邮箱
				updateEmail: appConfig.newApiUrl + '?service=User.getUserSafeEmail',
				//修改用户支付密码
				updatePayPassword: appConfig.newApiUrl + '?service=User.getUserSafePaypwd',
				//实名认证
				setIdCard: appConfig.newApiUrl + '?service=User.getUserRealName',
				//企业认证
				setCompany: appConfig.newApiUrl + '?service=User.getUserCompany',
				//主办方资料设置
				setSponsor: appConfig.newApiUrl + '?service=User.getUserSponsor',
				//绑定支付宝
				setAliPay: appConfig.newApiUrl + '?service=User.getUserAliPay',
				//绑定银行卡
				addBank: appConfig.newApiUrl + '?service=User.getUserBankAdd',
				//删除银行卡
				deleteBank: appConfig.newApiUrl + '?service=User.getUserBankDel',
				//用户银行卡列表
				getBankList: appConfig.newApiUrl + '?service=User.getUserBankList',
				//发票设置
				setInvoice: appConfig.newApiUrl + '?service=User.getUserInvoice',
				//发票项目
				getInvoiceProject: appConfig.newApiUrl + '?service=User.getUserJoinDealInvoice',
				//发票详情
				getInvoice: appConfig.newApiUrl + '?service=User.getUserInvoiceDeal',
				//安全中心实名认证返回数据
				getUserRealCenter: appConfig.newApiUrl + '?service=User.getUserRealCenter',
				//用户收货地址列表
				getUserAddressList: appConfig.newApiUrl + '?service=User.getUserAddressList',
				//添加收货地址
				addAddress: appConfig.newApiUrl + '?service=User.getUserAddress',
				//设置默认收货地址
				setDefaultAddress: appConfig.newApiUrl + '?service=User.getUserAddressDefault',
				//用户编辑收货地址
				editAddress: appConfig.newApiUrl + '?service=User.getUserEditAddress',
				//删除收货地址
				deleteAddress: appConfig.newApiUrl + '?service=User.getUserDelAddress',
				//获取用户的支付宝收款帐户信息
				getUserPayInfo: appConfig.newApiUrl + '?service=User.getUserPaySet',
				//微信用户，初次登录绑定手机
				wxBindPhone: appConfig.newApiUrl + '?service=User.getWxLoginUserInfo',
				//我的评审评估
				getExamineList: appConfig.newApiUrl + '?service=User.getUserReviewOrder',
			},
			crowdFund: {
				//获取公益众筹列表
				getCrowdFundList: appConfig.newApiUrl + '?service=List.getWelfareList',
				//众筹分类
				getCrowdFundTypeList: appConfig.newApiUrl + '?service=Commonlist.getWelfareList',
				//添加回报
				creatRepay: appConfig.newApiUrl + '?service=Addactive.getWelfareItemAdd',
				//删除回报
				deleteRepay: appConfig.newApiUrl + '?service=Addactive.getWelfareItemDel',
				//发布众筹
				addCrowdFund: appConfig.newApiUrl + '?service=Addactive.getWelfareAdd',
				//项目支持者
				getPeopleList: appConfig.newApiUrl + '?service=Activedeal.getDealFocusUserList',
				//添加项目进展
				addProjectProgress: appConfig.newApiUrl + '?service=Activedeal.getActiveDealLogAdd',
				//获取单一回报详情
				getRepayInfo: appConfig.newApiUrl + '?service=Addactive.getWelfareItemDetail',
				//获取评论一级列表、分页
				getCommentList: appConfig.newApiUrl + '?service=Activedeal.getActiveComment',
				//获取评论二级列表
				getReplyList: appConfig.newApiUrl + '?service=Activedeal.getActiveCommentReply',
				//发布评论、回复
				addComment: appConfig.newApiUrl + '?service=Activedeal.getCommentAdd',
				//进入创建订单页面，获取基本数据
				getCreateOrder: appConfig.newApiUrl + '?service=Pay.getCreateOrder',
				//创建订单
				creatOrderSubmit: appConfig.newApiUrl + '?service=Pay.getSubmitOrder',
			},
			sponsor: {
				//获取主办方列表
				getSponsorList: appConfig.newApiUrl + '?service=List.getSponsorList',
				//主办方详情
				getSponsorDetail: appConfig.newApiUrl + '?service=SponsorDetail.getSponsorDetail',
				//关注主办方
				getSponsorFocus: appConfig.newApiUrl + '?service=SponsorDetail.getSponsorFocus',
			},
			pay: {
				//获取订单的付款链接
				getOrderPayUrl: appConfig.newApiUrl + '?service=Pay.index',
				//查询订单是否付款成功
				getOrderStatus: appConfig.newApiUrl + '?service=Pay.getSuccessOrder',
			},
			examine: {
				//评审评估模板报价
				getReviewPrice: appConfig.newApiUrl + '?service=Appointment.getReviewPrice',
				//评审评估生成订单
				setReviewOrder: appConfig.newApiUrl + '?service=Pay.getReviewOrder',
				//检查表单是否合法
				check: appConfig.newApiUrl + '?service=Appointment.getReviewLegal',
				//保存评审评估表单
				submitReviewForm: appConfig.newApiUrl + '?service=Appointment.getReviewDesign',
				//获取评审评估详情，用于生成评分界面
				getReviewDetail: appConfig.newApiUrl + '?service=Appointment.getReviewDetail',
				//开评
				open: appConfig.newApiUrl + '?service=Appointment.getReviewStart',
				//提交评分
				submitScore: appConfig.newApiUrl + '?service=Appointment.getReviewSubmission',
				//查询评分表下的项目A,B,C...
				getProjectArray: appConfig.newApiUrl + '?service=Appointment.getExpertsFrom',
				//查询某项目A的评分结果
				getProjectScore: appConfig.newApiUrl + '?service=Appointment.getReviewScoreFrom',
				//结束评审、结束评估
				close: appConfig.newApiUrl + '?service=Appointment.getReviewEnd',
				//查询个人评审评估总分平均分
				getReviewScoreAverage: appConfig.newApiUrl + '?service=Appointment.getReviewScoreAverage',
				//查询评估电子报告，纸质报告价格
				getReportPrice: appConfig.newApiUrl + '?service=Appointment.getReviewTemplatePrice',
				//创建评估电子报告、纸质报告订单
				setReportOrder: appConfig.newApiUrl + '?service=Pay.getReviewTemplateOrder',
				//编辑报告
				editReport: appConfig.newApiUrl + '?service=Appointment.getEditReport',
				//导出报告
				getWordDocument: appConfig.newApiUrl + '?service=ToWord.getWordDocument',
				//查询评审评估结果(项目)
				getProjectResultArray: appConfig.newApiUrl + '?service=Appointment.getReportID',
				//查询评审评估项目评分
				getReviewResult: appConfig.newApiUrl + '?service=Appointment.getReviewResult',
			},
			companyList: {
				//名录列表
				getCompanyList: appConfig.newApiUrl + '?service=List.getRollList',
				//加入名录
				joinCompanyList: appConfig.newApiUrl + '?service=Appointment.getInstitutionsRoll',
			},
			order: {
				//预约评审、预约评估
				getAppointmentAdd: appConfig.newApiUrl + '?service=Appointment.getAppointmentAdd',
				//取消预约
				getAppointmentDel: appConfig.newApiUrl + '?service=Appointment.getAppointmentDel',
			}
		};

		function getData(url, params) {

			if (typeof params == "object") {
				return $http({
					method: "GET",
					url: url,
					params: params,
					//cache: true
				});
			} else if (params != undefined) {
				return $http({
					method: 'GET',
					url: url + "/" + params,
					//cache: true
				});
			} else {
				return $http({
					method: 'GET',
					url: url,
					//cache: true
				})
			}
		}

		function postData(url, params) {
			if (typeof params == "object") {
				return $http({
					'headers': {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
					},
					'method': 'POST',
					'url': url,
					//'params': params,
					'data': params,
					'transformRequest': function(obj) {
						var str = [];
						for (var p in obj) {
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						}
						return str.join("&");
					}
				});
			} else if (params != undefined) {
				return $http({
					'headers': {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					'method': 'POST',
					'url': url + "/" + params
				});
			} else {
				return $http({
					'headers': {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					'method': 'POST',
					'url': url
				});
			}
		}

		function postJsonData(url, params) {
			return $http.post(url, {
				params: params
			});
		}

		//formData
		function postFormData(url, params) {
			var fd = makeFormData(params);
			return $http({
				'method': 'POST',
				'url': url,
				'data': fd,
				'headers': {
					'Content-Type': undefined
				},
				'transformRequest': angular.identity
			});
		}

		return {
			url: url,
			getData: function(url, params) {
				return getData(url, params);
			},
			postData: function(url, params) {
				return postData(url, params);
			},
			postJsonData: function(url, params) {
				return postJsonData(url, params);
			},
			postFormData: function(url, params) {
				return postFormData(url, params);
			},
		}
	}

})();