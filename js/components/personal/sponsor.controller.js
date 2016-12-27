/**
 * 作者：林创荣
 * 功能：帐户设置-主办方
 * 时间：2016年9月19日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/imgUpload.directive.js', 'imgUpload.directive'); //图片上传插件

	app.addController("sponsorController", sponsorController);
	sponsorController.$inject = ['$rootScope', '$state', 'personalService'];

	function sponsorController($rootScope, $state, personalService) {
		$rootScope.title = "帐户设置-主办方";
		var vm = this;
		
		//阻止普通用户进入此页面
		if($rootScope.userInfo.identity_conditions != 0) {
			window.showAlertTip(["您不是主办方，无权限进入主办方页面", 3000]);
			$state.go("personal.home");
			return false;
		}
		//如果未进行企业认证通过，则仍然进不了这页面
		if($rootScope.userInfo.is_investor != 2) {
			window.showAlertTip(["请您先进行企业认证", 3000]);
			$state.go("personal.safe");
			return false;
		}

		/*****************变量 begin****************/

		vm.setSponsorForm = {
			"company_user": $rootScope.userInfo.company_user, //单位联系人
			"company_desc": $rootScope.userInfo.company_desc, //单位简介
			"company_email": $rootScope.userInfo.company_email, //单位邮箱
			"company_phone": $rootScope.userInfo.company_phone, //单位联系电话
			"company": $rootScope.userInfo.company, //单位地址
			"head_image": $rootScope.userInfo.head_image, //LOGO
			"verify_coder": $rootScope.userInfo.verify_coder, //验证码
		}
		vm.flag = {
			submitFlag: true //提交标识量
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.submit = submitFn;

		/*****************函数 end****************/

		//
		//
		//
		//
		//
		//----------------------------提交------------------------------------------
		//
		//
		//
		//
		//
		function submitFn() {
			//防止重复提交
			if(vm.flag.submitFlag == false) {
				return false;
			}
			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name,
				"company_user": vm.setSponsorForm.company_user, //单位联系人
				"company_desc": vm.setSponsorForm.company_desc, //单位简介
				"company_email": vm.setSponsorForm.company_email, //单位邮箱
				"company_phone": vm.setSponsorForm.company_phone, //单位联系电话
				"company": vm.setSponsorForm.company, //单位地址
				"head_image": vm.setSponsorForm.head_image, //LOGO
				"verify_coder": vm.setSponsorForm.verify_coder, //验证码
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			//修改标识量
			vm.flag.submitFlag = false;
			//接口请求
			personalService.setSponsor(params).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if(data.data.code == 20000) {
							window.showAutoDialog(data.data.msg);
							$state.reload();
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch(e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.submitFlag = true;
				}
			});
		}

	}
})();