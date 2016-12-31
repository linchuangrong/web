/**
 * 作者：林创荣
 * 功能：发起众筹
 * 时间：2016年9月20日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/contenteditable.directive.js', 'contenteditable.directive'); //富文本编辑器，要求先引入wangEditor.min.js
	app.import('/app/Tpl/web/js/directive/imgUpload.directive.js', 'imgUpload.directive'); //图片上传插件
	app.import('/app/Tpl/web/js/directive/limitSize.directive.js', 'limitSize.directive'); //限制input值大小范围插件
	app.import('/app/Tpl/web/js/service/service_min/public.service.min.js', 'public.service'); //引入“公共”接口 服务
	app.import('/app/Tpl/web/js/service/service_min/crowdFund.service.min.js', 'crowdFund.service'); //引入“众筹”接口 服务
	app.import('/app/Tpl/web/js/service/service_min/address.service.min.js', 'address.service'); //引入“地址”接口 服务
	app.import('/app/Tpl/web/js/directive/integer.directive.js', 'integer.directive'); //只能输入整数

	app.addController("addCrowdFundController", addCrowdFundController);
	addCrowdFundController.$inject = ['$scope', '$rootScope', '$window', 'crowdFundService', 'publicService', 'addressService', '$state', '$filter'];

	function addCrowdFundController($scope, $rootScope, $window, crowdFundService, publicService, addressService, $state, $filter) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "发起众筹";
		var vm = this;

		//未登录，让其先登录
		if (!$rootScope.userInfo.id) {
			$state.go("login");
			return false;
		}

		//没手机，就跑去安全中心先绑定手机
		if (!$rootScope.userInfo.mobile) {
			window.showAutoDialog("请先到安全中心绑定手机");
			$state.go("personal.safe");
			return false;
		}

		//阻止普通用户进入此页面
		if ($rootScope.userInfo.identity_conditions != '0') {
			window.showAlertTip(["您不是主办方，无权限发布筹款", 3000]);
			$state.go("index");
			return false;
		}

		/*****************变量 begin****************/

		vm.crowdFundTypeArray = []; //众筹类型数组

		vm.provinceArray = []; //基本数据：省份列表
		vm.cityArray = []; //基本数据：城市列表

		vm.repayArray = []; //用户添加的回报数组,跟vm.submitForm.item_id有一定的关联性

		vm.show = {
			"add_repay_dialog": false
		}

		vm.flag = {
			addRepayFlag: true, //允许添加回报
			submitFlag: true
		}

		vm.showPanel = {
			crowdFundPanel1: true, //这个panel已经被删除了
			crowdFundPanel2: false,
		}

		//回报设置表单
		vm.repayForm = {
			"type": 1, //回报类型，0无偿，1实物，2虚拟
			"item_name": "", //回报标题
			"description": "", //回报内容
			"delivery_fee": null, //支持金额
			"limit_user": null, //人数上限
			"repaid_day": null, //回报时间
			"item_image": "", //照片
		}

		//最终发布众筹表单
		vm.submitForm = {
			"welfare_id": "", //众筹类型
			"welfare_name": "", //众筹类型名称，这个字段是不需要提交到后台的
			"title": "", //众筹项目标题
			"brief": "", //众筹目的
			"address": {
				"province": "", //省
				"city": "", //市
				"location": "" //详细地址
			},
			"limit_price": null, //筹集资金
			"deal_days": $filter('toTime')(publicService.dateOneMonthStamp), //筹资结束时间
			"tags_match": "", //标签
			"image": "", //封面
			"vedio": "", //视频链接
			"description": "", //详情
			"item_id": [], //回报ID
			"hasRepay": "1"
		}

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getCrowdFundTypeList = getCrowdFundTypeListFn; //获取众筹类型
		vm.setCrowdFundType = setCrowdFundTypeFn; //设置众筹类型
		vm.setDealDays = setDealDaysFn; //设置结束时间

		vm.getCityList = getCityListFn; //活动：获取城市列表

		vm.goToPanel = goToPanelFn; //上一步，下一不

		vm.showRepayDialog = showRepayDialogFn; //显示添加回报弹框
		vm.alertDialogConfirm = alertDialogConfirmFn; //确定添加回报
		vm.alertDialogCancel = alertDialogCancelFn; //取消添加回报
		vm.deleteRepay = deleteRepayFn; //删除回报

		vm.submit = submitFn; //发布众筹

		/*****************函数 end****************/

		(function init() {
			vm.getCrowdFundTypeList();

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
		//----------------------------日期时间控件------------------------------------------
		//
		//
		//
		//
		//
		function setDealDaysFn() {
			laydate({
				elem: '#deal_days',
				istime: true, //时，分，秒
				format: 'YYYY-MM-DD hh:mm:ss',
				min: $filter('toTime')(publicService.dateNowStamp), //最小日期是今天8点
				isclear: false, //隐藏清空按钮
				istoday: false, //隐藏掉今天按钮
				choose: function(dates) {
					$rootScope.$apply(function() {
						vm.submitForm.deal_days = dates;
					});
				}
			});
		}

		//
		//
		//
		//
		//
		//----------------------------获取众筹类型------------------------------------------
		//
		//
		//
		//
		//
		function getCrowdFundTypeListFn() {
			crowdFundService.getCrowdFundTypeList().success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						//数组
						vm.crowdFundTypeArray = data.data.list;
						//选中第一个
						vm.submitForm.welfare_id = data.data.list[0].id;
						vm.submitForm.welfare_name = data.data.list[0].name;
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
		//----------------------------设置众筹类型------------------------------------------
		//
		//
		//
		//
		//
		function setCrowdFundTypeFn(id, name) {
			vm.submitForm.welfare_id = id;
			vm.submitForm.welfare_name = name; //这个字段是不需要提交到数据库的
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
				vm.submitForm.address.city = "";
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
		//----------------------------下一步，上一步------------------------------------------
		//
		//
		//
		//
		//
		function goToPanelFn(param) {
			if (param == "crowdFundPanel2") {
				//进入panel2，要先判断panel1的参数是否已经都填写了

				if (!vm.submitForm.welfare_id) {
					window.showAlertTip("请选择众筹类型");
					return false;
				}

				if (!vm.submitForm.title) {
					window.showAlertTip("请填写项目名称");
					return false;
				}

				if (!vm.submitForm.brief) {
					window.showAlertTip("请填写筹款目的");
					return false;
				}

				if (!vm.submitForm.address.province) {
					window.showAlertTip("请选择省份");
					return false;
				}

				if (!vm.submitForm.address.city) {
					window.showAlertTip("请选择城市");
					return false;
				}

				if (!vm.submitForm.address.location) {
					window.showAlertTip("请填写详细地址");
					return false;
				}

				//这里比较特殊，直接引入$scope来判断form表单的验证是否通过
				if (!$scope.submitForm.limit_price.$valid) {
					window.showAlertTip("请填写正确的筹资金额");
					return false;
				}

				if (!vm.submitForm.deal_days) {
					window.showAlertTip("请填写筹资结束时间");
					return false;
				}

				if (!vm.submitForm.tags_match) {
					window.showAlertTip("请填写自定义标签");
					return false;
				}

				if (!vm.submitForm.image) {
					window.showAlertTip("请上传封面图片");
					return false;
				}
			}

			angular.element($window).scrollTop(0);
			vm.showPanel = {
				crowdFundPanel1: false,
				crowdFundPanel2: false,
			}
			vm.showPanel[param] = true;
		}
		//
		//
		//
		//
		//
		//----------------------------添加回报------------------------------------------
		//
		//
		//
		//
		//

		//显示添加回报弹框
		function showRepayDialogFn() {
			vm.show.add_repay_dialog = true;
		}

		//确定添加回报
		function alertDialogConfirmFn() {

			//防止重复提交
			if (vm.flag.addRepayFlag == false) {
				return false;
			}

			if (!vm.repayForm.type) {
				window.showAlertTip("请选择回报类型");
				return false;
			}

			//有偿、虚拟回报时，内容不能为空
			if (vm.repayForm.type == '1' || vm.repayForm.type == '2') {
				var reg = /^\-?\d*$/; //整数正则
				if (!vm.repayForm.item_name) {
					window.showAlertTip("请填写回报标题");
					return false;
				}
				if (!vm.repayForm.description) {
					window.showAlertTip("请填写回报内容");
					return false;
				}
				if (!vm.repayForm.delivery_fee || !(vm.repayForm.delivery_fee > 0)) {
					window.showAlertTip("请填写正确的支持金额");
					return false;
				}
				if (!vm.repayForm.limit_user || !reg.test(vm.repayForm.limit_user) || !(vm.repayForm.limit_user > 1)) {
					window.showAlertTip("人数上限为大于0的整数");
					return false;
				}
				if (!vm.repayForm.repaid_day || !reg.test(vm.repayForm.repaid_day) || !(vm.repayForm.repaid_day > 0)) {
					window.showAlertTip("请填写正确的回报时间值");
					return false;
				}
				if (!vm.repayForm.item_image) {
					window.showAlertTip("请上传图片");
					return false;
				}
			}

			var params = {
				username: $rootScope.userInfo.user_name,
				type: vm.repayForm.type, //回报类型，0无偿，1实物，2虚拟
				item_name: vm.repayForm.item_name, //回报标题
				description: vm.repayForm.description, //回报内容
				delivery_fee: vm.repayForm.delivery_fee, //支持金额
				limit_user: vm.repayForm.limit_user, //人数上限
				repaid_day: vm.repayForm.repaid_day, //回报时间
				item_image: vm.repayForm.item_image //照片
			}

			//添加回报
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.addRepayFlag = false;
			crowdFundService.creatRepay(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {

							//提示语句
							window.showAlertTip(data.data.msg);

							//隐藏弹框
							vm.show.add_repay_dialog = false;

							//将数据插入数组，仅用于前端展示
							vm.repayArray.push(data.data.list);

							//将数据插入数组，用于form提交
							vm.submitForm.item_id.push(data.data.list.id);

						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.addRepayFlag = true;
				}
			});
		}

		//取消添加回报
		function alertDialogCancelFn() {
			vm.show.add_repay_dialog = false;
		}

		//删除回报
		function deleteRepayFn($index, id) {
			vm.repayArray.splice($index, 1); //删除数组里的对象
			vm.submitForm.item_id.splice($index, 1); //删除数组里的id
			window.showAlertTip("删除成功");

			/*var params = {
				id: id
			}
			crowdFundService.deleteRepay(params).success(function(data) {
				if(data.ret != 200) {
					window.showAlertTip(data.msg);
				} else {
					var result = data.data;
					if(result.code == 20000) {
						vm.repayArray.splice($index, 1); //删除数组里的对象
						vm.submitForm.item_id.splice($index, 1); //删除数组里的id
						window.showAlertTip(result.msg);
					} else {
						window.showAutoDialog(result.msg);
					}
				}
			});*/
		}
		//
		//
		//
		//
		//
		//----------------------------发布众筹------------------------------------------
		//
		//
		//
		//
		//
		function submitFn() {

			//防止重复提交
			if (vm.flag.submitFlag == false) {
				return false;
			}

			//如果详情里没有图片，而且字数太少，弹框警告
			if (vm.submitForm.description.indexOf("<img") < 0 && vm.submitForm.description.trim().length < 30) {
				window.showAutoDialog("详情描述字数过少，请更加详细地描述一下！");
				return false;
			}

			if (vm.submitForm.welfare_name == "众筹") {
				//有回报：1   ；  无回报：0 ；
				if (vm.submitForm.hasRepay == '1') {
					if (vm.submitForm.item_id.length == 0) {
						window.showAlertTip("请添加至少一个回报");
						return false;
					}
				} else {
					vm.repayArray = []; //众筹情况下，用户设置了无回报，需要强制将回报数组清空
					vm.submitForm.item_id = []; //众筹情况下，用户设置了无回报，需要强制将回报数组清空
				}

			} else {
				vm.repayArray = []; //清空回报，防止用户设置了回报，又返回设置成“捐赠”（捐赠是不可以有回报的）
				vm.submitForm.item_id = []; //清空回报，防止用户设置了回报，又返回设置成“捐赠”（捐赠是不可以有回报的）
			}

			var params = {
				"uid": $rootScope.userInfo.id,
				"username": $rootScope.userInfo.user_name,
				"welfare_id": vm.submitForm.welfare_id, //众筹类型
				"title": vm.submitForm.title, //众筹项目标题
				"brief": vm.submitForm.brief, //众筹目的
				"address": JSON.stringify({
					"province": vm.submitForm.address.province, //省
					"city": vm.submitForm.address.city, //市
					"location": vm.submitForm.address.location //详细地址
				}),
				"limit_price": vm.submitForm.limit_price, //筹集资金
				"deal_days": $filter("toTimeStamp")(vm.submitForm.deal_days), //筹集周期
				"tags_match": vm.submitForm.tags_match, //标签
				"image": vm.submitForm.image, //封面
				"vedio": vm.submitForm.vedio, //视频链接
				"description": vm.submitForm.description, //详情
				"item_id": vm.submitForm.item_id.join(','), //回报ID
			}

			//添加回报
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.submitFlag = false;
			crowdFundService.addCrowdFund(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {

							//提示语句
							window.showAlertTip(data.data.msg);

							//隐藏弹框
							vm.show.add_repay_dialog = false;

							//页面跳转
							$state.go("personal.myCrowdFund");

						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.submitFlag = true;
				}
			});
		}
	}
})();