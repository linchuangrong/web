/**
 * 作者：林创荣
 * 功能：添加评审
 * 时间：2016年12月5日.
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/contenteditable.directive.js', 'contenteditable.directive'); //富文本编辑器，要求先引入wangEditor.min.js
	app.import('/app/Tpl/web/js/service/service_min/examine.service.min.js', 'examine.service'); //引入“评审评估”接口 服务

	app.addController("addExamineController", addExamineController);
	addExamineController.$inject = ['$rootScope', '$window', '$timeout', 'examineService', '$stateParams', '$state'];

	function addExamineController($rootScope, $window, $timeout, examineService, $stateParams, $state) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "添加评审";
		var vm = this;

		/*****************变量 begin****************/

		//判断是评审、还是评估
		if ($stateParams.type == '0') {
			vm.title = "设计评审表单";
		} else if ($stateParams.type == '1') {
			vm.title = "设计评估表单";
		} else {
			vm.title = "设计表单";
		}

		vm.projectNameArray = [""]; //项目名称数组，默认为""

		vm.submitForm = {
			"score_title": "", //评分标题
			"project_number": "", //项目编号
			"review_title": "", //指引标题
			"review_content": "", //指引内容
		}

		vm.flag = {
			submitReviewFormFlag: true, //标识变量
		}

		//区分模板1，2，3
		if ($rootScope.currentRouter == 'addExamine1') {
			vm.first_title = "";
			vm.second_title = "";
		} else if ($rootScope.currentRouter == 'addExamine2') {
			vm.first_title = "";
			vm.second_title = "请点击右侧“笔”按钮编辑一级指标名称";
		} else if ($rootScope.currentRouter == 'addExamine3') {
			vm.first_title = "请点击右侧“笔”按钮编辑大标题";
			vm.second_title = "请点击右侧“笔”按钮编辑评审科目标题";
		}

		//动态表单json格式初始化
		vm.designJson = [{
			"first_title": vm.first_title, //H1大标题
			"data": [{
				"second_title": vm.second_title, //H2标题
				"data": [{
					"third_title": "", //题目
					"score": "", //分值
					"remark": "" //备注、说明
				}]
			}]
		}];

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.check = checkFn; //检查有没有进入此页面的权限

		vm.deleteProjectName = deleteProjectNameFn; //删除一个项目名称
		vm.addProjectName = addProjectNameFn; //添加一个项目名称

		vm.addFirstObj = addFirstObjFn; //添加大标题
		vm.deleteFirstObj = deleteFirstObjFn; //删除大标题
		vm.editFirstObj = editFirstObjFn; //编辑大标题title
		vm.addLastFirstObj = addLastFirstObjFn; //添加一个大标题在最底部
		vm.moveTopFirst = moveTopFirstFn; //上移
		vm.moveBottomFirst = moveBottomFirstFn; //下移

		vm.addSecondObj = addSecondObjFn; //添加二级标题--评审科目
		vm.deleteSecondObj = deleteSecondObjFn; //删除二级标题
		vm.editSecondObj = editSecondObjFn; //编辑二级标题title
		vm.addLastSecondObj = addLastSecondObjFn; //添加一个二级标题在最底部
		vm.moveTopSecond = moveTopSecondFn; //上移
		vm.moveBottomSecond = moveBottomSecondFn; //下移

		vm.addThirdObj = addThirdObjFn; //添加三级标题--评审题
		vm.deleteThirdObj = deleteThirdObjFn; //删除三级标题
		vm.addLastThirdObj = addLastThirdObjFn; //添加一个三级标题在最底部
		vm.moveTopThird = moveTopThirdFn; //上移
		vm.moveBottomThird = moveBottomThirdFn; //下移

		vm.keycode13 = keycode13Fn; //回车键

		vm.showAlertDialog = showAlertDialogFn; //提交：显示弹框
		vm.alertDialogConfirm = alertDialogConfirmFn; //提交：确定

		/*****************函数 end****************/

		(function init() {

			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("访问出错");
				$state.go("index");
				return false;
			}

			//检查有没有进入此页面的权限
			vm.check();
		})();

		//
		//
		//
		//
		//
		//----------------------------检查有没有进入此页面的权限------------------------------------------
		//
		//
		//
		//
		//
		function checkFn() {
			var params = {
				"user_id": $rootScope.userInfo.id, //用户ID
				"review_sn": $stateParams.review_sn, //表单号
				"order_sn": $stateParams.order_sn //订单号
			}
			examineService.check(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 60010) {
						//正常
					} else {
						window.showAutoDialog(data.data.msg);
						$state.go("personal.home");
					}
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------删除一个项目名称------------------------------------------
		//
		//
		//
		//
		//
		function deleteProjectNameFn($index) {
			vm.projectNameArray.splice($index, 1);
			if (vm.projectNameArray.length == 0) {
				vm.projectNameArray = [""];
			}
		}
		//
		//
		//
		//
		//
		//----------------------------添加一个项目名称------------------------------------------
		//
		//
		//
		//
		//
		function addProjectNameFn($index) {
			vm.projectNameArray.splice($index + 1, 0, "");

			if (vm.projectNameArray.length == 0) {
				vm.projectNameArray = [""];
			}
		}
		//
		//
		//
		//
		//
		//----------------------------动态表单，添加，删除，编辑操作------------------------------------------
		//
		//
		//
		//
		//
		//添加一级标题
		function addFirstObjFn($event, firstObjIndex) {
			var obj = {
				"first_title": vm.first_title,
				"data": [{
					"second_title": vm.second_title,
					"data": [{
						"third_title": "",
						"score": "",
						"remark": ""
					}]
				}]
			}

			//点击左侧按钮进行的添加
			vm.designJson.splice(firstObjIndex + 1, 0, obj);
			//滚动
			setPanelScroll($event);

		}

		//删除一级标题
		function deleteFirstObjFn(firstObjIndex) {
			vm.designJson.splice(firstObjIndex, 1);
			window.showAlertTip("删除成功");
		}

		//编辑一级标题
		function editFirstObjFn($event, firstObjIndex) {
			vm.designJson[firstObjIndex].editStatus = !vm.designJson[firstObjIndex].editStatus;
			//input获取焦点
			$timeout(function() {
				angular.element($event.target).siblings("input").focus();
			}, 10);
		}

		//右侧模块，点击事件--在底部添加一级标题
		function addLastFirstObjFn() {
			var firstLength = vm.designJson.length;
			$timeout(function() {
				angular.element("#add_" + firstLength).click();
			}, 0);
		}

		//添加二级标题
		function addSecondObjFn($event, firstObjIndex, secondObjIndex) {
			var obj = {
				"second_title": vm.second_title,
				"data": [{
					"third_title": "",
					"score": "",
					"remark": ""
				}]
			}

			//点击左侧按钮进行的添加
			vm.designJson[firstObjIndex].data.splice(secondObjIndex + 1, 0, obj);
			//滚动
			setPanelScroll($event);
		}

		//删除二级标题
		function deleteSecondObjFn(firstObjIndex, secondObjIndex) {
			vm.designJson[firstObjIndex].data.splice(secondObjIndex, 1);
			window.showAlertTip("删除成功");
		}

		//右侧模块，点击事件--在底部添加二级标题
		function addLastSecondObjFn() {
			var firstLength = vm.designJson.length;
			var secondLength = vm.designJson[firstLength - 1].data.length;
			$timeout(function() {
				angular.element("#add_" + firstLength + "_" + secondLength).click();
			}, 0);
		}

		//编辑二级标题
		function editSecondObjFn($event, firstObjIndex, secondObjIndex) {
			vm.designJson[firstObjIndex].data[secondObjIndex].editStatus = !vm.designJson[firstObjIndex].data[secondObjIndex].editStatus;
			//input获取焦点
			$timeout(function() {
				angular.element($event.target).siblings("input").focus();
			}, 10);
		}

		//添加三级标题
		function addThirdObjFn($event, firstObjIndex, secondObjIndex, thirdObjIndex) {
			var obj = {
				"third_title": "",
				"score": "",
				"remark": ""
			}

			//点击左侧按钮进行的添加
			vm.designJson[firstObjIndex].data[secondObjIndex].data.splice(thirdObjIndex + 1, 0, obj);
			//滚动
			setPanelScroll($event);

		}

		//删除三级标题
		function deleteThirdObjFn(firstObjIndex, secondObjIndex, thirdObjIndex) {
			vm.designJson[firstObjIndex].data[secondObjIndex].data.splice(thirdObjIndex, 1);
			window.showAlertTip("删除成功");
		}

		//右侧模块，点击事件--在底部添加三级标题
		function addLastThirdObjFn() {
			var firstLength = vm.designJson.length;
			var secondLength = vm.designJson[firstLength - 1].data.length;
			var thirdLength = vm.designJson[firstLength - 1].data[secondLength - 1].data.length;
			$timeout(function() {
				angular.element("#add_" + firstLength + "_" + secondLength + "_" + thirdLength).click();
			}, 0);
		}

		//
		//
		//
		//
		//
		//----------------------------动态表单：上移、下移操作------------------------------------------
		//
		//
		//
		//
		//

		//一级标题：上移
		function moveTopFirstFn(firstObjIndex) {
			if (firstObjIndex == 0) {
				return false;
			} else {
				var pervObjIndex = firstObjIndex - 1; //上一个兄弟元素
				vm.designJson[firstObjIndex] = vm.designJson.splice(pervObjIndex, 1, vm.designJson[firstObjIndex])[0];
				window.showAlertTip("上移完成");
			}
		}

		//一级标题：下移
		function moveBottomFirstFn(firstObjIndex) {
			if (firstObjIndex == vm.designJson.length - 1) {
				return false;
			} else {
				var nextObjIndex = firstObjIndex + 1; //上一个兄弟元素
				vm.designJson[firstObjIndex] = vm.designJson.splice(nextObjIndex, 1, vm.designJson[firstObjIndex])[0];
				window.showAlertTip("下移完成");
			}
		}

		//二级标题：上移
		function moveTopSecondFn(firstObjIndex, secondObjIndex) {
			if (secondObjIndex == 0) {
				return false;
			} else {
				var pervObjIndex = secondObjIndex - 1; //上一个兄弟元素
				vm.designJson[firstObjIndex].data[secondObjIndex] = vm.designJson[firstObjIndex].data.splice(pervObjIndex, 1, vm.designJson[firstObjIndex].data[secondObjIndex])[0];
				window.showAlertTip("上移完成");
			}
		}

		//二级标题：下移
		function moveBottomSecondFn(firstObjIndex, secondObjIndex) {
			if (secondObjIndex == vm.designJson[firstObjIndex].data.length - 1) {
				return false;
			} else {
				var nextObjIndex = secondObjIndex + 1; //上一个兄弟元素
				vm.designJson[firstObjIndex].data[secondObjIndex] = vm.designJson[firstObjIndex].data.splice(nextObjIndex, 1, vm.designJson[firstObjIndex].data[secondObjIndex])[0];
				window.showAlertTip("下移完成");
			}
		}

		//三级标题：上移
		function moveTopThirdFn(firstObjIndex, secondObjIndex, thirdObjIndex) {
			if (thirdObjIndex == 0) {
				return false;
			} else {
				var pervObjIndex = thirdObjIndex - 1; //上一个兄弟元素
				vm.designJson[firstObjIndex].data[secondObjIndex].data[thirdObjIndex] = vm.designJson[firstObjIndex].data[secondObjIndex].data.splice(pervObjIndex, 1, vm.designJson[firstObjIndex].data[secondObjIndex].data[thirdObjIndex])[0];
				window.showAlertTip("上移完成");
			}
		}

		//三级标题：下移
		function moveBottomThirdFn(firstObjIndex, secondObjIndex, thirdObjIndex) {
			if (thirdObjIndex == vm.designJson[firstObjIndex].data[secondObjIndex].data.length - 1) {
				return false;
			} else {
				var nextObjIndex = thirdObjIndex + 1; //上一个兄弟元素
				vm.designJson[firstObjIndex].data[secondObjIndex].data[thirdObjIndex] = vm.designJson[firstObjIndex].data[secondObjIndex].data.splice(nextObjIndex, 1, vm.designJson[firstObjIndex].data[secondObjIndex].data[thirdObjIndex])[0];
				window.showAlertTip("下移完成");
			}
		}
		//
		//
		//
		//
		//
		//----------------------------回车事件、滚动动画------------------------------------------
		//
		//
		//
		//
		//
		function keycode13Fn(e) {
			var keycode = window.event ? e.keyCode : e.which;
			if (keycode == 13) {
				if (e && e.stopPropagation) {
					//因此它支持W3C的stopPropagation()方法
					e.stopPropagation();
					e.preventDefault();
				} else {
					//IE中阻止函数器默认动作的方式   
					window.event.returnValue = false;
					//否则，我们需要使用IE的方式来取消事件冒泡
					window.event.cancelBubble = true;
				}
				angular.element(e.target).blur();
			}
		}

		//添加某一项后，页面滚动
		function setPanelScroll($event) {
			if ($event) {
				var parentDom = angular.element($event.target).closest(".panel-box");
				var scrollHeight = parentDom.offset().top + parentDom.outerHeight();
				$timeout(function() {
					angular.element("html,body").animate({
						"scrollTop": scrollHeight - 60 //这里的60是因为menu导航条浮动在上面，有60px的高度
					}, 500);
				}, 100);
			} else {
				$timeout(function() {
					angular.element("html,body").scrollTop("99999");
				}, 100);
			}
		}

		//
		//
		//
		//
		//
		//----------------------------右侧浮动模块的定位效果------------------------------------------
		//
		//
		//
		//
		//
		(function() {
			var rightDom = angular.element(".right-float-content");
			var windowDom = angular.element(window);
			var rightDomOffsetTop = rightDom.offset().top;
			var rightDomAutoLeft = rightDom.offset().left - windowDom.scrollLeft();

			var time = null;
			window.onscroll = function() {
				clearTimeout(time);
				time = setTimeout(function() {
					//判断滚动条高于默认的高度，这里+60是因为导航条浮动会挡住60px
					if (windowDom.scrollTop() + 60 > rightDomOffsetTop) {
						rightDom.attr("style", "position:fixed;top:80px;right:auto;left:" + rightDomAutoLeft + "px");
					} else if (windowDom.scrollTop() + 60 <= rightDomOffsetTop) {
						rightDom.attr("style", "position:absolute;top:60px;right:0;left:auto");
					};
				}, 10);
			};

			//页面浏览器窗口发生变化时，要重新获取DOM元素的scrollLeft
			window.onresize = function() {
				if (rightDom.css("position") == "fixed") {
					rightDom.attr("style", "position:absolute;top:60px;right:0;left:auto"); //使其恢复absolute定位，然后获取offset().left
				}
				rightDomAutoLeft = rightDom.offset().left - windowDom.scrollLeft();
				$(window).scroll(); //强制触发scroll事件，去重新设置DOM元素的位置
			};
			angular.element(window).resize();
		})();
		//
		//
		//
		//
		//
		//----------------------------显示弹框------------------------------------------
		//
		//
		//
		//
		//
		function showAlertDialogFn() {
			//对话框内容
			var alertDialogObj = {
				alertDialogTitle: "确定提交吗？提交之后不可修改，请谨慎操作！",
				alertDialogConfirm: vm.alertDialogConfirm,
				alertDialogCancel: null, //无值，则使用默认的取消事件
				alertDialogCancelButton: true //显示取消按钮
			}
			$rootScope.$broadcast("public.showAlertDialog", alertDialogObj);
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
		function alertDialogConfirmFn() {

			//防止重复点击
			if (!vm.flag.submitReviewFormFlag) {
				return false;
			}
			
			//隐藏掉所有的弹框
			$rootScope.$broadcast("public.hide", []);

			//检查项目名称
			for (var i = 0; i < vm.projectNameArray.length; i++) {
				if (vm.projectNameArray[i].trim() == "" || !vm.projectNameArray[i]) {
					window.showAutoDialog("请将项目名称填写完整");
					return false;
				}
			}

			if ($rootScope.currentRouter == 'addExamine1') {
				//循环遍历三维数组，检查是否有空项
				for (var a = 0; a < vm.designJson.length; a++) {
					var array1 = vm.designJson[a].data;
					for (var b = 0; b < array1.length; b++) {
						var array2 = array1[b].data;
						for (var c = 0; c < array2.length; c++) {
							if (array2[c].third_title.trim() == "") {
								window.showAutoDialog("有一道题的<span class='color-red'>评分标准</span>没编辑，无法提交<br>题目序号：" + (c + 1));
								return false;
							} else if (!array2[c]["score"] && array2[c]["score"] != '0') {
								window.showAutoDialog("有一道题的<span class='color-red'>分值</span>没编辑，无法提交<br>题目序号：" + (c + 1));
								return false;
							}
						}
					}
				}
			} else if ($rootScope.currentRouter == 'addExamine2') {
				//循环遍历三维数组，检查是否有空项
				for (var a = 0; a < vm.designJson.length; a++) {
					var array1 = vm.designJson[a].data;
					for (var b = 0; b < array1.length; b++) {
						var array2 = array1[b].data;
						//如果含有“请点击”，则停止程序
						if (array1[b].second_title.indexOf("请点击") > -1) {
							window.showAutoDialog("请编辑标题<br>标题序号：" + (b + 1));
							return false;
						}
						for (var c = 0; c < array2.length; c++) {
							if (array2[c].third_title.trim() == "") {
								window.showAutoDialog("有一道题的<span class='color-red'>指标标题</span>没编辑，无法提交<br>题目序号：" + (b + 1) + "." + (c + 1));
								return false;
							} else if (!array2[c]["score"] && array2[c]["score"] != '0') {
								window.showAutoDialog("有一道题的<span class='color-red'>分值</span>没编辑，无法提交<br>题目序号：" + (b + 1) + "." + (c + 1));
								return false;
							}
						}
					}
				}
			} else if ($rootScope.currentRouter == 'addExamine3') {
				//循环遍历三维数组，检查是否有空项
				for (var a = 0; a < vm.designJson.length; a++) {
					var array1 = vm.designJson[a].data;
					//如果含有“请点击”，则停止程序
					if (vm.designJson[a].first_title.indexOf("请点击") == '0') {
						window.showAutoDialog("请编辑大标题<br>标题序号：" + (a + 1));
						return false;
					}
					for (var b = 0; b < array1.length; b++) {
						var array2 = array1[b].data;
						//如果含有“请点击”，则停止程序
						if (array1[b].second_title.indexOf("请点击") == '0') {
							window.showAutoDialog("请编辑评审科目标题<br>标题序号：" + (a + 1) + "." + (b + 1));
							return false;
						}
						for (var c = 0; c < array2.length; c++) {
							if (array2[c].third_title.trim() == "") {
								window.showAutoDialog("有一道题的<span class='color-red'>指标标题</span>没编辑，无法提交<br>题目序号：" + (a + 1) + "." + (b + 1) + "." + (c + 1));
								return false;
							} else if (!array2[c]["score"] && array2[c]["score"] != '0') {
								window.showAutoDialog("有一道题的<span class='color-red'>分值</span>没编辑，无法提交<br>题目序号：" + (a + 1) + "." + (b + 1) + "." + (c + 1));
								return false;
							}
						}
					}
				}
			}

			var params = {
				"user_id": $rootScope.userInfo.id,
				"review_sn": $stateParams.review_sn, //表单号
				"score_title": vm.submitForm.score_title, //评分标题
				"project_number": vm.submitForm.project_number, //项目编号
				"project_name": vm.projectNameArray.join(","), //项目名称
				"review_title": vm.submitForm.review_title, //指引标题
				"review_content": vm.submitForm.review_content, //指引内容
				"review_from": JSON.stringify(vm.designJson) //动态表单内容
			}

			//发布
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.submitReviewFormFlag = false; //设置按钮不可点击
			examineService.submitReviewForm(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							window.showAutoDialog(data.data.msg);

							if ($stateParams.type == "0") {
								$state.go("personal.myReview");
							} else {
								$state.go("personal.myEstimate");
							}

						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					vm.flag.submitReviewFormFlag = true; //设置按钮可点击
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
				}
			});
		}
	}
})();