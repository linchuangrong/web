/**
 * 作者：林创荣
 * 功能：众筹下单
 * 时间：2016年11月25日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/crowdFund.service.js', 'crowdFund.service'); //引入“众筹”接口 服务
	app.import('/app/Tpl/web/js/service/address.service.js', 'address.service'); //引入“地址”接口 服务
	app.import('/app/Tpl/web/js/service/personal.service.js', 'personal.service'); //引入“个人中心”接口服务--收货地址列表

	app.addController("crowdFundOrderController", crowdFundOrderController);
	crowdFundOrderController.$inject = ['$rootScope', '$window', '$timeout', '$stateParams', '$state', 'crowdFundService', 'addressService', 'personalService'];

	function crowdFundOrderController($rootScope, $window, $timeout, $stateParams, $state, crowdFundService, addressService, personalService) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "众筹下单";
		var vm = this;
		//vm.submitForm.shopNum = 1; //商品数量，因为要用到$watch监听，所以引入$scope

		//未登录，让其先登录
		if (!$rootScope.userInfo.id) {
			$state.go("login");
			return false;
		}

		//参数错误
		if (!$stateParams.deal_id || !$stateParams.user_id || !$stateParams.item_id) {
			window.showAutoDialog("访问出错");
			$state.go("crowdFundList");
			return false;
		} else if ($stateParams.user_id != $rootScope.userInfo.id) {
			window.showAutoDialog("访问出错");
			$state.go("crowdFundList");
			return false;
		}

		/*****************变量 begin****************/

		vm.edit_dialog_mask = false; //遮罩层
		vm.edit_dialog = false; //编辑地址-弹框

		vm.orderInfo = {};
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

		//标识量
		vm.flag = {
			addAddressFlag: true,
			creatOrderSubmitFlag: true,
		}

		vm.submitForm = {
			deal_id: $stateParams.deal_id, //项目ID
			user_id: $stateParams.user_id, //用户ID
			item_id: $stateParams.item_id, //回报ID，无则传0
			price: $stateParams.price, //无回报，则传参
			shopNum: "1", //商品数量
			is_invoice: 0, //是否需要发票
			invoice_title: "", //发票抬头
			address_id: "", //地址ID
		}

		vm.agree = true;

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getCreateOrder = getCreateOrderFn; //进入创建订单页面，获取基本数据
		vm.getAddressList = getAddressListFn; //获取收货地址列表

		vm.getCityList = getCityListFn; //获取城市数组

		vm.addShopNum = addShopNumFn; //数量增加1
		vm.decreaseShopNum = decreaseShopNumFn; //数量减少1
		vm.setShopNum = setShopNumFn; //手机输入数量

		vm.showEditDialog = showEditDialogFn; //显示编辑地址弹框
		vm.editDialogCancel = editDialogCancelFn; //取消编辑
		vm.addAddressSubmit = addAddressSubmitFn; //确定添加收货地址

		vm.creatOrderSubmit = creatOrderSubmitFn; //创建订单

		/*****************函数 end****************/

		(function init() {
			vm.getCreateOrder(); //进入创建订单页面，获取基本数据
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
		//----------------------------进入创建订单页面，获取基本数据------------------------------------------
		//
		//
		//
		//
		//
		function getCreateOrderFn() {
			var params = {
				"deal_id": $stateParams.deal_id,
				"user_id": $stateParams.user_id,
				"item_id": $stateParams.item_id,
				"price": $stateParams.price
			}
			crowdFundService.getCreateOrder(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.orderInfo = data.data.item;
					} else {
						window.showAutoDialog(data.data.msg);
						//返回到上一页
						$state.go($rootScope.fromState, $rootScope.fromParams);
					}
				}
			});
		}
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
		//----------------------------数量增加1------------------------------------------
		//
		//
		//
		//
		//
		function addShopNumFn() {
			vm.submitForm.shopNum++;
		}
		//
		//
		//
		//
		//
		//----------------------------数量减少1------------------------------------------
		//
		//
		//
		//
		//
		function decreaseShopNumFn() {
			vm.submitForm.shopNum--;
			if (vm.submitForm.shopNum <= 0) {
				vm.submitForm.shopNum = 1;
			}
		}
		//
		//
		//
		//
		//
		//----------------------------手动输入数量------------------------------------------
		//
		//
		//
		//
		//
		function setShopNumFn() {
			vm.submitForm.shopNum = parseInt(vm.submitForm.shopNum);
			if (vm.submitForm.shopNum <= 0) {
				vm.submitForm.shopNum = 1;
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
							//刷新页面
							$state.reload();
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

				}
			});
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
		//----------------------------创建订单------------------------------------------
		//
		//
		//
		//
		//
		function creatOrderSubmitFn() {

			//防止重复提交
			if (vm.flag.creatOrderSubmitFlag == false) {
				return false;
			}

			if (!vm.agree) {
				return false;
			}

			vm.submitForm.shopNum = parseInt(vm.submitForm.shopNum); //安全起见，转一下整数
			if (!(vm.submitForm.shopNum >= 1)) {
				vm.submitForm.shopNum = 1;
			}

			if (vm.submitForm.is_invoice == '1') {
				if (!vm.submitForm.invoice_title) {
					window.showAlertTip("请填写发票抬头");
					return false;
				}
			}

			if (!vm.submitForm.address_id) {
				window.showAlertTip("请选择地址");
				return false;
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.creatOrderSubmitFlag = false;
			//接口请求
			crowdFundService.creatOrderSubmit(vm.submitForm).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//成功
							$state.go("payMoney", {
								"id": data.data.list.requestNo,
								"price": data.data.list.deal_price,
								"num": data.data.list.num,
								"Project_type": '0', //项目类型：0活动众筹，1评审评估
								"url": "personal.joinCrowdFund"
							});
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					//按钮可点击
					vm.flag.creatOrderSubmitFlag = true;

				}
			});
		}
	}
})();