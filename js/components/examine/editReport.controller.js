/**
 * 作者：林创荣
 * 功能：编辑报告
 * 时间：2016年12月23日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/contenteditable.directive.js', 'contenteditable.directive'); //富文本编辑器，要求先引入wangEditor.min.js
	app.import('/app/Tpl/web/js/service/examine.service.js', 'examine.service'); //引入“评审评估”接口 服务
	app.import('/app/Tpl/web/js/service/address.service.js', 'address.service'); //引入“地址”接口 服务
	app.import('/app/Tpl/web/js/service/personal.service.js', 'personal.service'); //引入“个人中心”接口服务--收货地址列表

	app.addController("editReportController", editReportController);
	editReportController.$inject = ['$rootScope', '$window', 'examineService', '$state', '$stateParams', 'addressService', 'personalService'];

	function editReportController($rootScope, $window, examineService, $state, $stateParams, addressService, personalService) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "编辑报告";
		var vm = this;

		/*****************变量 begin****************/

		vm.report_type = $stateParams.report_type; // 0=>电子报告 , 1=>纸质报告

		vm.edit_dialog_mask = false; //遮罩层
		vm.edit_dialog = false; //编辑地址-弹框

		vm.addressArray = []; //收货地址数组

		vm.provinceArray = []; //省份数组
		vm.cityArray = []; //城市数组（添加收货地址里的城市数组）

		//添加收货地址表单
		vm.addAddressForm = {
			address: {
				province: "", //省中文
				city: "", //市（中文）
				location: "" //详细地址
			},
			zip: "", //邮政编码
			consignee: "", //收货人
			mobile: "" //手机
		}

		//提交的表单
		vm.submitForm = {
			report_content: "",
			address_id: "", //地址ID
		}

		//标识量
		vm.flag = {
			"addAddressFlag": true,
			"submitReportFlag": true,
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getAddressList = getAddressListFn; //获取收货地址列表

		vm.getCityList = getCityListFn; //获取城市数组

		vm.showEditDialog = showEditDialogFn; //显示编辑地址弹框
		vm.editDialogCancel = editDialogCancelFn; //取消编辑
		vm.addAddressSubmit = addAddressSubmitFn; //确定添加收货地址

		vm.submitReport = submitReportFn; //提交

		/*****************函数 end****************/

		(function init() {
			//未登录，让其先登录
			if (!$rootScope.userInfo.id) {
				$state.go("login");
				return false;
			}

			vm.getAddressList(); //获取收货地址列表

			//获取省份列表
			addressService.getProvinceList(function(provinceArray) {
				vm.provinceArray = provinceArray;
			});

		})();

		//
		//
		//
		//
		//
		//----------------------------获取收货地址列表------------------------------------------
		//
		//
		//
		//
		//
		function getAddressListFn() {
			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name
			}
			personalService.getUserAddressList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if (data.data.code == 20000) {
						vm.addressArray = data.data.list;
						for (var i = 0; i < vm.addressArray.length; i++) {
							if (vm.addressArray[i].is_default == '1') {
								vm.submitForm.address_id = vm.addressArray[i].id;
								break;
							}
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
		//----------------------------省市联动接口数据------------------------------------------
		//
		//
		//
		//
		//
		//获取省中文名称，获取市
		function getCityListFn(province, myCityArray, callback) {

			//获取城市
			addressService.getCityList(vm.provinceArray, province, firstCallBack, lastCallBack);

			//因为修改了省份，所以需要把市给删除掉
			function firstCallBack() {
				vm.addAddressForm.address.city = "";
			}

			//为城市数组赋值
			function lastCallBack(newCityArray) {
				vm[myCityArray] = newCityArray;
				//回调函数，常用于获取到市列表之后 ，才可以执行的操作
				if (callback) {
					callback();
				}
			}
		}

		//
		//
		//
		//
		//
		//----------------------------重新编辑地址------------------------------------------
		//
		//
		//
		//
		//
		function showEditDialogFn(params) {
			vm.edit_dialog_mask = true;
			vm.edit_dialog = true;
		}

		function editDialogCancelFn() {
			vm.edit_dialog_mask = false;
			vm.edit_dialog = false;
		}
		//
		//
		//
		//
		//
		//----------------------------确定添加收货地址------------------------------------------
		//
		//
		//
		//
		//
		function addAddressSubmitFn() {

			//检查省份、城市 有没有选择
			if (!vm.addAddressForm.address.province || !vm.addAddressForm.address.city) {
				window.showAutoDialog("请先选择省份、城市地区");
				return false;
			}

			//防止重复提交
			if (vm.flag.addAddressFlag == false) {
				return false;
			}

			var params = {
				"id": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name,
				"address": JSON.stringify(vm.addAddressForm.address),
				"zip": vm.addAddressForm.zip.toString(), //邮政编码
				"consignee": vm.addAddressForm.consignee, //收货人
				"mobile": vm.addAddressForm.mobile //手机
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.addAddressFlag = false;
			//接口请求
			personalService.addAddress(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//添加收货地址成功
							window.showAlertTip(data.data.msg);
							/*//刷新页面
							$state.reload();*/
							//重新获取收货地址列表，不能采用刷新界面
							vm.getAddressList();
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.addAddressFlag = true;
					//隐藏弹框
					vm.editDialogCancel();
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
		function submitReportFn() {

			if (!vm.flag.submitReportFlag) {
				return false;
			}

			//纸质报告，需要有收货地址
			if ($stateParams.report_type == '1') {
				if (!vm.submitForm.address_id) {
					window.showAutoDialog("请选择收货地址");
					return false;
				}
			} else {
				vm.submitForm.address_id = "";
			}

			//内容太少
			if (vm.submitForm.report_content.trim().length <= 30) {
				window.showAutoDialog("请输入至少30个字符的报告内容");
				return false;
			}

			var params = {
				"user_id": $rootScope.userInfo.id, //用户id
				"type": $stateParams.report_type, //类型：0=>电子报告,1=>纸质报告
				"review_sn": $stateParams.review_sn, //表单编号
				"report_content": vm.submitForm.report_content, //富文本内容
				"address_id": vm.submitForm.address_id //地址ID
			}

			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.editReportFlag = true;
			examineService.editReport(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//保存成功
							if ($stateParams.report_type == '1') {
								//纸质报告的弹框
								window.showAutoDialog("<p class='text-align-center'><strong>" + data.data.msg + "</strong></p>" + "<br>报告将于15个工作日内以一式三份的形式寄出！<br>紧急联系电话：13631872723 易小姐");
							} else {
								//电子报告的弹框
								window.showAutoDialog(data.data.msg);
							}
							$state.go("personal.myEstimate");
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.editReportFlag = true;

				}
			});

		}

	}
})();