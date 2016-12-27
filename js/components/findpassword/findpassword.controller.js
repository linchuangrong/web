/**
 * 作者：林创荣
 * 功能：找回密码
 * 时间：2016年9月12日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/login.service.js', 'login.service'); //引入“登录”接口 服务

	app.addController("findpasswordController", findpasswordController);
	findpasswordController.$inject = ['$rootScope', '$window', 'loginService', '$state'];

	function findpasswordController($rootScope, $window, loginService, $state) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "找回密码";
		var vm = this;

		/*****************变量 begin****************/

		vm.imgCodeSrc = loginService.getImgCode(); //图片验证码的地址

		vm.submitForm = {
			username: "", //用户名
			verify_coder: "", //手机验证码
			new_pwd: "", //新密码
			reply_pwd: "", //确认新密码
			image_coder: "", //图片验证码
		}

		vm.flag = {
			submitFlag: true,
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.setImgCodeSrc = setImgCodeSrcFn; //看不清，换一张验证码
		vm.submit = submitFn; //提交

		/*****************函数 end****************/

		//
		//
		//
		//
		//
		//----------------------------图片验证码------------------------------------------
		//
		//
		//
		//
		//
		function setImgCodeSrcFn() {
			vm.imgCodeSrc = loginService.getImgCode();
		}

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
			if(!vm.flag.submitFlag) {
				return false;
			}

			//校验两个新密码
			if(vm.submitForm.new_pwd != vm.submitForm.reply_pwd) {
				return false;
			}

			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.submitFlag = false;

			loginService.findPassword(vm.submitForm).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if(data.data.code == 20000) {
							window.showAutoDialog(data.data.msg);
							$state.go("login");
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch(e) {

				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.submitFlag = true;
				}

			});
		}

	}
})();