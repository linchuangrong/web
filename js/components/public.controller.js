/**
 * 作者：林创荣
 * 功能：定义全局变量
 * 		 导航条模块
 * 		$rootScope.userInfo  这里的userInfo的值只有user_name,id,nickname,identify_bs_name,identity_conditions
 * 时间：2016年9月12日.
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/countDown.directive.js', 'countDown.directive'); //倒计时插件
	app.import('/app/Tpl/web/js/directive/repeatDone.directive.js', 'repeatDone.directive'); //循环结束事件
	app.import('/app/Tpl/web/js/service/service_min/public.service.min.js', 'public.service'); //引入“公共接口”服务
	app.import('/app/Tpl/web/js/service/service_min/address.service.min.js', 'address.service'); //引入“地址”服务

	app.controller("publicController", publicController);
	publicController.$inject = ['$timeout', 'appConfig', '$scope', '$rootScope', '$state', 'publicService', 'addressService', '$http'];

	function publicController($timeout, appConfig, $scope, $rootScope, $state, publicService, addressService, $http) {
		var vm = this;
		vm.baseUrl = appConfig.baseUrl; //全局变量
		vm.imgUrl = appConfig.baseUrl + "img"; //全局变量

		/*****************变量 begin****************/

		//用户信息
		$rootScope.userInfo = {
			"user_name": "",
			"id": "",
			"nickname": "",
			"identify_bs_name": "",
			"identity_conditions": ""
		};
		//如果是登录用户刷新界面
		if ($.cookie("yiqi_userInfo") && $.cookie("yiqi_userInfo").toString() != "null") {
			$rootScope.userInfo = JSON.parse($.cookie("yiqi_userInfo").toString()); //全局变量：获取当前登录用户的数据信息,但这里只有几个字段；进入个人中心后，userInfo会增加几十个字段
		}

		vm.domArray = ["mask_div", "auto_dialog", "alert_dialog", "loading_panel"]; //数组：存储所有弹框层的id

		//弹框、遮罩、loading动画，默认隐藏
		vm.mask_div = false; //遮罩层
		vm.auto_dialog = false; //普通弹框
		vm.alert_dialog = false; //复杂弹框
		vm.loading_panel = false; //loading动画
		vm.alert_tip = false; //弹出提示文字

		vm.alert_text = "操作完成";

		vm.provinceArray = []; //省数组
		vm.cityArray = []; //城市数组
		vm.selectProvince = ""; //选中的省

		vm.showSearch = false; //默认不显示
		vm.searchType = "活动"; //默认值

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.userExit = userExitFn; //退出登录

		vm.triggerClick = triggerClickFn; //点击A，触发B的点击事件

		//1.普通按钮
		vm.showAutoDialog = showAutoDialogFn; //只有确定按钮的弹框
		vm.autoDialogConfirm = autoDialogConfirmFn; //确定事件
		window.showAutoDialog = vm.showAutoDialog;

		//2.复杂按钮，有确定、删除功能
		vm.showAlertDialog = showAlertDialogFn; //有确定、删除按钮的弹框
		vm.alertDialogConfirm = alertDialogConfirmFn; //确定删除
		vm.alertDialogCancel = alertDialogCancelFn; //取消删除

		//3.alertTip弹出文字提示
		vm.alert_tip_timeout = null;
		vm.showAlertTip = showAlertTipFn;
		window.showAlertTip = vm.showAlertTip;

		//隐藏所有弹框，不太建议使用
		vm.hideAll = hideAllFn;

		//导航条：搜索模块
		vm.showSearchType = showSearchTypeFn; //显示搜索类型列表
		vm.hideSearchType = hideSearchTypeFn; //显示搜索类型列表
		vm.setSearchType = setSearchTypeFn; //设置搜索类型的赋值
		vm.goToSearch = goToSearchFn; //模糊搜索
		vm.keycode13 = keycode13Fn; //回车事件

		//获取短信、邮箱验证码（不需要参数）
		vm.getSmsEmailCode = getSmsEmailCodeFn;

		vm.setProvince = setProvinceFn; //选择省份

		vm.getCityList = getCityListFn; //获取城市列表

		vm.getActivityType = getActivityTypeFn; //获取活动类型数组

		/*****************函数 end****************/

		(function init() {
			//获取省份列表
			addressService.getProvinceList(function(provinceArray) {
				vm.provinceArray = provinceArray;
				vm.selectProvince = provinceArray[0]; //随便先选中一个省

				//根据当前IP，去设置默认选中的省份
				$http.jsonp('https://api.map.baidu.com/location/ip?ak=f9vN5ry16uR26GXGGfgbcTELUqG1kmhX&coor=bd09ll&callback=JSON_CALLBACK').success(function(data) {
					if (data) {
						//获取省份名称
						var ipProvince = data.content.address_detail.province.substring(0, data.content.address_detail.province.length - 1);
						for (var i = 0; i < provinceArray.length; i++) {
							if (ipProvince == provinceArray[i].name) {
								vm.selectProvince = provinceArray[i];
								break;
							}
						}
						//加载城市
						vm.getCityList(vm.selectProvince.name, "cityArray", null);
					}
				});
			});

			vm.getActivityType(); //活动类型数组
		})();

		//
		//
		//
		//
		//
		//----------------------------搜索框------------------------------------------
		//
		//
		//
		//
		//
		//显示搜索框的下拉列表
		function showSearchTypeFn() {
			vm.showSearch = true;
		}

		//隐藏搜索框的下拉列表
		function hideSearchTypeFn() {
			vm.showSearch = false;
		}

		//设置搜索框的被点击的下拉列表的值
		function setSearchTypeFn(param, $event) {
			vm.searchType = param;
			vm.hideSearchType();
			angular.element($event.target).parent().siblings(".button").css("width", "auto");
		}

		//模糊搜索
		function goToSearchFn() {
			if (vm.searchType == "活动") {
				$state.go("activityList", {
					"address": "",
					"cate": "",
					"time": "",
					"keyword": vm.keyword
				});
			} else if (vm.searchType == "众筹") {
				$state.go("crowdFundList", {
					"keyword": vm.keyword
				});
			}else if(vm.searchType == "主办方"){
				$state.go("sponsorList", {
					"keyword": vm.keyword
				});
			}
		}

		//回车事件搜索
		function keycode13Fn(e) {
			var keycode = window.event ? e.keyCode : e.which;
			if (keycode == 13) {
				vm.goToSearch();
			}
		}
		//
		//
		//
		//
		//
		//-----------------------------监听广播 ：显示弹框，隐藏弹框-----------------------------------------
		//
		//
		//
		//
		//

		/**
		 * 监听显示公共层的广播事件
		 * 参数data:数组，数组中为字符串，字符串为HTML元素的id名
		 */
		$scope.$on("public.show", function(event, data) {
			if (data) {
				for (var i = 0; i < data.length; i++) {
					vm[data[i]] = true;
				}
			}
		});

		/**
		 * 监听隐藏公共层的广播事件
		 * 参数data:数组，数组中为字符串，字符串为HTML元素的id名
		 * data为[],则隐藏所有公共HTML层
		 */
		$scope.$on("public.hide", function(event, data) {
			data = data.length > 0 ? data : vm.domArray;
			for (var i = 0; i < data.length; i++) {
				vm[data[i]] = false;
			}
		});

		//隐藏所有弹框
		function hideAllFn() {
			$scope.$broadcast("public.hide", []);
		}

		//
		//
		//
		//
		//
		//--------------------------普通弹框--------------------------------------------
		//调用语法：window.showAutoDialog("显示的文字");
		//
		//
		//
		//
		//
		//autoDialog:显示普通的弹框
		function showAutoDialogFn(param) {
			$scope.$broadcast("public.show", ["mask_div", "auto_dialog"]);
			if (param) {
				$timeout(function() {
					$scope.$apply(function() {
						vm.autoDialogTitle = param.toString();
					});
				});
			} else {
				$timeout(function() {
					$scope.$apply(function() {
						vm.autoDialogTitle = "服务器错误，请联系管理员<br>邮箱：it@eitty.cn";
					});
				});
			}
		}

		//autoDialog:确定按钮1
		function autoDialogConfirmFn() {
			$scope.$broadcast("public.hide", ["mask_div", "auto_dialog"]);
		}

		//
		//
		//
		//
		//
		//------------------------复杂弹框：有确定、取消按钮----------------------------------------------
		//调用语法：$rootScope.$broadcast("public.showAlertDialog",obj);
		//参数
		//	obj={
		//		alertDialogTitle	展示文字，默认"确定执行该操作吗？"
		//		alertDialogConfirm	确定事件，默认确定事件为隐藏弹框
		//		alertDialogCancel	取消事件，默认取消事件为隐藏弹框
		//		showCancelButton	是否显示取消按钮,默认显示true
		//	}
		//
		//
		//
		//
		//

		//alertDialog:有两个按钮的弹框
		$scope.$on("public.showAlertDialog", function(event, data) {
			vm.showAlertDialog(data);
		});

		// alertDialog:显示弹框
		function showAlertDialogFn(obj) {
			$scope.$broadcast("public.show", ["mask_div", "alert_dialog"]);
			//将传进来的obj替换掉原来的数据
			if (!!obj) {
				vm.alertDialogTitle = !!obj.alertDialogTitle ? obj.alertDialogTitle : "确定执行该操作吗？";
				vm.alertDialogConfirm = !!obj.alertDialogConfirm ? obj.alertDialogConfirm : alertDialogConfirmFn;
				vm.alertDialogCancel = !!obj.alertDialogCancel ? obj.alertDialogCancel : alertDialogCancelFn;
				vm.alertDialogCancelButton = obj.alertDialogCancelButton == false ? obj.alertDialogCancelButton : true; //默认显示取消按钮,有传参，一般是接收到false
			} else {
				vm.delete_dialog_title = "确定执行该操作吗？";
				vm.deleteConfirm = alertDialogConfirmFn;
				vm.deleteCancel = alertDialogCancelFn;
				vm.alertDialogCancelButton = true; //默认显示取消按钮
			}
		}

		//alertDialog:确定按钮
		function alertDialogConfirmFn() {
			$scope.$broadcast("public.hide", ["mask_div", "alert_dialog"]);
		}

		//alertDialog:取消按钮
		function alertDialogCancelFn() {
			$scope.$broadcast("public.hide", ["mask_div", "alert_dialog"]);
		}

		//
		//
		//
		//
		//
		//--------------------------弹出：动画提示文字--------------------------------------------
		//调用语法：window.showAlertTip(data.msg);
		//调用语法：window.showAlertTip(["展示的文字",3000]);//3000为显示的毫秒时间
		//
		//
		//
		//
		//
		function showAlertTipFn(data) {
			$timeout(function() {
				$scope.$apply(function() {

					//清除隐藏的延时处理
					$timeout.cancel(vm.alert_tip_timeout);
					//默认时间1800毫秒
					var showTime = 1800;
					//修改文字
					if (data) {
						if (data instanceof Array) {
							vm.alert_text = data[0].toString(); //文字
							showTime = data[1]; //时间
						} else {
							vm.alert_text = data.toString();
						}
					} else {
						vm.alert_text = "操作完成";
					}
					//展开动画
					if (vm.alert_tip == false) {
						vm.alert_tip = true;
					}
					//倒计时隐藏动画
					vm.alert_tip_timeout = $timeout(function() {
						vm.alert_tip = false;
					}, showTime);
				});
			});

		}
		//
		//
		//
		//
		//
		//--------------------------------模拟点击事件--------------------------------------
		//
		//
		//
		//
		//

		//全局：触发input的点击事件
		function triggerClickFn(id) {
			angular.element("#" + id).click();
		}
		//
		//
		//
		//
		//
		//--------------------------------获取短信、邮箱验证码功能（可传参，也可不传参）--------------------------------------
		//参数为字符串（用户名：一般用户名是手机号）："18819493835"
		//
		//
		//
		//
		//
		function getSmsEmailCodeFn(username) {
			publicService.getSmsEmailCode(username).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						window.showAlertTip(data.data.msg);
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
		//--------------------------------退出登录--------------------------------------
		//
		//
		//
		//
		//
		function userExitFn() {
			$timeout(function() {
				var params = {
					"username": $rootScope.userInfo.user_name
				}

				//发起注销请求
				publicService.exit(params).success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if (data.data.code == 20000) {
							window.showAlertTip("退出成功");
							//清除cookie
							$.cookie("yiqi_userInfo", null);
							//清除$rootScope.userInfo
							$rootScope.userInfo = {};
							//跳转到首页				
							$state.go("index");
						} else {
							widnwo.showAlertTip(data.data.msg);
						}
					}
				});

			}, 1000);
		}
		//
		//
		//
		//
		//
		//--------------------------------设置省份--------------------------------------
		//
		//
		//
		//
		//
		function setProvinceFn(obj) {
			vm.selectProvince = obj;
			vm.getCityList(vm.selectProvince.name, "cityArray", null);
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
				//vm.submitForm.address.city = "";
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
		//----------------------------活动类别，形式，标签------------------------------------------
		//
		//
		//
		//
		//
		//获取活动类别，形式，标签等
		function getActivityTypeFn() {
			publicService.getActivityType().success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					var result = data.data;
					if (result.code == 20000) {
						vm.activityTypeArray = result.cate; //活动类别
					}
				}
			});
		}
	}
})();