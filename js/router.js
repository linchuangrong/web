/**
 * 作者：林创荣
 * 功能：定义全局路由
 * 		 定义$rootScope.currentRouter来存储当前页面的路由名,个人中心页面需要用到
 * 时间：2016年9月2日
 */
(function() {
	"use strict";
	//引入ui-router
	app.import('/app/Tpl/web/js/libs/angular/angular-ui-router.min.js', 'ui.router');
	app.import('/app/Tpl/web/js/service/loadFile.service.js', 'load.file');

	app.config(webRouter);
	webRouter.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$controllerProvider', 'appConfig', 'loadFileProvider', 'httpInterceptorProvider'];

	function webRouter($httpProvider, $stateProvider, $urlRouterProvider, $controllerProvider, appConfig, loadFileProvider, httpInterceptorProvider) {

		//注入HTTP拦截器,用来
		$httpProvider.interceptors.push(httpInterceptorProvider.$get);

		//设置动态添加controller的方法
		app.addController = $controllerProvider.register;

		//设置路由
		$urlRouterProvider.otherwise("/index");
		$stateProvider
			.state("index", index()) //首页
			.state("protocol", protocol()) //用户协议
			.state("activityProtocol", activityProtocol()) //活动协议
			.state("login", login()) //登录、注册
			.state("findpassword", findpassword()) //找回密码
			.state("activityList", activityList()) //活动中心
			.state("activityDetail", activityDetail()) //活动详情
			.state("personal", personal()) //个人中心
			.state("personal.home", personalHome()) //我的主页
			.state("personal.myActivity", myActivity()) //我的活动
			.state("personal.myCrowdFund", myCrowdFund()) //我的众筹
			.state("personal.myReview", myReview()) //我的评审
			.state("personal.myEstimate", myEstimate()) //我的评估
			.state("personal.joinActivity", joinActivity()) //我的参与-我的报名
			.state("personal.joinCrowdFund", joinCrowdFund()) //我的参与-我的众筹
			.state("personal.collection", collection()) //我的参与-我的收藏
			.state("personal.concern", concern()) //我的参与-我的关注
			.state("personal.dataSet", dataSet()) //帐户设置-资料设置
			.state("personal.safe", safe()) //帐户设置-安全中心
			.state("personal.sponsor", sponsor()) //帐户设置-主办方
			.state("personal.invoice", invoice()) //帐户设置-发票信息
			.state("personal.moneyAccount", moneyAccount()) //帐户设置-收款帐户
			.state("personal.addMoneyAccount", addMoneyAccount()) //帐户设置-添加支付宝帐户
			.state("personal.addBank", addBank()) //帐户设置-添加银行卡
			.state("personal.myBankCard", myBankCard()) //帐户设置-我的银行卡
			.state("personal.address", address()) //帐户设置-收货地址
			.state("addActivity", addActivity()) //发布活动
			.state("updateActivity", updateActivity()) //修改活动
			.state("peopleList", peopleList()) //活动人员名单
			.state("addCrowdFund", addCrowdFund()) //发起众筹
			.state("updateCrowdFund", updateCrowdFund()) //修改众筹
			//.state("crowdFund", crowdFund()) //公益众筹
			.state("crowdFundList", crowdFundList()) ////众筹中心
			.state("crowdFundDetail", crowdFundDetail()) //众筹详情
			.state("crowdFundOrder", crowdFundOrder()) //众筹下单
			.state("selectExamine", selectExamine()) //选择评审模板
			.state("addExamine3", addExamine3()) //添加项目评审三级
			.state("addExamine2", addExamine2()) //添加项目评审二级
			.state("addExamine1", addExamine1()) //添加项目评审一级
			//.state("examineList", examineList()) //项目评审
			.state("examineDetail", examineDetail()) //项目评审详情
			.state("examineResult", examineResult()) //评审结果、评估结果
			.state("finalScore", finalScore()) //评分结果
			.state("editReport", editReport()) //编辑评估报告
			.state("sponsorList", sponsorList()) //主办方列表
			.state("sponsorDetail", sponsorDetail()) //主办方详情
			.state("payMoney", payMoney()) //订单支付界面
			.state("appointment", appointment()) //预约评审/评估
			.state("orderReview", orderReview()) //预约评审表单
			.state("orderEstimate", orderEstimate()) //预约评估表单
			.state("companyList", companyList()) //机构名录
			.state("joinList", joinList()) //加入名录
			.state("examineHome", examineHome()) //评审/评估首页
			.state("software", software()) //软件开发
			.state("order", order()) //预约评审，预约评估
		;

		//首页
		function index() {
			return {
				url: '/index',
				templateUrl: appConfig.baseUrl + "js/components/index/index.tpl.html",
				controller: 'indexController as index',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/index/index.controller.js")
				}
			}
		}

		//用户协议
		function protocol() {
			return {
				url: '/protocol',
				templateUrl: appConfig.baseUrl + "js/components/protocol/protocol.tpl.html",
			}
		}

		//活动协议
		function activityProtocol() {
			return {
				url: '/activityProtocol',
				templateUrl: appConfig.baseUrl + "js/components/protocol/activityProtocol.tpl.html",
			}
		}

		//登录、注册
		function login() {
			return {
				url: '/login',
				templateUrl: appConfig.baseUrl + "js/components/login/login.tpl.html",
				controller: 'loginController as login',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/login/login.controller.js")
				}
			}
		}

		//找回密码
		function findpassword() {
			return {
				url: '/findpassword',
				templateUrl: appConfig.baseUrl + "js/components/findpassword/findpassword.tpl.html",
				controller: 'findpasswordController as findpassword',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/findpassword/findpassword.controller.js")
				}
			}
		}

		//活动中心
		function activityList() {
			return {
				url: '/activityList/:address/:cate/:time/:keyword',
				templateUrl: appConfig.baseUrl + "js/components/activity/activityList.tpl.html",
				controller: 'activityListController as activityList',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/activity/activityList.controller.js")
				}
			}
		}

		//活动详情
		function activityDetail() {
			return {
				url: '/activityDetail/:activityId',
				templateUrl: appConfig.baseUrl + "js/components/activity/activityDetail.tpl.html",
				controller: 'activityDetailController as activityDetail',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/activity/activityDetail.controller.js")
				}
			}
		}

		//个人中心
		function personal() {
			return {
				url: '/personal',
				templateUrl: appConfig.baseUrl + "js/components/personal/personal.tpl.html",
				controller: 'personalController as personal',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/personal.controller.js"),
					//获取个人基本信息，然后才加载页面
					getUserIndex: function(appApiDao, $q, $rootScope, $state) {
						var defer = $q.defer();
						appApiDao.postData(appApiDao.url.personal.getUserIndex, {
							"username": $rootScope.userInfo.user_name
						}).success(function(data) {
							if (data.ret != "200") {
								//用户可能未登录，跳转到登录页
								if (data.data.length == 0) {
									window.showAlertTip("未登录或登录失效，请重新登录");
									$state.go("login");
								}
								return false;
							} else {
								if (data.data.code == 20000) {
									//写下缓存，方便其他页面获取
									$rootScope.userInfo = data.data.info[0];
									defer.resolve(data.data.info[0]);
								}
							}
						});
						return defer.promise;
					}
				}
			}
		}

		//我的主页
		function personalHome() {
			return {
				url: '/home',
				templateUrl: appConfig.baseUrl + "js/components/personal/personalHome.tpl.html",
				controller: 'personalHomeController as personalHome',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/personalHome.controller.js")
				}
			}
		}

		//我的活动
		function myActivity() {
			return {
				url: '/myActivity',
				templateUrl: appConfig.baseUrl + "js/components/personal/myActivity.tpl.html",
				controller: 'myActivityController as myActivity',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/myActivity.controller.js")
				}
			}
		}

		//我的众筹
		function myCrowdFund() {
			return {
				url: '/myCrowdFund',
				templateUrl: appConfig.baseUrl + "js/components/personal/myCrowdFund.tpl.html",
				controller: 'myCrowdFundController as myCrowdFund',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/myCrowdFund.controller.js")
				}
			}
		}

		//我的评审
		function myReview() {
			return {
				url: '/myReview',
				templateUrl: appConfig.baseUrl + "js/components/personal/myReview.tpl.html",
				controller: 'myReviewController as myReview',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/myReview.controller.js"),
					loadZeroClipboard: loadFileProvider.$get().load(appConfig.baseUrl + "js/libs/ZeroClipboard/ZeroClipboard.min.js"),
				}
			}
		}

		//我的评估
		function myEstimate() {
			return {
				url: '/myEstimate',
				templateUrl: appConfig.baseUrl + "js/components/personal/myEstimate.tpl.html",
				controller: 'myEstimateController as myEstimate',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/myEstimate.controller.js"),
					loadZeroClipboard: loadFileProvider.$get().load(appConfig.baseUrl + "js/libs/ZeroClipboard/ZeroClipboard.min.js"),
				}
			}
		}

		//我的参与-我的报名
		function joinActivity() {
			return {
				url: '/joinActivity',
				templateUrl: appConfig.baseUrl + "js/components/personal/joinActivity.tpl.html",
				controller: 'joinActivityController as joinActivity',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/joinActivity.controller.js")
				}
			}
		}

		//我的参与-我的众筹
		function joinCrowdFund() {
			return {
				url: '/joinCrowdFund',
				templateUrl: appConfig.baseUrl + "js/components/personal/joinCrowdFund.tpl.html",
				controller: 'joinCrowdFundController as joinCrowdFund',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/joinCrowdFund.controller.js")
				}
			}
		}

		//我的参与-我的收藏
		function collection() {
			return {
				url: '/collection',
				templateUrl: appConfig.baseUrl + "js/components/personal/collection.tpl.html",
				controller: 'collectionController as collection',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/collection.controller.js")
				}
			}
		}

		//我的参与-我的关注
		function concern() {
			return {
				url: '/concern',
				templateUrl: appConfig.baseUrl + "js/components/personal/concern.tpl.html",
				controller: 'concernController as concern',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/concern.controller.js")
				}
			}
		}

		//帐户设置-资料设置
		function dataSet() {
			return {
				url: '/dataSet',
				templateUrl: appConfig.baseUrl + "js/components/personal/dataSet.tpl.html",
				controller: 'dataSetController as dataSet',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/dataSet.controller.js"),
				}
			}
		}

		//帐户设置-安全中心
		function safe() {
			return {
				url: '/safe',
				templateUrl: appConfig.baseUrl + "js/components/personal/safe.tpl.html",
				controller: 'safeController as safe',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/safe.controller.js")
				}
			}
		}

		//帐户设置-主办方
		function sponsor() {
			return {
				url: '/sponsor',
				templateUrl: appConfig.baseUrl + "js/components/personal/sponsor.tpl.html",
				controller: 'sponsorController as sponsor',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/sponsor.controller.js")
				}
			}
		}

		//帐户设置-发票信息
		function invoice() {
			return {
				url: '/invoice',
				templateUrl: appConfig.baseUrl + "js/components/personal/invoice.tpl.html",
				controller: 'invoiceController as invoice',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/invoice.controller.js")
				}
			}
		}

		//帐户设置-收款帐户
		function moneyAccount() {
			return {
				url: '/moneyAccount',
				templateUrl: appConfig.baseUrl + "js/components/personal/moneyAccount.tpl.html",
				controller: 'moneyAccountController as moneyAccount',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/moneyAccount.controller.js")
				}
			}
		}

		//帐户设置-添加支付宝帐户
		function addMoneyAccount() {
			return {
				url: '/addMoneyAccount',
				templateUrl: appConfig.baseUrl + "js/components/personal/addMoneyAccount.tpl.html",
				controller: 'addMoneyAccountController as addMoneyAccount',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/addMoneyAccount.controller.js")
				}
			}
		}

		//帐户设置-添加银行卡
		function addBank() {
			return {
				url: '/addBank',
				templateUrl: appConfig.baseUrl + "js/components/personal/addBank.tpl.html",
				controller: 'addBankController as addBank',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/addBank.controller.js")
				}
			}
		}

		//帐户设置-添加银行卡
		function myBankCard() {
			return {
				url: '/myBankCard',
				templateUrl: appConfig.baseUrl + "js/components/personal/myBankCard.tpl.html",
				controller: 'myBankCardController as myBankCard',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/myBankCard.controller.js")
				}
			}
		}

		//帐户设置-收货地址
		function address() {
			return {
				url: '/address',
				templateUrl: appConfig.baseUrl + "js/components/personal/address.tpl.html",
				controller: 'addressController as address',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/personal/address.controller.js")
				}
			}
		}

		//发起众筹
		function addCrowdFund() {
			return {
				url: '/addCrowdFund',
				templateUrl: appConfig.baseUrl + "js/components/crowdFund/addCrowdFund.tpl.html",
				controller: 'addCrowdFundController as addCrowdFund',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/crowdFund/addCrowdFund.controller.js")
				}
			}
		}

		//编辑众筹
		function updateCrowdFund() {
			return {
				url: '/updateCrowdFund/:id',
				templateUrl: appConfig.baseUrl + "js/components/crowdFund/updateCrowdFund.tpl.html",
				controller: 'updateCrowdFundController as updateCrowdFund',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/crowdFund/updateCrowdFund.controller.js")
				}
			}
		}

		//发布活动
		function addActivity() {
			return {
				url: '/addActivity',
				templateUrl: appConfig.baseUrl + "js/components/activity/addActivity.tpl.html",
				controller: 'addActivityController as addActivity',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/activity/addActivity.controller.js")
				}
			}
		}

		//修改活动
		function updateActivity() {
			return {
				url: '/updateActivity/:id',
				templateUrl: appConfig.baseUrl + "js/components/activity/updateActivity.tpl.html",
				controller: 'updateActivityController as updateActivity',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/activity/updateActivity.controller.js")
				}
			}
		}

		//修改活动
		function peopleList() {
			return {
				url: '/peopleList/:id',
				templateUrl: appConfig.baseUrl + "js/components/activity/peopleList.tpl.html",
				controller: 'peopleListController as peopleList',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/activity/peopleList.controller.js")
				}
			}
		}

		//公益众筹
		function crowdFund() {
			return {
				url: '/crowdFund',
				templateUrl: appConfig.baseUrl + "js/components/crowdFund/crowdFund.tpl.html",
				controller: 'crowdFundController as crowdFund',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/crowdFund/crowdFund.controller.js")
				}
			}
		}

		//众筹中心
		function crowdFundList() {
			return {
				url: '/crowdFundList',
				templateUrl: appConfig.baseUrl + "js/components/crowdFund/crowdFundList.tpl.html",
				controller: 'crowdFundListController as crowdFundList',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/crowdFund/crowdFundList.controller.js")
				}
			}
		}

		//众筹详情
		function crowdFundDetail() {
			return {
				url: '/crowdFundDetail/:crowdFundId',
				templateUrl: appConfig.baseUrl + "js/components/crowdFund/crowdFundDetail.tpl.html",
				controller: 'crowdFundDetailController as crowdFundDetail',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/crowdFund/crowdFundDetail.controller.js"),
				}
			}
		}

		//众筹下单
		function crowdFundOrder() {
			return {
				url: '/crowdFundOrder/:deal_id/:user_id/:item_id/:price',
				templateUrl: appConfig.baseUrl + "js/components/crowdFund/crowdFundOrder.tpl.html",
				controller: 'crowdFundOrderController as crowdFundOrder',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/crowdFund/crowdFundOrder.controller.js")
				}
			}
		}

		//添加表单
		function addForm() {
			return {
				url: '/addForm',
				templateUrl: appConfig.baseUrl + "js/components/addForm/addForm.tpl.html",
				controller: 'addFormController as addForm',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/addForm/addForm.controller.js")
				}
			}
		}

		//选择评审模板
		function selectExamine() {
			return {
				url: '/selectExamine',
				templateUrl: appConfig.baseUrl + "js/components/examine/selectExamine.tpl.html",
				controller: 'selectExamineController as selectExamine',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/selectExamine.controller.js")
				}
			}
		}

		//添加项目评审三级
		function addExamine3() {
			return {
				url: '/addExamine3/:order_sn/:review_sn/:type',
				templateUrl: appConfig.baseUrl + "js/components/examine/addExamine3.tpl.html",
				controller: 'addExamineController as addExamine',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/addExamine.controller.js")
				}
			}
		}

		//添加项目评审二级
		function addExamine2() {
			return {
				url: '/addExamine2/:order_sn/:review_sn/:type',
				templateUrl: appConfig.baseUrl + "js/components/examine/addExamine2.tpl.html",
				controller: 'addExamineController as addExamine',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/addExamine.controller.js")
				}
			}
		}

		//添加项目评审一级
		function addExamine1() {
			return {
				url: '/addExamine1/:order_sn/:review_sn/:type',
				templateUrl: appConfig.baseUrl + "js/components/examine/addExamine1.tpl.html",
				controller: 'addExamineController as addExamine',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/addExamine.controller.js")
				}
			}
		}

		//项目评审
		function examineList() {
			return {
				url: '/examineList',
				templateUrl: appConfig.baseUrl + "js/components/examine/examineList.tpl.html",
				controller: 'examineListController as examineList',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/examineList.controller.js")
				}
			}
		}

		//项目评审详情
		function examineDetail() {
			return {
				url: '/examineDetail/:order_sn/:review_sn/:review_template/:type', //order_sn:订单号，review_sn:表单号，review_template:模板类型，type:0=>评审，type:1=>评估
				templateUrl: appConfig.baseUrl + "js/components/examine/examineDetail.tpl.html",
				controller: 'examineDetailController as examineDetail',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/examineDetail.controller.js")
				}
			}
		}

		//评审结果、评估结果
		function examineResult() {
			return {
				url: '/examineResult/:review_id/:review_sn/:type', //review_sn:表单号，type:0=>评审，type:1=>评估
				templateUrl: appConfig.baseUrl + "js/components/examine/examineResult.tpl.html",
				controller: 'examineResultController as examineResult',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/examineResult.controller.js")
				}
			}
		}

		//评分结果
		function finalScore() {
			return {
				url: '/finalScore/:review_id',
				templateUrl: appConfig.baseUrl + "js/components/examine/finalScore.tpl.html",
				controller: 'finalScoreController as finalScore',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/finalScore.controller.js")
				}
			}
		}

		//编辑评估报告
		function editReport() {
			return {
				url: '/editReport/:review_sn/:report_type',
				templateUrl: appConfig.baseUrl + "js/components/examine/editReport.tpl.html",
				controller: 'editReportController as editReport',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/editReport.controller.js")
				}
			}
		}

		//主办方列表
		function sponsorList() {
			return {
				url: '/sponsorList',
				templateUrl: appConfig.baseUrl + "js/components/sponsor/sponsorList.tpl.html",
				controller: 'sponsorListController as sponsorList',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/sponsor/sponsorList.controller.js")
				}
			}
		}

		//主办方详情
		function sponsorDetail() {
			return {
				url: '/sponsorDetail/:id',
				templateUrl: appConfig.baseUrl + "js/components/sponsor/sponsorDetail.tpl.html",
				controller: 'sponsorDetailController as sponsorDetail',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/sponsor/sponsorDetail.controller.js")
				}
			}
		}

		//订单支付界面
		function payMoney() {
			return {
				url: '/payMoney/:id/:price/:num/:Project_type/:url',
				templateUrl: appConfig.baseUrl + "js/components/payMoney/payMoney.tpl.html",
				controller: 'payMoneyController as payMoney',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/payMoney/payMoney.controller.js")
				}
			}
		}

		//预约评审/评估
		function appointment() {
			return {
				url: '/appointment',
				templateUrl: appConfig.baseUrl + "js/components/order/appointment.tpl.html",
				controller: 'appointmentController as appointment',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/order/appointment.controller.js")
				}
			}
		}

		//预约评审表单
		function orderReview() {
			return {
				url: '/orderReview',
				templateUrl: appConfig.baseUrl + "js/components/order/orderReview.tpl.html",
				controller: 'orderReviewController as orderReview',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/order/orderReview.controller.js")
				}
			}
		}

		//预约评估表单
		function orderEstimate() {
			return {
				url: '/orderEstimate',
				templateUrl: appConfig.baseUrl + "js/components/order/orderEstimate.tpl.html",
				controller: 'orderEstimateController as orderEstimate',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/order/orderEstimate.controller.js")
				}
			}
		}

		//机构名录
		function companyList() {
			return {
				url: '/companyList',
				templateUrl: appConfig.baseUrl + "js/components/companyList/companyList.tpl.html",
				controller: 'companyListController as companyList',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/companyList/companyList.controller.js")
				}
			}
		}

		//加入名录
		function joinList() {
			return {
				url: '/joinList',
				templateUrl: appConfig.baseUrl + "js/components/companyList/joinList.tpl.html",
				controller: 'joinListController as joinList',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/companyList/joinList.controller.js")
				}
			}
		}

		//评审/评估首页
		function examineHome() {
			return {
				url: '/examineHome',
				templateUrl: appConfig.baseUrl + "js/components/examine/examineHome.tpl.html",
				controller: 'examineHomeController as examineHome',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/examine/examineHome.controller.js")
				}
			}
		}

		//软件开发
		function software() {
			return {
				url: '/software',
				templateUrl: appConfig.baseUrl + "js/components/software/software.tpl.html",
				controller: 'softwareController as software',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/software/software.controller.js")
				}
			}
		}

		//预约评审，预约评估
		function order() {
			return {
				url: '/order/:type', //type 0:评审，1：评估
				templateUrl: appConfig.baseUrl + "js/components/order/order.tpl.html",
				controller: 'orderController as order',
				resolve: {
					loadMyCtrl: loadFileProvider.$get().load(appConfig.baseUrl + "js/components/order/order.controller.js")
				}
			}
		}

	}
})();

(function() {
	//配置router全局调用参数
	app.run(routerGlobal);
	routerGlobal.$inject = ['$rootScope'];

	function routerGlobal($rootScope) {

		$rootScope.showMenu = true;
		$rootScope.showFooter = true;

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

			//监听路由变化，设置menu和footer的显示；以下数组里的路由名，都是不显示menu,footer的
			var filterRouterArray = ["login"];
			if (filterRouterArray.indexOf(toState.name) >= 0) {
				$rootScope.showMenu = false;
				$rootScope.showFooter = false;
			} else {
				$rootScope.showMenu = true;
				$rootScope.showFooter = true;
			}

			//清除window.onresize  
			window.onresize = function() {

			}

			//清除window.onscroll事件
			window.onscroll = function() {

			}
		});

		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			//当前页面加载完成后的  路由名
			$rootScope.currentRouter = toState.name; //当前路由名
			$rootScope.fromState = fromState; //上一个路由名
			$rootScope.fromParams = fromParams; //上一个路由参数
		});
	}

})();