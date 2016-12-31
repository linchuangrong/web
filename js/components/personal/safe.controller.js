/**
 * 作者：林创荣
 * 功能：安全中心
 * 时间：2016年9月19日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/imgUpload.directive.js', 'imgUpload.directive'); //图片上传插件

	app.addController("safeController", safeController);
	safeController.$inject = ['$rootScope', '$timeout', 'personalService', '$state'];

	function safeController($rootScope, $timeout, personalService, $state) {
		$rootScope.title = "安全中心";
		var vm = this;

		/*****************变量 begin****************/
		vm.safe_mask_div = false; //遮罩层
		vm.set_phone = false; //绑定手机
		vm.set_password = false; //登录密码
		vm.set_email = false; //绑定邮箱
		vm.set_pay_password = false; //支付密码
		vm.set_idCard = false; //实名认证
		vm.set_company = false; //企业认证
		vm.dialogArray = ['safe_mask_div', 'set_password', 'set_phone', 'set_email', 'set_pay_password', 'set_idCard', 'set_company'];
		vm.mobileDialogTitle = "绑定手机";
		vm.emailDialogTitle = "绑定邮箱";

		vm.setMobileForm = {
			"mobile": "", //手机号
			"verify_coder": "" //验证码
		};

		vm.setEmailForm = {
			"email": "", //手机号
			"verify_coder": "" //验证码
		};

		vm.setPayPasswordForm = {
			payPassword1: "", //支付密码1
			pasPassword2: "", //支付密码2
			mobile: "", //手机号
			verify_coder: "" //验证码
		}

		vm.setIdCardForm = {
			real_name: "", //真实姓名
			id_number: "", //身份证号
			mobile: "", //手机号
			id_frontimg: "", //身份证正面
			id_backimg: "", //身份证反面
			verify_coder: "" //验证码
		};

		vm.setCompanyForm = {
			"bs_name": "", //单位名称
			"bs_licence": "", //营业执照号
			"licence_img": "", //组织机构照片
			"cat_id": "", //行业，这里虽然是写着id，但是传给后台是中文汉字
			"bs_address": "", //执照地址
			"bs_user": "", //企业法人
			"verify_coder": "" //验证码
		}

		//标识变量，用于防止重复提交，true表示可以点击
		vm.flag = {
			passwordFlag: true,
			phoneFlag: true,
			emailFlag: true,
			payPasswordFlag: true,
			idCardFlag: true,
			companyFlag: true
		};

		vm.companyInfo = {}; //企业认证的数据，可能为空
		vm.idCardInfo = {}; //实名认证的数据，可能为空

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getGrade = getGradeFn; //安全等级
		vm.drawCircle = drawCircleFn; //环形进度条

		vm.showDialog = showDialogFn; //打开弹框
		vm.closeDialog = closeDialogFn; //关闭弹框
		vm.closeAllDialog = closeAllDialogFn; //关闭所有弹框
		vm.phoneConfirm = phoneConfirmFn; //事件:绑定手机确定
		vm.passwordConfirm = passwordConfirmFn; //修改登录密码
		vm.emailConfirm = emailConfirmFn; //事件:绑定邮箱确定
		vm.payPasswordConfirm = payPasswordConfirmFn; //事件:设置支付密码确定
		vm.idCardConfirm = idCardConfirmFn; //事件:实名认证确定
		vm.companyConfirm = companyConfirmFn; //事件：确定企业认证

		/*****************函数 end****************/

		//
		//
		//
		//
		//
		//-----------------------------环形进度条-----------------------------------------
		//
		//
		//
		//
		//
		vm.drawCircle("canvas_1", "canvas_2", vm.getGrade());
		/**
		 * 画圆环形
		 *  id1 底部灰色圆形的id
		 *  id2 上方彩色圆形的id
		 *  percent  进度百分比
		 */
		function drawCircleFn(id1, id2, percent) {
			var canvas_1 = document.querySelector('#' + id1);
			var canvas_2 = document.querySelector('#' + id2);
			var ctx_1 = canvas_1.getContext('2d');
			var ctx_2 = canvas_2.getContext('2d');
			ctx_1.lineWidth = 10;
			ctx_1.strokeStyle = "#ccc";
			//画底部的灰色圆环
			ctx_1.beginPath();
			ctx_1.arc(canvas_1.width / 2, canvas_1.height / 2, canvas_1.width / 2 - ctx_1.lineWidth / 2, 0, Math.PI * 2, false);
			ctx_1.closePath();
			ctx_1.stroke();
			if (percent < 0 || percent > 100) {
				throw new Error('percent must be between 0 and 100');
				return
			}
			ctx_2.lineWidth = 10;

			var angle = 0;
			var timer;
			(function draw() {
				//设置时间，10毫秒叠加
				timer = setTimeout(draw, 10);
				//timer = requestAnimationFrame(draw);
				ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
				//百分比圆环
				ctx_2.beginPath();
				//圆环的颜色,如果超过50%，则显示绿色。否则显示橙色
				if (parseInt((angle / 360) * 100) > 50) {
					ctx_2.strokeStyle = "#5cb85c"; //绿色
				} else {
					ctx_2.strokeStyle = "#f60"; //橙色
				}
				ctx_2.arc(canvas_2.width / 2, canvas_2.height / 2, canvas_2.width / 2 - ctx_2.lineWidth / 2, 0, angle * Math.PI / 180, false);

				//叠加数量+4
				angle += 4;

				//但是如果叠加的最终数值，超过了参数，则改为参数值，并结束循环叠加
				var percentAge = parseInt((angle / 360) * 100);
				if (angle > (percent / 100 * 360)) {
					percentAge = percent;
					clearTimeout(timer);
					//window.cancelAnimationFrame(timer);
				};
				ctx_2.stroke();
				ctx_2.closePath();
				ctx_2.save();
				ctx_2.beginPath();
				ctx_2.rotate(90 * Math.PI / 180)
				ctx_2.font = '48px Arial';
				if (percentAge > 50) {
					ctx_2.fillStyle = "#5cb85c"; //绿色
				} else {
					ctx_2.fillStyle = "#f60"; //橙色
				}
				var text = percentAge + '%';
				if (percentAge < 10) {
					ctx_2.fillText(text, 75, -90);
				} else if (percentAge < 100) {
					ctx_2.fillText(text, 70, -90);
				} else {
					ctx_2.fillText(text, 55, -90);
				}
				ctx_2.closePath();
				ctx_2.restore();
			})();
		}

		//
		//
		//
		//
		//
		//---------------------------------获取实名认证、企业认证的数据-------------------------------------
		//
		//
		//
		//
		//
		(function() {
			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name
			}
			personalService.getUserRealCenter(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if (data.data.code == 20000) {
						vm.companyInfo = data.data.company;
						vm.idCardInfo = data.data.personal;
					} else {
						window.showAutoDialog(data.data.msg);
					}
				}
			});
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
			if ($rootScope.userInfo.mobile) {
				grade += 20;
			}
			//邮箱
			if ($rootScope.userInfo.email) {
				grade += 20;
			}
			//支付密码
			if ($rootScope.userInfo.paypassword) {
				grade += 20;
			}
			//实名认证或企业认证
			if ($rootScope.userInfo.identify_status == 2 || $rootScope.userInfo.is_investor == 2) {
				grade += 20;
			}
			return grade;
		}
		//
		//
		//
		//
		//
		//---------------------------------弹框-------------------------------------
		//
		//
		//
		//
		//
		function showDialogFn(param) {
			//支付密码的弹框，需要验证是否已经绑定手机
			if (param == "set_pay_password") {
				if (!$rootScope.userInfo.mobile) {
					window.showAutoDialog("请先绑定手机");
					return false;
				}
			}

			vm.safe_mask_div = true;
			vm[param] = true;

		}

		function closeDialogFn(param) {
			vm[param] = false;
		}

		function closeAllDialogFn() {
			for (var i = 0; i < vm.dialogArray.length; i++) {
				vm[vm.dialogArray[i]] = false;
			}
		}

		//
		//
		//
		//
		//
		//---------------------------------修改登录密码-------------------------------------
		//
		//
		//
		//
		//
		function passwordConfirmFn() {

			//防止重复
			if (vm.flag.passwordFlag == false) {
				return false;
			}

			//校验两个密码是否相同
			if (vm.newLoginPassword1 != vm.newLoginPassword2) {
				window.showAlertTip("两次密码不一致");
				return false;
			}

			var params = {
				id: $rootScope.userInfo.id,
				username: $rootScope.userInfo.user_name,
				user_pwd: vm.newLoginPassword1,
				old_pwd: vm.oldLoginPassword
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.passwordFlag = false;
			//接口请求
			personalService.updatePassword(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAlertTip(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//修改成功
							window.showAlertTip(data.data.msg);
							//vm.oldLoginPassword = "";
							//vm.newLoginPassword1 = "";
							//vm.newLoginPassword2 = "";
							//关闭弹框
							//vm.closeDialog("set_password");
							//vm.closeDialog("safe_mask_div");
							//刷新页面
							$state.reload();
						} else {
							window.showAlertTip(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.passwordFlag = true;
				}
			});
		}
		//
		//
		//
		//
		//
		//---------------------------------修改手机-------------------------------------
		//
		//
		//
		//
		//
		function phoneConfirmFn() {

			//防止重复
			if (vm.flag.phoneFlag == false) {
				return false;
			}

			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name,
				"mobile": vm.setMobileForm.mobile,
				"verify_coder": vm.setMobileForm.verify_coder,
				"by": vm.mobileDialogTitle == "绑定手机" ? 1 : 0
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.phoneFlag = false;
			//接口请求
			personalService.updateMobile(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAlertTip(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//修改成功
							window.showAlertTip(data.data.msg);
							//关闭弹框
							//vm.closeDialog("set_phone");
							//vm.closeDialog("safe_mask_div");
							//刷新页面
							$state.reload();
						} else {
							window.showAlertTip(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.phoneFlag = true;
				}
			});
		}
		//
		//
		//
		//
		//
		//---------------------------------修改邮箱-------------------------------------
		//
		//
		//
		//
		//
		function emailConfirmFn() {

			//防止重复
			if (vm.flag.emailFlag == false) {
				return false;
			}

			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name,
				"email": vm.setEmailForm.email,
				"verify_coder": vm.setEmailForm.verify_coder,
				"by": vm.emailDialogTitle == "绑定邮箱" ? 1 : 0
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.emailFlag = false;
			//接口请求
			personalService.updateEmail(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAlertTip(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//修改成功
							window.showAlertTip(data.data.msg);
							//关闭弹框
							//vm.closeDialog('set_email');
							//vm.closeDialog("safe_mask_div");
							//刷新页面
							$state.reload();
						} else {
							window.showAlertTip(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.emailFlag = true;
				}
			});
		}
		//
		//
		//
		//
		//
		//---------------------------------修改支付密码-------------------------------------
		//
		//
		//
		//
		//
		function payPasswordConfirmFn() {

			//防止重复
			if (vm.flag.payPasswordFlag == false) {
				return false;
			}

			//校验两个密码是否相同
			if (vm.setPayPasswordForm.payPassword1 != vm.setPayPasswordForm.payPassword2) {
				return false;
			}

			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name,
				"paypwd": vm.setPayPasswordForm.payPassword1,
				"mobile": vm.setPayPasswordForm.mobile,
				"verify_coder": vm.setPayPasswordForm.verify_coder,
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.payPasswordFlag = false;
			//接口请求
			personalService.updatePayPassword(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAlertTip(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//修改成功
							window.showAlertTip(data.data.msg);
							//关闭弹框
							//vm.closeDialog('set_pay_password');
							//vm.closeDialog("safe_mask_div");
							//清空数据
							//vm.setPayPasswordForm.payPassword1 = "";
							//vm.setPayPasswordForm.payPassword2 = "";
							//vm.setPayPasswordForm.mobile = "";
							//vm.setPayPasswordForm.verify_coder = "";
							//刷新页面
							$state.reload();
						} else {
							window.showAlertTip(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.payPasswordFlag = true;
				}
			});
		}
		//
		//
		//
		//
		//
		//---------------------------------实名认证-------------------------------------
		//
		//
		//
		//
		//
		function idCardConfirmFn() {

			//防止重复
			if (vm.flag.idCardFlag == false) {
				return false;
			}

			//身份证正面
			if (!vm.setIdCardForm.id_frontimg) {
				window.showAlertTip("请上传身份证正面照");
				return false;
			}

			//身份证反面
			if (!vm.setIdCardForm.id_backimg) {
				window.showAlertTip("请上传身份证反面照");
				return false;
			}

			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name,
				"real_name": vm.setIdCardForm.real_name,
				"id_number": vm.setIdCardForm.id_number,
				"mobile": vm.setIdCardForm.mobile,
				"id_frontimg": vm.setIdCardForm.id_frontimg, //身份证正面
				"id_backimg": vm.setIdCardForm.id_backimg, //身份证反面
				"verify_coder": vm.setIdCardForm.verify_coder,
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.idCardFlag = false;
			//接口请求
			personalService.setIdCard(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAlertTip(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//修改成功
							window.showAlertTip(data.data.msg);
							//关闭弹框
							//vm.closeDialog('set_idCard');
							//vm.closeDialog("safe_mask_div");
							//清空数据
							//vm.setIdCardForm.real_name = "";
							//vm.setIdCardForm.id_number = "";
							//vm.setIdCardForm.mobile = "";
							//vm.setIdCardForm.verify_coder = "";
							//刷新页面
							$state.reload();
						} else {
							window.showAlertTip(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.idCardFlag = true;
				}
			});
		}
		//
		//
		//
		//
		//
		//---------------------------------企业认证-------------------------------------
		//
		//
		//
		//
		//
		function companyConfirmFn() {
			//防止重复
			if (vm.flag.companyFlag == false) {
				return false;
			}

			//营业执照照片，组织机构照片
			if (!vm.setCompanyForm.licence_img) {
				window.showAlertTip("请上传组织机构代码证（营业执照）");
				return false;
			}
			
			//行业
			if(!vm.setCompanyForm.cat_id){
				window.showAlertTip("请选择行业");
				return false;
			}

			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name,
				"bs_name": vm.setCompanyForm.bs_name, //单位名称
				"bs_licence": vm.setCompanyForm.bs_licence, //营业执照号
				"licence_img": vm.setCompanyForm.licence_img, //组织机构照片
				"cat_id": vm.setCompanyForm.cat_id, //行业
				"bs_address": vm.setCompanyForm.bs_address, //执照地址
				"bs_user": vm.setCompanyForm.bs_user, //企业法人
				"verify_coder": vm.setCompanyForm.verify_coder, //验证码
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.companyFlag = false;
			//接口请求
			personalService.setCompany(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAlertTip(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//修改成功
							window.showAlertTip(data.data.msg);
							//关闭弹框
							//vm.closeDialog('set_company');
							//vm.closeDialog("safe_mask_div");
							//刷新页面
							$state.reload();
						} else {
							window.showAlertTip(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.companyFlag = true;
				}
			});

		}

	}
})();