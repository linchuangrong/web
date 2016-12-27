/**
 * 作者：林创荣
 * 功能：主办方详情
 * 时间：2016年10月24日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件
	app.import('/app/Tpl/web/js/service/sponsor.service.js', 'sponsor.service'); //引入“主办方”接口 服务

	app.addController("sponsorDetailController", sponsorDetailController);
	sponsorDetailController.$inject = ['$rootScope', '$window', 'sponsorService', '$stateParams', '$state'];

	function sponsorDetailController($rootScope, $window, sponsorService, $stateParams, $state) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "主办方详情";
		var vm = this;

		/*****************变量 begin****************/

		//分页参数
		vm.pageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 12, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: pageChangeFn //切换页面函数
		}

		vm.sponsorInfo = {}; //主办方基本信息
		vm.sponsorDataList = []; //主办方发布的活动、众筹

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getSponsorDetail = getSponsorDetailFn; //获取主办方详情
		vm.focusSponsor = focusSponsorFn; //关注主办方

		/*****************函数 end****************/

		(function init() {
			vm.getSponsorDetail();
			
			//百度分享
			window._bd_share_config = {
				"common": {
					"bdSnsKey": {
						"tsina": "89d1afaf46168b260f0a8adee885f71d",
						"tqq": "c4ea495e3ee3f424b0118f72de250fb4"
					},
					"bdText": "文字文字文字文字文字文字文字",
					"bdMini": "2",
					"bdMiniList": false,
					"bdPic": "https://image.eitty.cn/LOGO108-108.png",
					"bdStyle": "0",
					"bdSize": "24"
				},
				"share": {}
			};
			window._bd_share_main = null; //如果不设置这句话，会导致第二次进入页面，无法出现分享图标
			var path = '/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
			//var path = 'http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
			$("body").append("<script defer async='true' src='" + path + "'></script>");
		})();

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
				"id": $stateParams.id,
				"pageSize": vm.pageParams.pageSize,
				"current": vm.pageParams.current
			}
			sponsorService.getSponsorDetail(params).success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if(data.data.code == 20000) {
						vm.sponsorInfo = data.data.info[0];
						vm.sponsorDataList = data.data.list;
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
		//----------------------------分页事件------------------------------------------
		//
		//
		//
		//
		//
		function pageChangeFn() {
			return function(param) {
				if(parseInt(param) > 0 && parseInt(param) <= vm.pageParams.page_count) {
					//修改页码
					vm.pageParams.current = parseInt(param);
					//获取数据
					vm.getSponsorDetail();
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
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if(data.data.code == 20000) {
						window.showAlertTip(data.data.msg);
						$state.reload();
					} else {
						window.showAlertTip(data.data.msg);
					}
				}
			});
		}
	}
})();