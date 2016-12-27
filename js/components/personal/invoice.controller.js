/**
 * 作者：林创荣
 * 功能：帐户设置-发票信息
 * 时间：2016年9月19日
 */
(function() {
	'use strict';

	app.addController("invoiceController", invoiceController);
	invoiceController.$inject = ['$rootScope', '$state', 'personalService', '$timeout'];

	function invoiceController($rootScope, $state, personalService, $timeout) {
		$rootScope.title = "帐户设置-发票信息设置";
		var vm = this;

		/*****************变量 begin****************/

		vm.setInvoiceForm = {
			"deal_name": "", //项目名称
			"invoice_title": "", //发票抬头
			"consignee": "", //联系人
			"mobile": "", //联系电话
			"address": "" //寄送地址
		}

		vm.dealNameArray = []; //项目名称列表

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getInvoiceProject = getInvoiceProjectFn; //获取发票项目列表
		vm.getInvoice = getInvoiceFn; //获取发票项目列表
		vm.setInvoiceSubmit = setInvoiceSubmitFn; //提交

		/*****************函数 end****************/

		(function init() {
			//1.获取发票项目；2.获取用户曾经设置好的资料
			vm.getInvoiceProject(vm.getInvoice);
		})();

		//
		//
		//
		//
		//
		//-----------------------------获取发票项目列表-----------------------------------------
		//
		//
		//
		//
		//
		function getInvoiceProjectFn(callback) {
			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name
			}
			personalService.getInvoiceProject(params).success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if(data.data.code == 20000) {
						vm.dealNameArray = data.data.list;
						//执行回调函数
						if(callback) {
							callback();
						}
					} else {
						window.showAutoDialog(data.data.msg);
					}
				}
			});
		};

		//
		//
		//
		//
		//
		//-----------------------------获取以前设置好的发票内容-----------------------------------------
		//
		//
		//
		//
		//
		function getInvoiceFn() {
			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name
			}
			personalService.getInvoice(params).success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if(data.data.code == 20000) {
						vm.setInvoiceForm = {
							"deal_name": data.data.list.deal_name, //项目名称
							"invoice_title": data.data.list.invoice_title, //发票抬头
							"consignee": data.data.list.consignee, //联系人
							"mobile": data.data.list.mobile, //联系电话
							"address": data.data.list.address //寄送地址
						}
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
		//-----------------------------提交保存-----------------------------------------
		//
		//
		//
		//
		//
		function setInvoiceSubmitFn() {

			if(!vm.setInvoiceForm.deal_name) {
				window.showAlertTip("请选择发票项目");
				return false;
			}

			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name,
				"deal_name": vm.setInvoiceForm.deal_name, //项目名称
				"invoice_title": vm.setInvoiceForm.invoice_title, //发票抬头
				"consignee": vm.setInvoiceForm.consignee, //联系人
				"mobile": vm.setInvoiceForm.mobile, //联系电话
				"address": vm.setInvoiceForm.address //寄送地址
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			personalService.setInvoice(params).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if(data.data.code = 20000) {
							window.showAutoDialog(data.data.msg);
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