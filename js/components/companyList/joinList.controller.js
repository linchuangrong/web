/**
 * 作者：林创荣
 * 功能：加入名录
 * 时间：2016年12月16日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/companyList.service.min.js', 'companyList.service'); //引入“机构名录”接口服务
	app.import('/app/Tpl/web/js/directive/imgUpload.directive.js', 'imgUpload.directive'); //图片上传插件

	app.addController("joinListController", joinListController);
	joinListController.$inject = ['$rootScope', '$stateParams', 'companyListService', '$state'];

	function joinListController($rootScope, $stateParams, companyListService, $state) {
		$rootScope.title = "加入名录";
		var vm = this;

		//要求用户先登录 
		if (!$rootScope.userInfo.id) {
			$state.go("login");
			return false;
		}

		/*****************变量 begin****************/

		vm.submitForm = {
			"user_id": $rootScope.userInfo.id, //用户ID
			"roll_name": "", //单位名称
			"roll_address": "", //单位地址
			"roll_contact": "", //联系人
			"roll_phone": "", //联系电话
			"roll_email": "", //联系邮箱
			"roll_image": "", //单位LOGO
			"roll_certificate": "", //证书图片
			"roll_number": "", //证书编号
		}

		vm.flag = {
			"submitFlag": true
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.submit = submitFn; //提交

		/*****************函数 end****************/

		//
		//
		//
		//
		//
		//----------------------------加入名录------------------------------------------
		//
		//
		//
		//
		//
		function submitFn() {

			//防止重复点击
			if (!vm.flag.submitFlag) {
				return false;
			}

			if (!vm.submitForm.user_id) {
				window.showAlertTip("请先登录");
				return false;
			}

			//提交
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.submitFlag = false; //设置按钮不可点击

			companyListService.joinCompanyList(vm.submitForm).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							window.showAutoDialog(data.data.msg);
							$state.go("companyList");
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					vm.flag.submitFlag = true; //设置按钮可点击
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
				}

			});
		}

	}
})();