/**
 * 作者：林创荣
 * 功能：登录
 * 			登录成功，会创建一个全局变量$rootScope.userInfo存储用户的信息
 * 时间：2016年9月12日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/login.service.js', 'login.service'); //引入“登录”接口 服务

	app.addController("loginController", loginController);
	loginController.$inject = ['$rootScope', '$timeout', '$state', 'loginService'];

	function loginController($rootScope, $timeout, $state, loginService) {
		$rootScope.title = "登录/注册";
		var vm = this;

		/*****************变量 begin****************/

		vm.showPanner = "loginPanner";
		vm.imgCodeSrc = loginService.getImgCode(); //图片验证码的地址
		vm.loginName = localStorage.getItem("yiqi_user") || ""; //登录：用户名
		vm.loginPassword = ""; //登录：密码
		vm.loginImgCode = ""; //登录：图片验证码
		vm.remember = true; //登录：记住帐号
		vm.loginError = sessionStorage.getItem("yiqi_loginError") || 0; //登录失败次数
		vm.showLoginImgCode = vm.loginError >= 3;

		vm.conditions = "3"; //默认个人用户,0:主办方，3：个人
		vm.registerName = ""; //注册：手机、邮箱
		vm.registerCode = ""; //注册：手机、邮箱验证码
		vm.registerPassword1 = ""; //注册：密码1
		vm.registerPassword2 = ""; //注册：密码2
		vm.registerImgCode = ""; //注册：图片验证码

		vm.flag = {
			registerFlag: true,
		}

		vm.registerAgree = true; //默认是同意

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.setImgCodeSrc = setImgCodeSrcFn; //看不清，换一张验证码

		vm.setPanner = setPannerFn; //设置登录、注册模块的切换
		vm.login = loginFn; //登录函数

		vm.register = registerFn; //注册函数

		vm.isMobile = isMobileFn; //校验手机号
		vm.isEmail = isEmailFn; //校验邮箱号

		vm.weixinLogin = weixinLoginFn; //微信登录

		/*****************函数 end****************/

		//
		//
		//
		//
		//
		//----------------------------控制面板的显示、隐藏------------------------------------------
		//
		//
		//
		//
		//
		function setPannerFn(param) {
			vm.showPanner = param;
			//刷新图片验证码
			vm.setImgCodeSrc();
		}

		//
		//
		//
		//
		//
		//----------------------------判断是否为手机------------------------------------------
		//
		//
		//
		//
		//
		function isMobileFn(param) {
			var pattern = /^(1[0-9]{10})$/;
			return pattern.test(param);
		}

		//
		//
		//
		//
		//
		//----------------------------判断是否为邮箱------------------------------------------
		//
		//
		//
		//
		//
		function isEmailFn(param) {
			var pattern = /^((\w)+(\.\w+)*@(\w)+((\.\w+)+))$/;
			return pattern.test(param);
		}
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
		//----------------------------登录------------------------------------------
		//
		//
		//
		//
		//
		function loginFn() {

			//禁用按钮
			vm.loginButtonDisabled = true;
			//登录参数
			var loginParams = {
				"username": vm.loginName, //手机号,或者邮箱
				"user_pwd": vm.loginPassword, //密码
				"image_coder": vm.loginImgCode //图片验证码
			}

			//直接登录
			loginService.login(loginParams).success(function(data) {
				try {
					if (data.ret != "200") {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						var result = data.data;
						if (result.code == 20000) {

							//清空掉缓存：记录登录错误次数
							sessionStorage.removeItem("yiqi_loginError");

							//登录成功，记住帐号
							if (vm.remember == true) {
								localStorage.setItem("yiqi_user", vm.loginName);
							} else {
								localStorage.removeItem("yiqi_user");
							}

							//登录成功，写下cookie缓存，存放当前用户的信息
							$.cookie("yiqi_userInfo", JSON.stringify(result.info));

							//定义全局变量$rootScope.userInfo，用于标题显示当前用户名
							$rootScope.userInfo = result.info;

							//如果是从别的页面跑来登录的，则 router.js 这个文件里  $rootScope.fromState,$rootScope.fromParams是有值的，进行页面跳转
							if (!!$rootScope.fromState.name && $rootScope.fromState.name!='findpassword') {
								$state.go($rootScope.fromState.name, $rootScope.fromParams);
							} else {
								//页面跳转到首页
								$state.go("index");
							}

						} else {
							//登录失败，弹框
							window.showAutoDialog(result.msg);
							vm.loginError++; //登录失败一次加1，大于3次时，会出现图片验证码要求输入
							sessionStorage.setItem("yiqi_loginError", vm.loginError); //写下缓存，记录错误次数
							if (vm.loginError >= 3) {
								vm.showLoginImgCode = true;
							}

						}
					}
				} catch (e) {

				} finally {
					//启用按钮
					vm.loginButtonDisabled = false;
				}
			});
		}

		//
		//
		//
		//
		//
		//----------------------------注册------------------------------------------
		//
		//
		//
		//
		//
		function registerFn() {

			//防止重复点击
			if (!vm.flag.registerFlag) {
				return false;
			}
			
			//同意服务条款
			if (!vm.registerAgree) {
				return false;
			}

			if (vm.conditions == '3') {
				vm.registerName = vm.registerName1; //手机
				if (!vm.isMobile(vm.registerName)) {
					window.showAlertTip("手机格式不正确");
					return false;
				}
			} else {
				vm.registerName = vm.registerName2; //邮箱
				if (!vm.isEmail(vm.registerName)) {
					window.showAlertTip("邮箱格式不正确");
					return false;
				}
			}

			if (!vm.registerCode) {
				window.showAlertTip("请输入手机验证码或邮箱验证码");
				return false;
			}

			if (vm.registerPassword1 != vm.registerPassword2) {
				window.showAlertTip("两次输入的密码不一致");
				return false;
			}

			if (!isPassword(vm.registerPassword1)) {
				window.showAlertTip("密码格式不正确");
				return false;
			}

			if (!vm.registerImgCode) {
				window.showAlertTip("请输入图片验证码");
				return false;
			}

			var registerParams = {
				"conditions": vm.conditions, //个人、主办方
				"username": vm.registerName, //手机号
				"user_pwd": vm.registerPassword1, //密码
				"verify_coder": vm.registerCode, //手机、邮箱验证码
				"is_agree": 1, //同意规则
				"image_coder": vm.registerImgCode //图片验证码
			}

			//2.图片验证码正确，开始注册
			vm.flag.registerFlag = false;
			loginService.register(registerParams)
				.success(function(data) {
					try {
						if (data.ret != 200) {
							window.showAutoDialog(data.msg);
							return false;
						} else {
							if (data.data.code == 20000) {
								window.showAutoDialog(data.data.msg);
								vm.setPanner('loginPanner'); //切换到登录界面
								//清空注册填写的数据
								vm.registerName = ""; //注册：手机、邮箱
								vm.registerCode = ""; //注册：手机、邮箱验证码
								vm.registerPassword1 = ""; //注册：密码1
								vm.registerPassword2 = ""; //注册：密码2
								vm.registerImgCode = ""; //注册：图片验证码
							} else {
								window.showAutoDialog(data.data.msg);
							}
						}
					} catch (e) {

					} finally {
						//启用按钮
						vm.flag.registerFlag = true;
					}
				});
		}
		//
		//
		//
		//
		//
		//----------------------------微信登录------------------------------------------
		//
		//
		//
		//
		//
		function weixinLoginFn() {
			loginService.weixinLogin().success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						window.location.href = data.data.url;
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
		//----------------------------正则判断密码格式------------------------------------------
		//
		//
		//
		//
		//
		function isPassword(param) {
			var text = param.toString().trim();
			if (text.length > 18 || text.length < 6) {
				return false;
			} else {
				var reg = /^([a-zA-Z0-9_!@#%&-]|[\.\*\+]){0,}$/;
				return reg.test(text);
			}
		}

	}
})();