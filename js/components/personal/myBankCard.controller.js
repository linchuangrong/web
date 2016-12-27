/**
 * 作者：林创荣
 * 功能：帐户设置-管理银行卡
 * 时间：2016年9月19日
 */
(function() {
	'use strict';

	app.addController("myBankCardController", myBankCardController);
	myBankCardController.$inject = ['$rootScope', 'personalService', '$state'];

	function myBankCardController($rootScope, personalService, $state) {
		$rootScope.title = "帐户设置-管理银行卡";
		var vm = this;
		/*****************变量 begin****************/

		//银行列表
		vm.bankArray = [];

		vm.deleteCardId = ""; //要删除的银行卡id

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.showAlertDialog = showAlertDialogFn; //开启复杂弹框
		vm.alertDialogConfirm = alertDialogConfirmFn; //确定删除函数

		/*****************函数 end****************/

		//
		//
		//
		//
		//
		//-----------------------------获取银行卡列表-----------------------------------------
		//
		//
		//
		//
		//
		var params = {
			"id": $rootScope.userInfo.id,
			"username": $rootScope.userInfo.user_name
		}
		personalService.getBankList(params).success(function(data) {
			if(data.ret != 200) {
				window.showAutoDialog(data.msg);
			} else {
				if(data.data.code == 20000) {
					vm.bankArray = data.data.list; //银行列表
				} else {
					window.showAutoDialog(data.data.msg);
				}
			}
		});

		//
		//
		//
		//
		//
		//-----------------------------显示删除银行卡弹框-----------------------------------------
		//
		//
		//
		//
		//
		function showAlertDialogFn(param) {
			vm.deleteCardId = param;
			//删除银行卡的对话框内容
			var alertDialogObj = {
				alertDialogTitle: "确定删除银行卡吗？删除之后不可恢复，请谨慎操作！",
				alertDialogConfirm: vm.alertDialogConfirm,
				alertDialogCancel: null, //无值，则使用默认的取消事件
				alertDialogCancelButton: true //显示取消按钮
			}
			$rootScope.$broadcast("public.showAlertDialog", alertDialogObj);
		}
		//
		//
		//
		//
		//
		//-----------------------------确定删除银行卡事件-----------------------------------------
		//
		//
		//
		//
		//
		function alertDialogConfirmFn() {
			//隐藏掉所有弹框
			$rootScope.$broadcast("public.hide", []);

			//参数
			var params = {
				username: $rootScope.userInfo.user_name, //用户名
				id: vm.deleteCardId //银行卡ID
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);

			//接口请求
			personalService.deleteBank(params).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if(data.data.code == 20000) {
							window.showAlertTip(data.data.msg);
							//刷新本页面
							$state.reload();
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch(e) {
					//TODO handle the exception
				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
				}
			});
		}
	}
})();