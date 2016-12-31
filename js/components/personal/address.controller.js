/**
 * 作者：林创荣
 * 功能：帐户设置-收货地址
 * 时间：2016年9月19日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/public.service.min.js', 'public.service'); //引入“公共接口”服务
	app.import('/app/Tpl/web/js/service/service_min/address.service.min.js', 'address.service'); //引入“地址”接口 服务

	app.addController("addressController", addressController);
	addressController.$inject = ['$rootScope', 'publicService', 'personalService', '$state', '$timeout', 'addressService'];

	function addressController($rootScope, publicService, personalService, $state, $timeout, addressService) {
		$rootScope.title = "帐户设置-收货地址";
		var vm = this;

		/*****************变量 begin****************/

		vm.edit_dialog_mask = false; //遮罩层
		vm.edit_dialog = false; //编辑地址-弹框
		vm.provinceArray = []; //省份数组
		vm.cityArray1 = []; //城市数组（添加收货地址里的城市数组）
		vm.cityArray2 = []; //城市数组（修改收货地址的弹框里的城市数组）

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

		//编辑收货地址
		vm.editAddressForm = {
			"id": "", //id
			"address": {
				"province": "", //省中文
				"city": "", //市（中文）
				"location": "" //详细地址
			},
			"zip": "", //邮政编码
			"consignee": "", //收货人
			"mobile": "" //手机
		}

		//标识量
		vm.flag = {
			addAddressFlag: true,
			deleteAddressFlag: true,
			editAddressFlag: true,
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getAddressList = getAddressListFn; //获取收货地址列表
		vm.getCityList = getCityListFn; //获取市

		vm.addAddressSubmit = addAddressSubmitFn; //确定添加收货地址

		vm.showDeleteDialog = showDeleteDialogFn; //是否删除收货地址对话框
		vm.deleteAddress = deleteAddressFn; //删除收货地址
		vm.setDefaultAddress = setDefaultAddressFn; //设置默认收货地址

		vm.showEditDialog = showEditDialogFn; //编辑：显示弹框
		vm.editAddressSubmit = editAddressSubmitFn; //编辑：确定
		vm.editDialogCancel = editDialogCancelFn; //编辑：取消

		/*****************函数 end****************/

		(function() {
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
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if(data.data.code == 20000) {
						vm.addressArray = data.data.list;
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
				if(callback) {
					callback();
				}
			}
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
			if(!vm.addAddressForm.address.province || !vm.addAddressForm.address.city) {
				window.showAutoDialog("请先选择省份、城市地区");
				return false;
			}

			//防止重复提交
			if(vm.flag.addAddressFlag == false) {
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
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if(data.data.code == 20000) {
							//添加收货地址成功
							window.showAlertTip(data.data.msg);
							//刷新页面
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
					vm.flag.addAddressFlag = true;

				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------删除收货地址------------------------------------------
		//
		//
		//
		//
		//

		//显示确定删除对话框
		function showDeleteDialogFn(id) {

			vm.selectAddressId = id; //被选择的收货地址id

			var alertDialogObj = {
				alertDialogTitle: "确定删除该收货地址吗？删除之后不可恢复，请谨慎操作！",
				alertDialogConfirm: vm.deleteAddress,
				alertDialogCancel: null, //无值，则使用默认的取消事件
				alertDialogCancelButton: true //显示取消按钮
			}
			$rootScope.$broadcast("public.showAlertDialog", alertDialogObj);
		}

		//删除收货地址
		function deleteAddressFn() {

			//隐藏掉所有弹框
			$rootScope.$broadcast("public.hide", []);

			//防止重复提交
			if(vm.flag.deleteAddressFlag == false) {
				return false;
			}

			var params = {
				"id": vm.selectAddressId, //地址ID
				"username": $rootScope.userInfo.user_name //用户名
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			//按钮不可点击
			vm.flag.deleteAddressFlag = false;
			personalService.deleteAddress(params).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if(data.data.code == 20000) {
							window.showAlertTip(data.data.msg);
							//刷新页面
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
					vm.flag.deleteAddressFlag = true;
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------设置默认收货地址------------------------------------------
		//
		//
		//
		//
		//
		function setDefaultAddressFn(id) {
			var params = {
				"id": id,
				"username": $rootScope.userInfo.user_name
			}

			personalService.setDefaultAddress(params).success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if(data.data.code == 20000) {
						window.showAlertTip(data.data.msg);
						//刷新页面
						$state.reload();
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
		//----------------------------编辑收货地址------------------------------------------
		//
		//
		//
		//
		//
		//显示弹框
		function showEditDialogFn(item) {

			vm.edit_dialog_mask = true;
			vm.edit_dialog = true;

			//首先获取到市列表，然后才将该地址的多项数组回显；如果顺序反了，会导致bug---该地址本来有城市值，结果弹框里不会显示城市值；
			vm.getCityList(item.province, 'cityArray2', function() {

				//被编辑的收货地址
				vm.editAddressForm = {
					"id": item.id, //id
					"address": {
						"province": item.province, //省中文
						"city": item.city, //市（中文）
						"location": item.address //详细地址
					},
					"zip": item.zip, //邮政编码
					"consignee": item.consignee, //收货人
					"mobile": item.mobile //手机
				}
			});
		}

		//确定修改
		function editAddressSubmitFn() {

			if(!vm.editAddressForm.address.province || !vm.editAddressForm.address.city) {
				window.showAlertTip("请先选择省份、城市地区");
				return false;
			}

			//防止重复提交
			if(vm.flag.editAddressFlag == false) {
				return false;
			}

			var params = {
				"id": vm.editAddressForm.id, //地址ID
				"username": $rootScope.userInfo.user_name, //用户名
				"address": JSON.stringify(vm.editAddressForm.address), //地址
				"zip": vm.editAddressForm.zip, //邮政编码
				"consignee": vm.editAddressForm.consignee, //收货人
				"mobile": vm.editAddressForm.mobile //手机
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			//按钮不可点击
			vm.flag.editAddressFlag = false;
			personalService.editAddress(params).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if(data.data.code == 20000) {
							window.showAlertTip(data.data.msg);
							//刷新页面
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
					vm.flag.editAddressFlag = true;
				}
			});
		}

		//取消
		function editDialogCancelFn() {
			vm.edit_dialog_mask = false;
			vm.edit_dialog = false;
		}
	}
})();