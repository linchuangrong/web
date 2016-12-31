/**
 * 作者：林创荣
 * 功能：个人中心
 * 		
 * 		在router.js里，有一个resolve,提前发起http请求，获取了用户的信息yiqi_userInfo
 * 		页面加载成功，会提前在resolve里获取用户信息赋值给$rootScope.userInfo
 * 		$rootScope.userInfo:用户的所有个人数据信息
 * 时间：2016年9月18日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/personal.service.min.js', 'personal.service'); //引入“个人中心”接口 服务

	app.addController("personalController", personalController);
	personalController.$inject = ['$rootScope', 'personalService', '$state'];

	function personalController($rootScope, personalService, $state) {
		$rootScope.title = "个人中心";
		var vm = this;

		/*****************变量 begin****************/

		vm.gradeText = "低"; //安全级别

		vm.showBindPhonePanel = false;

		vm.bindPhoneForm = {
			"user_id": $rootScope.userInfo.id, //用户id
			"mobile": "", //手机号
			"password": "", //密码
			"verify_coder": "" //验证码
		}

		vm.flag = {
			bindPhoneFlag: true,
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getGrade = getGradeFn; //安全级别

		vm.bindPhoneSubmit = bindPhoneSubmitFn; //微信登录后，绑定手机

		/*****************变量 end****************/

		(function init() {
			vm.getGrade();

			//以下if成立 ，说明用户是微信第一次扫码进来的，需要弹出框让用户绑定手机、密码
			if($rootScope.userInfo.identity_conditions == '3' && !$rootScope.userInfo.mobile) {
				vm.showBindPhonePanel = true;
			}
		})();

		//
		//
		//
		//
		//
		//---------------------------------安全级别-------------------------------------
		//
		//
		//
		//
		//
		function getGradeFn() {
			//肯定有登录密码的
			var grade = 20;
			//手机
			if($rootScope.userInfo.mobile) {
				grade += 20;
			}
			//邮箱
			if($rootScope.userInfo.email) {
				grade += 20;
			}
			//支付密码
			if($rootScope.userInfo.paypassword) {
				grade += 20;
			}
			//实名认证或企业认证
			if($rootScope.userInfo.identify_status == 2 || $rootScope.userInfo.is_investor == 2) {
				grade += 20;
			}
			//设置显示的等级文字
			if(grade <= 40) {
				vm.gradeText = "低";
			} else if(grade == 60) {
				vm.gradeText = "中";
			} else if(grade > 60) {
				vm.gradeText = "高";
			}
			return grade;
		}
		//
		//
		//
		//
		//
		//---------------------------------微信登录后，绑定手机-------------------------------------
		//
		//
		//
		//
		//
		function bindPhoneSubmitFn() {

			//防止重复点击
			if(!vm.flag.bindPhoneFlag) {
				return false;
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			//设置为false
			vm.flag.bindPhoneFlag = false;
			//接口请求
			personalService.wxBindPhone(vm.bindPhoneForm).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if(data.data.code == 20000) {
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
					//按钮可点击
					vm.flag.bindPhoneFlag = true;
				}
			});

		}

	}
})();