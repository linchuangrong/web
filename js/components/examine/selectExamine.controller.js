/**
 * 作者：林创荣
 * 功能：选择评审、评估模板
 * 时间：2016年11月30日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/examine.service.min.js', 'examine.service'); //富文本编辑器，要求先引入wangEditor.min.js

	app.addController("selectExamineController", selectExamineController);
	selectExamineController.$inject = ['$rootScope', '$window', 'examineService', '$state'];

	function selectExamineController($rootScope, $window, examineService, $state) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "选择评审、评估模板";
		var vm = this;

		/*****************变量 begin****************/

		vm.price = "30";

		//应用场景数组，跟后台协商好的，写死这个数组
		vm.typeArray = [{
			id: '0',
			name: '评审'
		}, {
			id: "1",
			name: '评估'
		}];
		//评审、评估模板 数组，跟后台协商好的，写死这个数组
		vm.panelArray = [{
			id: '1',
			name: "模板1"
		}, {
			id: '2',
			name: "模板2"
		}, {
			id: '3',
			name: "模板3"
		}];

		vm.selectType = vm.typeArray[0]; //选中的应用场景：默认选中第一个
		vm.selectPanel = vm.panelArray[0]; //选中的应用模板：默认选中第一个

		vm.alert_dialog = false;

		vm.flag = {
			getReviewPriceFlag: true, //获取价格标识量
			setReviewOrderFlag: true, //创建订单
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.setSelectType = setSelectTypeFn;
		vm.setSelectPanel = setSelectPanelFn;

		vm.showDialog = showDialogFn; //显示弹框
		vm.alertDialogConfirm = alertDialogConfirmFn; //确定
		vm.alertDialogCancel = alertDialogCancelFn; //取消

		/*****************函数 end****************/

		//
		//
		//
		//
		//
		//----------------------------设置选中的应用场景------------------------------------------
		//
		//
		//
		//
		//
		function setSelectTypeFn(params) {
			vm.selectType = params;
		}
		//
		//
		//
		//
		//
		//----------------------------设置选中的模板------------------------------------------
		//
		//
		//
		//
		//
		function setSelectPanelFn(params) {
			vm.selectPanel = params;
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
		function showDialogFn() {

			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("请先登录");
				return false;
			}

			//发起接口请求，获取商品最终价格
			var params = {
				user_id: $rootScope.userInfo.id,
				type: vm.selectType.id,
				template: vm.selectPanel.id
			}
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.getReviewPriceFlag = false;
			examineService.getReviewPrice(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if (data.data.code == 20000) {
							vm.price = data.data.price;
							vm.alert_dialog = true;
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {
					//
				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.getReviewPriceFlag = true;
				}
			});
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
			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("请先登录");
				return false;
			}

			//防止重复点击
			if (!vm.flag.setReviewOrderFlag) {
				return false;
			}

			//发起接口请求，获取商品最终价格
			var params = {
				user_id: $rootScope.userInfo.id,
				type: vm.selectType.id,
				template: vm.selectPanel.id
			}
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.setReviewOrderFlag = false;
			examineService.setReviewOrder(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if (data.data.code == 20000) {
							//window.showAutoDialog(data.data.msg + " 可在个人中心-我的评审（我的评估）查看");
							if (vm.selectType.id == '0') {
								$state.go("payMoney", {
									"id": data.data.order_info.order_sn,
									"price": data.data.order_info.price,
									"num": '1',
									"Project_type": '1', //项目类型：0活动众筹，1评审评估
									"url": "personal.myReview" //我的评审
								});
							} else {
								$state.go("payMoney", {
									"id": data.data.order_info.order_sn,
									"price": data.data.order_info.price,
									"num": '1',
									"Project_type": '1', //项目类型：0活动众筹，1评审评估
									"url": "personal.myEstimate" //我的评估
								});
							}

						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {
					//
				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.setReviewOrderFlag = true;
					//最终隐藏掉价格弹框
					vm.alert_dialog = false;
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
			vm.alert_dialog = false;
		}
	}
})();