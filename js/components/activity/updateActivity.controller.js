/**
 * 作者：林创荣
 * 功能：发布活动
 * 		url地址里，有传参数id即为编辑活动
 * 时间：2016年9月21日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/contenteditable.directive.js', 'contenteditable.directive'); //富文本编辑器，要求先引入wangEditor.min.js
	app.import('/app/Tpl/web/js/directive/tooltip.directive.js', 'tooltip.directive'); //引入“tooltip”插件
	app.import('/app/Tpl/web/js/service/public.service.js', 'public.service'); //引入“公共接口”服务
	app.import('/app/Tpl/web/js/service/activity.service.js', 'activity.service'); //引入“活动”接口 服务
	app.import('/app/Tpl/web/js/directive/imgUpload.directive.js', 'imgUpload.directive'); //图片上传插件
	app.import('/app/Tpl/web/js/service/address.service.js', 'address.service'); //引入“地址”接口 服务
	app.import('/app/Tpl/web/js/directive/limitSize.directive.js', 'limitSize.directive'); //限制输入范围
	app.import('/app/Tpl/web/js/directive/integer.directive.js', 'integer.directive'); //只能输入整数

	app.addController("updateActivityController", updateActivityController);
	updateActivityController.$inject = ['$rootScope', '$window', '$filter', '$timeout', 'publicService', 'activityService', 'addressService', '$state', '$stateParams'];

	function updateActivityController($rootScope, $window, $filter, $timeout, publicService, activityService, addressService, $state, $stateParams) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "发布活动";
		var vm = this;

		//阻止普通用户进入此页面
		if($rootScope.userInfo.identity_conditions != '0') {
			window.showAlertTip(["您不是主办方，无权限发布活动", 3000]);
			$state.go("index");
			return false;
		}
		
		//没手机，就跑去安全中心先绑定手机
		if(!$rootScope.userInfo.mobile){
			window.showAutoDialog("请先到安全中心绑定手机");
			$state.go("personal.safe");
			return false;
		}

		/*****************变量 begin****************/
		
		vm.agree = true; //同意条

		//需要提交的表单数据
		vm.submitForm = {
			title: "", //标题
			people: "", //参加人数
			startTime: $filter("toTime")(publicService.dateNowStamp), //活动开始时间,今天8点
			endTime: $filter("toTime")(publicService.dateOneMonthStamp), //活动结束时间，一个月后8点
			address: {
				province: "", //省中文
				city: "", //市（中文）
				location: ""
			},
			cat_id: "", //活动类别ID
			cat_way: "", //活动形式
			cat_tag: [], //活动标签
			brief: "", //活动简介
			description: "", //详情
			poster_img: "", //海报
			free_ticket: [], //免费票
			charge_ticket: [], //收费票
			verify_coder: "", //验证码
			activ_index: "" //活动网址
		}

		vm.editForm = {};

		vm.provinceArray = []; //基本数据：省份列表
		vm.cityArray = []; //基本数据：城市列表
		vm.cat_id_array = []; //基本数据：活动类别
		vm.cat_way_array = []; //基本数据：活动形式
		vm.cat_tag_array = []; //基本数据：活动标签

		vm.add_ticket_mask = false; //公共遮罩层：添加门票遮罩层
		vm.add_free_dialog = false; //免费票：添加免费票弹框
		vm.add_ticket_dialog = false; //收费票：添加收费票弹框
		vm.ticketEndTime = ""; //收费票：报名门票截止时间

		vm.freeTicket_num = ""; //免费票对应的门票张数
		vm.freeTicketArray = []; //免费票：数组
		vm.chargeTicketArray = []; //收费票：数组

		vm.chargeTicketForm = { //收费票：表单初始化数据
			ticket_name: "", //票名
			ticket_time: $filter("toTime")(publicService.dateOneMonthStamp), //时间,默认是一个月后
			ticket_price: "", //价格
			ticket_num: "", //数量
			//ticket_set: "单人票", //套票设置
			ticket_decription: "" //费用说明
		}

		vm.chargeTicketSetArray = [{ //收费票：里面的套票设置
			id: "单人票",
			name: "单人票"
		}, {
			id: "双人票",
			name: "双人票"
		}, {
			id: "三人票",
			name: "三人票"
		}];

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.setStartTime = setStartTimeFn; //活动：设置开始时间
		vm.setEndTime = setEndTimeFn; //活动：设置结束时间
		vm.getActivityType = getActivityTypeFn; //活动：获取活动类别、活动形式、活动标签
		vm.getTicketInfo = getTicketInfoFn; //获取单一票详情

		vm.getCityList = getCityListFn; //活动：获取城市列表

		vm.showAddFreeDialog = showAddFreeDialogFn; //免费票：添加免费票
		vm.addFreeDialogConfirm = addFreeDialogConfirmFn; //免费票：确定添加免费票
		vm.addFreeDialogCancel = addFreeDialogCancelFn; //免费票：取消添加免费票
		vm.removeFreeTicket = removeFreeTicketFn; //免费票：删除免费票

		vm.showAddTicketDialog = showAddTicketDialogFn; //收费票：弹出收费票输入框
		vm.addTicketDialogConfirm = addTicketDialogConfirmFn; //收费票：确定添加票种
		vm.addTicketDialogCancel = addTicketDialogCancelFn; //收费票：取消添加票种
		vm.setTicketEndTime = setTicketEndTimeFn; //收费票：报名门票截止时间
		vm.removeChargeTicket = removeChargeTicketFn; //收费票：删除

		vm.addActivitySubmit = addActivitySubmitFn; //活动：确定新建活动

		/*****************函数 end****************/

		(function init() {

			//如果有传id
			if(!!$stateParams.id) {
				var params = {
					"id": $stateParams.id,
					"username": $rootScope.userInfo["user_name"]
				}
				activityService.detail(params).success(function(data) {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if(data.data.code == 20000) {
							vm.editForm = data.data.list[0];
							//TODO 赋值
							vm.submitForm.title = vm.editForm.name; //标题
							vm.submitForm.people = vm.editForm.max_people; //人数上限
							vm.submitForm.startTime = $filter("toTime")(vm.editForm.begin_time); //开始时间
							vm.submitForm.endTime = $filter("toTime")(vm.editForm.end_time); //结束时间
							//vm.submitForm.address.province = vm.editForm.province; //省份
							//vm.submitForm.address.city = vm.editForm.city; //城市
							vm.submitForm.address.location = vm.editForm.address; //详细地址
							//vm.submitForm.cat_id = vm.editForm.cate_id; //活动类别
							//vm.submitForm.cat_way = vm.editForm.cate_way; //活动形式
							vm.submitForm.cat_tag = vm.editForm.tags.split(','); //活动标签
							vm.submitForm.brief = vm.editForm.brief; //活动简介
							vm.submitForm.description = vm.editForm.description; //详细描述
							vm.submitForm.poster_img = vm.editForm.image; //图片
							//vm.submitForm.free_ticket = vm.editForm.free_ticket;//免费票
							//vm.submitForm.charge_ticket = vm.editForm.charge_ticket;//收费票
							vm.submitForm.activ_index = vm.editForm.activ_index;//活动网址

							/*******获取下拉选项的数据**********/

							vm.getActivityType(); //获取活动类别、形式、标签

							//获取省份列表
							addressService.getProvinceList(function(provinceArray) {
								vm.provinceArray = provinceArray; //省数组
								vm.submitForm.address.province = vm.editForm.province; //省份
								vm.getCityList(vm.editForm.province, "cityArray", function() {
									vm.submitForm.address.city = vm.editForm.city; //城市
								});
							});

							//获取单一票详情
							var ticketArray = vm.editForm.ticket_id.split(',');
							for(var i = 0; i < ticketArray.length; i++) {
								vm.getTicketInfo(ticketArray[i]);
							}

							/*****************/
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				});
			}

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
		function setStartTimeFn() {
			laydate({
				elem: '#startTime',
				istime: true, //取消时，分，秒
				format: 'YYYY-MM-DD hh:mm:ss',
				min: $filter('toTime')(publicService.dateNowStamp), //最小日期是今天8点
				isclear: false, //隐藏清空按钮
				istoday: false, //隐藏掉今天按钮
				choose: function(dates) {
					$rootScope.$apply(function() {
						vm.submitForm.startTime = dates;
					});
				}
			});
		}

		function setEndTimeFn() {
			laydate({
				elem: '#endTime',
				istime: true, //取消时，分，秒
				format: 'YYYY-MM-DD hh:mm:ss',
				min: $filter('toTime')(publicService.dateNowStamp), //最小日期是今天8点
				isclear: false, //隐藏清空按钮
				istoday: false, //隐藏掉今天按钮
				choose: function(dates) {
					$rootScope.$apply(function() {
						vm.submitForm.endTime = dates;
					});
				}
			});
		}

		function setTicketEndTimeFn() {
			laydate({
				elem: '#ticketEndTime',
				istime: true, //取消时，分，秒
				format: 'YYYY-MM-DD hh:mm:ss',
				min: $filter('toTime')(publicService.dateNowStamp), //最小日期是今天8点
				isclear: false, //隐藏清空按钮
				istoday: false, //隐藏掉今天按钮
				choose: function(dates) {
					$rootScope.$apply(function() {
						vm.chargeTicketForm.ticket_time = dates;
					});
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
				vm.submitForm.address.city = "";
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
		//----------------------------活动类别，形式，标签------------------------------------------
		//
		//
		//
		//
		//
		//获取活动类别，形式，标签等
		function getActivityTypeFn() {
			activityService.getActivityType().success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					var result = data.data;
					if(result.code == 20000) {

						vm.cat_id_array = result.cate; //活动类别数组
						vm.submitForm.cat_id = vm.editForm.cate_id; //活动类别

						vm.cat_way_array = result.finace; //活动形式数组
						vm.submitForm.cat_way = vm.editForm.cate_way;

						vm.cat_tag_array = result.tags; //活动标签数组
						for(var i = 0; i < vm.submitForm.cat_tag.length; i++) {
							for(var j = 0; j < vm.cat_tag_array.length; j++) {
								if(vm.submitForm.cat_tag[i] == vm.cat_tag_array[j].name) {
									vm.cat_tag_array[j]["active"] = true;
									break;
								}
							}
						}

					}
				}

			});
		}
		//
		//
		//
		//
		//
		//----------------------------获取单一票详情------------------------------------------
		//
		//
		//
		//
		//
		function getTicketInfoFn(id) {
			var params = {
				"ticket_id": id
			}
			activityService.getTicketInfo(params).success(function(data) {
				if(data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if(data.data.code == 20000) {
						if(data.data.list.ticket_price == null || data.data.list.ticket_price == "") {
							//免费票
							vm.freeTicketArray.push(data.data.list);
							vm.submitForm.free_ticket.push(data.data.list.id);
						} else {
							//收费票
							vm.chargeTicketArray.push(data.data.list);
							vm.submitForm.charge_ticket.push(data.data.list.id);
						}
					}
				}

			});
		}

		//
		//
		//
		//
		//
		//----------------------------添加票种------------------------------------------
		//
		//
		//
		//
		//
		//添加免费票弹框
		function showAddFreeDialogFn() {
			vm.add_ticket_mask = true;
			vm.add_free_dialog = true;
		}

		//确定免费票按钮事件
		function addFreeDialogConfirmFn() {

			var params = {
				uid: $rootScope.userInfo.id,
				ticket_name: "免费票", //票名
				ticket_num: vm.freeTicket_num //免费票数量
			}

			//接口请求：添加免费票
			$rootScope.$broadcast("public.show", ["loading_panel"]);

			activityService.addFreeTicket(params)
				.success(function(data) {
					try {
						if(data.ret != 200) {
							window.showAlertTip(data.msg);
							return false;
						} else {
							var result = data.data;
							if(result.code == 20000) {
								window.showAlertTip("添加成功");
								//隐藏弹框
								vm.addFreeDialogCancel();

								vm.freeTicketArray.push(result.list[0]); //此数组用于界面的显示
								vm.submitForm.free_ticket.push(result.list[0].id); //表单赋值：获取免费票的id
							} else {
								window.showAlertTip(data.msg);
							}
						}

					} catch(e) {

					} finally {
						//取消遮罩
						$rootScope.$broadcast("public.hide", ["loading_panel"]);
					}
				});

		}

		//取消免费票按钮事件
		function addFreeDialogCancelFn() {
			vm.add_ticket_mask = false;
			vm.add_free_dialog = false;
		}

		//删除免费票
		function removeFreeTicketFn() {
			vm.submitForm.free_ticket = []; //删除数组里的对象
			vm.freeTicketArray = []; //删除数组里的对象
			window.showAlertTip("删除成功");
			
			//发起http请求，删除掉数据库的里数据
			/*var params = {
				"act": "del_ticket",
				id: vm.submitForm.free_ticket[0]
			}
			activityService.deleteChargeTicket(params).success(function(data) {
				if(data.ret != 200) {
					window.showAlertTip(data.msg);
				} else {
					var result = data.data;
					if(result.code == 20000) {
						vm.submitForm.free_ticket = []; //删除数组里的对象
						vm.freeTicketArray = []; //删除数组里的对象

						window.showAlertTip(result.msg);
					} else {
						window.showAutoDialog(result.msg);
					}
				}
			});*/
		}

		//显示收费票弹框
		function showAddTicketDialogFn() {
			vm.add_ticket_mask = true;
			vm.add_ticket_dialog = true;
			angular.element("body").css("margin-top", "0"); //防止 laydate样式错乱
		}

		//确定收费票按钮事件
		function addTicketDialogConfirmFn() {
			var params = {
				uid: $rootScope.userInfo.id,
				ticket_name: vm.chargeTicketForm.ticket_name, //票名
				ticket_time: $filter("toTimeStamp")(vm.chargeTicketForm.ticket_time), //日期转为时间戳
				ticket_price: vm.chargeTicketForm.ticket_price, //价格
				//ticket_set: vm.chargeTicketForm.ticket_set, //套票设置
				ticket_decription: vm.chargeTicketForm.ticket_decription, //费用说明
				ticket_num: vm.chargeTicketForm.ticket_num //数量
			}

			var reg = /^\-?\d*$/; //整数正则
			if (!params.ticket_name) {
				window.showAlertTip("票价类型不能为空");
				return false;
			} else if (!params.ticket_time) {
				window.showAlertTip("时间不能为空");
				return false;
			} else if (!params.ticket_price || !(params.ticket_price > 1)) {
				window.showAlertTip("价格必须大于0");
				return false;
			}
			/*else if(!params.ticket_set) {
				window.showAlertTip("套票设置不能为空");
				return false;
			}*/
			else if (!params.ticket_num || !reg.test(params.ticket_num) || !(params.ticket_num > 1)) {
				window.showAlertTip("收费票数量为必须大于0的整数");
				return false;
			} else if (!(params.ticket_decription.trim().length > 0)) {
				window.showAlertTip("请填写费用说明");
				return false;
			}

			//接口请求：添加收费票
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			activityService.addChargeTicket(params)
				.success(function(data) {
					try {
						if(data.ret != 200) {
							window.showAlertTip(data.msg);
							return false;
						} else {
							var result = data.data;
							if(result.code == 20000) {

								//隐藏弹框
								vm.addTicketDialogCancel();

								window.showAlertTip("添加成功");

								vm.chargeTicketArray.push(result.list[0]); //用于展示在界面上的数组
								vm.submitForm.charge_ticket.push(result.list[0].id); //fomr表单的收费票数组，只需要id

								//清空表单数据
								vm.chargeTicketForm = {
									ticket_name: "", //票名
									ticket_time: "", //时间
									ticket_price: "", //价格
									ticket_num: "", //数量
									//ticket_set: "单人票", //套票设置
									ticket_decription: "" //费用说明
								}

							} else {
								window.showAlertTip(data.msg);
							}
						}
					} catch(e) {

					} finally {
						//取消掉遮罩层
						$rootScope.$broadcast("public.hide", ["loading_panel"]);
					}
				});

		}

		//取消收费票按钮事件
		function addTicketDialogCancelFn() {
			vm.add_ticket_mask = false;
			vm.add_ticket_dialog = false;
			angular.element("body").css("margin-top", "auto"); //防止 laydate样式错乱
		}

		//发起http请求，删除掉数据库里的数据
		function removeChargeTicketFn($index) {
			
			vm.chargeTicketArray.splice($index, 1); //删除数组里的对象
			vm.submitForm.charge_ticket.splice($index, 1); //删除数组里的id

			window.showAlertTip("删除成功");
			
			/*var params = {
				id: vm.chargeTicketArray[$index].id
			}
			activityService.deleteChargeTicket(params).success(function(data) {
				if(data.ret != 200) {
					window.showAlertTip(data.msg);
				} else {
					var result = data.data;
					if(result.code == 20000) {
						
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
		//----------------------------发布活动------------------------------------------
		//
		//
		//
		//
		//
		//发布活动按钮事件
		function addActivitySubmitFn() {

			//检查省份、城市 有没有选择
			if(!vm.submitForm.address.province || !vm.submitForm.address.city) {
				window.showAutoDialog("请先选择项目地点的省份、城市地区");
				return false;
			}

			//活动标签
			vm.submitForm.cat_tag = [];
			var activeTags = angular.element("#tags").find("li.active");
			for(var i = 0; i < activeTags.length; i++) {
				vm.submitForm.cat_tag.push(activeTags[i].getAttribute("data-name"));
			}

			//既没有免费票，也没有收费票，弹出提示
			if(vm.submitForm.free_ticket.length == 0 && vm.submitForm.charge_ticket.length == 0) {
				window.showAutoDialog("请先添加免费票或者收费票！");
				return false;
			}

			//如果详情里没有图片，而且字数太少，弹框警告
			if (vm.submitForm.description.indexOf("<img") < 0 || vm.submitForm.description.trim().length < 30) {
				window.showAutoDialog("详情描述字数过少，请更加详细地描述一下！");
				return false;
			}

			//合并两个门票（免费票、收费票）数组
			var ticket_id_array = vm.submitForm.charge_ticket.slice(0);
			ticket_id_array = ticket_id_array.concat(vm.submitForm.free_ticket);

			var params = {
				"deal_id": $stateParams.id, //活动Id
				"uid": $rootScope.userInfo.id, //用户id
				"username": $rootScope.userInfo.user_name, //用户名
				"title": vm.submitForm.title, //标题
				"people": vm.submitForm.people, //参加人数
				"startTime": $filter("toTimeStamp")(vm.submitForm.startTime), //开始时间,时间戳
				"endTime": $filter("toTimeStamp")(vm.submitForm.endTime), //结束时间,时间戳
				"address": JSON.stringify(vm.submitForm.address), //地址
				"cat_id": vm.submitForm.cat_id, //活动类别
				"cat_way": vm.submitForm.cat_way, //活动形式
				"cat_tag": vm.submitForm.cat_tag.join(","), //活动标签
				"brief": vm.submitForm.brief, //活动简介
				"description": vm.submitForm.description, //详情
				"poster_img": vm.submitForm.poster_img, //海报
				"ticket_id": ticket_id_array.join(","), //免费票+收费票
				"verify_coder": vm.submitForm.verify_coder, //验证码
				"activ_index": vm.submitForm.activ_index //活动网址
			}

			//更新活动
			vm.submitFlag = false; //设置按钮不可点击
			activityService.addActivity(params).success(function(data) {
				try {
					if(data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if(data.data.code == 20000) {
							window.showAutoDialog(data.data.msg);
							$state.go("personal.myActivity");
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch(e) {

				} finally {
					vm.submitFlag = true; //设置按钮可点击
				}

			});
		}
	}
})();