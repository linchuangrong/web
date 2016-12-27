/**
 * 作者：林创荣
 * 功能：我的评审
 * 时间：2016年12月13日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件
	app.import('/app/Tpl/web/js/service/examine.service.js', 'examine.service'); //引入“评审评估”接口 服务
	app.import('/app/Tpl/web/js/directive/repeatDone.directive.js', 'repeatDone.directive'); //引入“循环结束”

	app.addController("myReviewController", myReviewController);
	myReviewController.$inject = ['$rootScope', 'personalService', '$window', '$state', 'examineService', '$location'];

	function myReviewController($rootScope, personalService, $window, $state, examineService, $location) {
		$rootScope.title = "我的评审";
		var vm = this;

		/*****************变量 begin****************/

		vm.baseUrl = $location.host(); //服务器地址

		//分页参数
		vm.pageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 10, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 22, //总共多少页
			pageChange: pageChangeFn //切换页面函数
		}

		vm.reviewArray = [];

		vm.flag = {
			openFlag: true, //开评标识量
			closeFlag: true, //结束评审标识量
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getReviewList = getReviewListFn; //获取我的评审列表
		vm.setCopy = setCopyFn; //开始处理复制文字到剪贴板功能

		vm.open = openFn; //开评

		vm.closeDialog = closeDialogFn; //弹出结束评审对话框
		vm.closeDialogConfirm = closeDialogConfirmFn; //确定函数

		/*****************函数 end****************/

		(function init() {
			vm.getReviewList();

		})();

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
		function getReviewListFn() {
			var params = {
				"pageSize": vm.pageParams.pageSize,
				"current": vm.pageParams.current,
				"user_id": $rootScope.userInfo.id,
				"type": '0' //类型 0评审，1评估
			}

			personalService.getExamineList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.reviewArray = data.data.list;
						vm.pageParams.page_count = data.data.page_count; //总页码
						//请求结束
						vm.loaded = true;
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
		//----------------------------复制到剪贴板------------------------------------------
		//
		//
		//
		//
		//
		function setCopyFn() {
			if (window.clipboardData) {
				//IE下可运行
				angular.element(".copy-button").bind("click", function(e) {
					var clipBoardContent = angular.element(this).attr("data-clipboard-text");
					window.clipboardData.setData("Text", clipBoardContent);
					window.showAlertTip("复制完成");
				})
			} else {
				//不支持window.clipboardData时，使用插件，复制文字到剪贴板功能
				var client = new ZeroClipboard(document.getElementsByClassName("copy-button"));
				client.on("ready", function(readyEvent) {
					client.on("aftercopy", function(event) {
						window.showAlertTip("复制成功");
					});
				});
			}
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
				if (parseInt(param) > 0 && parseInt(param) <= vm.pageParams.page_count) {
					//修改页码
					vm.pageParams.current = parseInt(param);
					//获取数据
					vm.getReviewList();
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
		//----------------------------开评------------------------------------------
		//
		//
		//
		//
		//
		function openFn(review_sn) {

			//防止重复点击
			if (!vm.flag.openFlag) {
				return false;
			}

			var params = {
				"user_id": $rootScope.userInfo.id,
				"review_sn": review_sn
			}

			//发布活动
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.openFlag = false; //设置按钮不可点击
			examineService.open(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							$state.reload();
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					vm.flag.openFlag = true; //设置按钮可点击
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------弹出结束对话框------------------------------------------
		//
		//
		//
		//
		//
		function closeDialogFn(review_sn) {

			vm.select_review_sn = review_sn; //设置选中的表单编号

			//对话框内容
			var alertDialogObj = {
				alertDialogTitle: "确定结束评分吗？",
				alertDialogConfirm: vm.closeDialogConfirm,
				alertDialogCancel: null, //无值，则使用默认的取消事件
				alertDialogCancelButton: true //显示取消按钮
			}

			//显示弹框
			$rootScope.$broadcast("public.showAlertDialog", alertDialogObj);
		}
		//
		//
		//
		//
		//
		//----------------------------确定结束评审------------------------------------------
		//
		//
		//
		//
		//
		function closeDialogConfirmFn() {

			//防止重复点击
			if (!vm.flag.closeFlag) {
				return false;
			}

			//隐藏掉所有弹框
			$rootScope.$broadcast("public.hide", []);

			//参数
			var params = {
				"user_id": $rootScope.userInfo.id,
				"review_sn": vm.select_review_sn //表单编号
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.closeFlag = false;
			//接口请求
			examineService.close(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							$state.reload();
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					vm.flag.openFlag = true; //设置按钮可点击
					$rootScope.$broadcast("public.hide", ['loading_panel']);
				}
			});
		}
	}
})();