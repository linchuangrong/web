/**
 * 作者：林创荣
 * 功能：帐户设置-资料设置
 * 		$rootScope.userInfo  可能会在这个页面被修改
 * 时间：2016年9月18日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/imgUpload.directive.js', 'imgUpload.directive'); //图片上传插件

	app.addController("dataSetController", dataSetController);
	dataSetController.$inject = ['$rootScope', 'personalService', '$filter', '$state'];

	function dataSetController($rootScope, personalService, $filter, $state) {
		$rootScope.title = "帐户设置-资料设置";
		var vm = this;

		//阻止普通用户进入此页面
		if($rootScope.userInfo.identity_conditions == 0) {
			$state.go("personal.sponsor");
			return false;
		}

		/*****************变量 begin****************/
		vm.submitForm = angular.extend({}, $rootScope.userInfo); //复制一份用户信息

		vm.birthday = $filter("toDate")(vm.submitForm.birthday); //因为这个需要做转义，所以单独拿出来处理，不直接使用submitForm里的birthday

		/*****************变量 end****************/

		/*****************函数 begin****************/
		
		vm.setBirthday = setBirthdayFn; //设置生日
		vm.submit = submitFn; //提交

		/*****************函数 end****************/
		
		//
		//
		//
		//
		//
		//----------------------------日期时间控件------------------------------------------
		//
		//
		//
		//
		//
		function setBirthdayFn() {
			laydate({
				elem: '#birthday',
				istime: false, //取消时，分，秒
				format: 'YYYY-MM-DD',
				max: laydate.now(), //最大日期是今天
				isclear: false, //隐藏清空按钮
				istoday: false, //隐藏掉今天按钮
				choose: function(dates) {
					$rootScope.$apply(function() {
						vm.birthday = dates;
					});
				}
			});
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
			if(!vm.submitForm.nickname) {
				window.showAlertTip("请输入昵称");
				return false;
			}
			if(!vm.submitForm.sex) {
				window.showAlertTip("请选择性别");
				return false;
			}
			if(!vm.birthday) {
				window.showAlertTip("请选择生日");
				return false;
			}
			var params = {
				"username": vm.submitForm.user_name,
				"id": vm.submitForm.id,
				"nickname": vm.submitForm.nickname,
				"sex": vm.submitForm.sex,
				"head_image": vm.submitForm.head_image,
				"birthday": $filter("toTimeStamp")(vm.birthday)
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			personalService.updateUserInfo(params).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if(data.data.code = 20000) {
							window.showAutoDialog(data.data.msg);
							//刷新页面
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