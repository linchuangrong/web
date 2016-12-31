/**
 * 作者：林创荣
 * 功能：主办方详情
 * 时间：2016年10月24日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件
	app.import('/app/Tpl/web/js/service/service_min/sponsor.service.min.js', 'sponsor.service'); //引入“主办方”接口 服务

	app.addController("sponsorDetailController", sponsorDetailController);
	sponsorDetailController.$inject = ['$rootScope', '$window', 'sponsorService', '$stateParams', '$state'];

	function sponsorDetailController($rootScope, $window, sponsorService, $stateParams, $state) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "主办方详情";
		var vm = this;

		/*****************变量 begin****************/

		vm.activePanel = 'activity'; //默认显示活动界面

		//分页参数
		vm.pageParams1 = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 5, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn1 //切换页面函数
		}

		//分页参数
		vm.pageParams2 = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 5, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn2 //切换页面函数
		}

		vm.sponsorInfo = {}; //主办方基本信息
		vm.activityArray = []; //主办方发布的活动
		vm.crowdFundArray = []; //主办方发布的众筹

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getUserFocusFlag = getUserFocusFlagFn; //判断用户是否已经关注了主办方
		vm.focusSponsor = focusSponsorFn; //关注主办方

		vm.getSponsorDetail = getSponsorDetailFn; //获取主办方详情

		vm.getActivityList = getActivityListFn; //主办方发布的活动
		vm.getCrowdFundList = getCrowdFundListFn; //主办方发布的众筹

		vm.setActivityStop = setActivityStopFn; //设置活动是否已经结束

		/*****************函数 end****************/

		(function init() {

			vm.getUserFocusFlag(); //判断用户是否已经关注了主办方
			vm.getSponsorDetail(); //获取主办方详情

			vm.getActivityList(); //主办方发布的活动
			vm.getCrowdFundList(); //主办方发布的众筹

		})();

		//
		//
		//
		//
		//
		//----------------------------判断用户是否已经关注了主办方------------------------------------------
		//
		//
		//
		//
		//
		function getUserFocusFlagFn() {
			var params = {
				"sponsor_id": $stateParams.sponsor_id,
				"user_id": $rootScope.userInfo.id
			}
			sponsorService.getUserFocusFlag(params)
				.success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							vm.focusFlag = (data.data.status == 1 ? true : false);
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				});
		}
		//
		//
		//
		//
		//
		//----------------------------关注主办方------------------------------------------
		//
		//
		//
		//
		//
		function focusSponsorFn(id) {
			var params = {
				"user_id": $rootScope.userInfo.id,
				"sponsor_id": id,
				"username": $rootScope.userInfo.user_name
			}
			sponsorService.getSponsorFocus(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if (data.data.code == 20000) {
						window.showAlertTip(data.data.msg);
						$state.reload();
					} else {
						window.showAlertTip(data.data.msg);
					}
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------主办方详情------------------------------------------
		//
		//
		//
		//
		//
		function getSponsorDetailFn() {
			var params = {
				"id": $stateParams.sponsor_id,
			}
			sponsorService.getSponsorDetail(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if (data.data.code == 20000) {
						vm.sponsorInfo = data.data.info[0];
						vm.active_num = data.data.active_num;
						vm.welfare_num = data.data.welfare_num;
						//百度分享
						window._bd_share_config = {
							"common": {
								"bdSnsKey": {
									"tsina": "89d1afaf46168b260f0a8adee885f71d",
									"tqq": "c4ea495e3ee3f424b0118f72de250fb4"
								},
								"bdSign": "off",
								"bdMini": "2",
								"bdMiniList": false,
								"bdStyle": "0",
								"bdSize": "24",
								"bdText": vm.sponsorInfo.identify_bs_name, //标题
								"bdPic": vm.sponsorInfo.image, //图片
								"bdComment": vm.sponsorInfo.company_desc, //简介
							},
							"share": {}
						};
						window._bd_share_main = null; //如果不设置这句话，会导致第二次进入页面，无法出现分享图标
						var path = '/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
						$("body").append("<script defer async='true' src='" + path + "'></script>");
					} else {
						window.showAutoDialog(data.data.msg);
					}
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------活动列表------------------------------------------
		//
		//
		//
		//
		//
		function getActivityListFn() {
			var params = {
				"sponsor_id": $stateParams.sponsor_id,
				"pageSize": vm.pageParams1.pageSize,
				"current": vm.pageParams1.current,
				"type": "1"
			}
			sponsorService.getSponsorDetailList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if (data.data.code == 20000) {
						vm.activityArray = data.data.list;
						vm.pageParams1.page_count = data.data.page_count;
					} else {
						window.showAutoDialog(data.data.msg);
					}
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------活动分页事件------------------------------------------
		//
		//
		//
		//
		//
		function pageChangeFn1() {
			return function(param) {
				if (parseInt(param) > 0 && parseInt(param) <= vm.pageParams1.page_count) {
					//修改页码
					vm.pageParams1.current = parseInt(param);
					//获取数据
					vm.getActivityList();
					//滚动到顶部
					angular.element($window).scrollTop(0);
				} else {
					console.log("输入非法");
				}
			}
		}
		//
		//
		//
		//
		//
		//----------------------------众筹列表------------------------------------------
		//
		//
		//
		//
		//
		function getCrowdFundListFn() {
			var params = {
				"sponsor_id": $stateParams.sponsor_id,
				"pageSize": vm.pageParams2.pageSize,
				"current": vm.pageParams2.current,
				"type": "3"
			}
			sponsorService.getSponsorDetailList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if (data.data.code == 20000) {
						vm.crowdFundArray = data.data.list;
						vm.pageParams2.page_count = data.data.page_count;
					} else {
						window.showAutoDialog(data.data.msg);
					}
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------众筹分页事件------------------------------------------
		//
		//
		//
		//
		//
		function pageChangeFn2() {
			return function(param) {
				if (parseInt(param) > 0 && parseInt(param) <= vm.pageParams2.page_count) {
					//修改页码
					vm.pageParams2.current = parseInt(param);
					//获取数据
					vm.getCrowdFundList();
					//滚动到顶部
					angular.element($window).scrollTop(0);
				} else {
					console.log("输入非法");
				}
			}
		}
		//
		//
		//
		//
		//
		//-----------------------------检查活动是否已经结束（param=结束时间）-----------------------------------------
		//
		//
		//
		//
		//
		function setActivityStopFn(param) {
			var now = Date.parse(new Date()) / 1000;
			if (now >= param) {
				return true; //已经停止
			} else {
				return false; //进行中
			}
		}

	}
})();