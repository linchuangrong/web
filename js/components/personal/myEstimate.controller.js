/**
 * 作者：林创荣
 * 功能：我的评估
 * 时间：2016年12月13日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件
	app.import('/app/Tpl/web/js/service/examine.service.js', 'examine.service'); //引入“评审评估”接口 服务
	app.import('/app/Tpl/web/js/directive/repeatDone.directive.js', 'repeatDone.directive'); //引入“循环结束”

	app.addController("myEstimateController", myEstimateController);
	myEstimateController.$inject = ['$rootScope', 'personalService', '$filter', '$window', '$state', 'examineService', '$location'];

	function myEstimateController($rootScope, personalService, $filter, $window, $state, examineService, $location) {
		$rootScope.title = "我的评估";
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

		vm.estimateArray = [];

		vm.flag = {
			openFlag: true, //开评标识量
			closeFlag: true, //结束评审标识量
			getReportPriceFlag: true, //获取电子报告，纸质报告的价格
			setReportOrderFlag: true, //提交电子报告、纸质报告订单
		}

		vm.editReportDialog = false; //弹框：编辑报告选择价格
		vm.selectReportType = '0'; //评估报告类型:0=>电子,1=>纸质

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getEstimate = getEstimateFn; //获取我的评估列表
		vm.setCopy = setCopyFn; //开始处理复制文字到剪贴板功能

		vm.open = openFn; //开评

		vm.closeDialog = closeDialogFn; //弹出结束评审对话框
		vm.closeDialogConfirm = closeDialogConfirmFn; //确定函数

		vm.getReportPrice = getReportPriceFn; //获取电子报告，纸质报告的价格
		vm.showDialog = showDialogFn; //编辑报告选择价格:显示弹框
		vm.alertDialogConfirm = alertDialogConfirmFn; //编辑报告选择价格:确定
		vm.alertDialogCancel = alertDialogCancelFn; //编辑报告选择价格:取消

		/*****************函数 end****************/

		(function init() {
			vm.getEstimate();

			vm.getReportPrice('0'); //获取电子报告的价格
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
		function getEstimateFn() {
			var params = {
				"pageSize": vm.pageParams.pageSize,
				"current": vm.pageParams.current,
				"user_id": $rootScope.userInfo.id,
				"type": '1' //类型 0评审，1评估
			}

			personalService.getExamineList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.estimateArray = data.data.list;
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
					vm.getEstimateList();
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
		//
		//
		//
		//
		//
		//----------------------------获取电子报告，纸质报告的价格------------------------------------------
		//
		//
		//
		//
		//
		function getReportPriceFn(type) {

			//防止重复点击
			if (!vm.flag.getReportPriceFlag) {
				return false;
			}

			var params = {
				"type": type
			}

			vm.flag.getReportPriceFlag = false;
			$rootScope.$broadcast("public.show", ['loading_panel']);
			examineService.getReportPrice(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							vm.reportPrice = data.data.price.price;
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {
					//TODO handle the exception
				} finally {
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					vm.flag.getReportPriceFlag = true;
				}

			});
		}

		//
		//
		//
		//
		//
		//----------------------------弹出价格框------------------------------------------
		//
		//
		//
		//
		//
		function showDialogFn(review_sn) {

			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("请先登录");
				return false;
			}

			vm.selectReviewSn = review_sn;
			vm.editReportDialog = true;
			console.log(vm.selectReviewId);

		}
		//
		//
		//
		//
		//
		//----------------------------确定事件------------------------------------------
		//
		//
		//
		//
		//
		function alertDialogConfirmFn() {

			if (!vm.flag.setReportOrderFlag) {
				return false;
			}

			//发起接口请求，获取商品最终价格
			var params = {
				"type": vm.selectReportType,
				"user_id": $rootScope.userInfo.id,
				"review_sn": vm.selectReviewSn
			}

			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.setReportOrderFlag = false;
			examineService.setReportOrder(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if (data.data.code == 20000) {
							$state.go("payMoney", {
								"id": data.data.order_info.order_sn,
								"price": data.data.order_info.price,
								"num": '1',
								"Project_type": '2', //项目类型：0活动众筹，1评审评估，2评估报告
								'url': 'personal.myEstimate'
							});
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {
					//
				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.setReportOrderFlag = true;
					//最终隐藏掉价格弹框
					vm.editReportDialog = false;
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------取消事件------------------------------------------
		//
		//
		//
		//
		//
		function alertDialogCancelFn() {
			vm.editReportDialog = false;
		}

	}
})();