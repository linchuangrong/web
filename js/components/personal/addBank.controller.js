/**
 * 作者：林创荣
 * 功能：帐户设置-添加银行卡
 * 时间：2016年9月19日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/public.service.js', 'public.service'); //引入“公共接口”服务

	app.addController("addBankController", addBankController);
	addBankController.$inject = ['$rootScope', 'personalService', 'publicService', '$state'];

	function addBankController($rootScope, personalService, publicService, $state) {
		$rootScope.title = "帐户设置-添加银行卡";
		var vm = this;

		/*****************变量 begin****************/

		//添加银行卡表单
		vm.addBankForm = {
			bank_id: "", //银行标识ID
			bank_name: "", //银行名称
			bankcard: "", //银行卡号
			rep_bankcard: "", //重复银行卡号
			real_name: "", //真实姓名
			bankzone: "", //开户行网点
			verify_coder: "" //验证码
		}

		vm.flag = {
			addBankFlag: true //标识量
		}

		//银行列表
		vm.bankArray = [{
			id: 111,
			name: "建设银行"
		}, {
			id: 112,
			name: "招商银行"
		}, {
			id: 113,
			name: "工商银行"
		}, {
			id: 114,
			name: "农业银行"
		}];

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.changeBank = changeBankFn; //选择银行
		vm.addBankSubmit = addBankSubmitFn; //添加一张银行卡

		/*****************函数 end****************/

		//
		//
		//
		//
		//
		//-----------------------------获取银行列表-----------------------------------------
		//
		//
		//
		//
		//
		publicService.getBankList().success(function(data) {
			if(data.ret != 200) {
				widnow.showAutoDialog(data.msg);
			} else {
				if(data.data.code == 20000) {
					vm.bankArray = data.data.list;
					//默认选中第一个银行
					vm.selectBank = vm.bankArray[0];
					vm.addBankForm.bank_id = vm.bankArray[0].id;
					vm.addBankForm.bank_name = vm.bankArray[0].name;
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
		//-----------------------------选择银行-----------------------------------------
		//
		//
		//
		//
		//
		function changeBankFn() {
			vm.addBankForm.bank_id = vm.selectBank.id;
			vm.addBankForm.bank_name = vm.selectBank.name;
		}
		//
		//
		//
		//
		//
		//-----------------------------添加一张银行卡-----------------------------------------
		//
		//
		//
		//
		//
		function addBankSubmitFn() {

			//防止重复点击
			if(vm.flag.addBankFlag == false) {
				return false;
			}

			var params = {
				"id": $rootScope.userInfo.id, //用户id
				"username": $rootScope.userInfo.user_name, //用户名
				"bank_id": vm.addBankForm.bank_id, //银行标识ID
				"bank_name": vm.addBankForm.bank_name, //银行名称
				"bankcard": vm.addBankForm.bankcard, //银行卡号
				"rep_bankcard": vm.addBankForm.rep_bankcard, //重复银行卡号
				"real_name": vm.addBankForm.real_name, //真实姓名
				"bankzone": vm.addBankForm.bankzone, //开户行网点
				"verify_coder": vm.addBankForm.verify_coder //验证码
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			//设置为false
			vm.flag.addBankFlag = false;
			//接口请求
			personalService.addBank(params).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if(data.data.code == 20000) {
							window.showAutoDialog(data.data.msg);
							//页面跳转
							$state.go("personal.myBankCard");
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch(e) {
					//TODO handle the exception
				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.addBankFlag = true;
				}
			});
		}
	}
})();