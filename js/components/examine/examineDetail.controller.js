/**
 * 作者：林创荣
 * 功能：项目评审
 * 时间：2016年9月27日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/mouseover.directive.js', 'ngMouseOver.directive'); //鼠标经过评分事件
	app.import('/app/Tpl/web/js/service/service_min/examine.service.min.js', 'examine.service'); //引入“评审评估”接口 服务

	app.addController("examineDetailController", examineDetailController);
	examineDetailController.$inject = ['$rootScope', '$window', '$stateParams', 'examineService', '$state'];

	function examineDetailController($rootScope, $window, $stateParams, examineService, $state) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "项目评审";
		var vm = this;

		/*****************变量 begin****************/

		//判断是评审、还是评估
		if ($stateParams.type == '0') {
			vm.title = "评审";
		} else if ($stateParams.type == '1') {
			vm.title = "评估";
		}

		vm.showPanel = '1'; //默认显示评审通知界面
		vm.reviewInfo = {};
		vm.designJson = [];
		vm.review_template = $stateParams.review_template; //模板1，2，3

		vm.flag = {
			submitFlag: true, //提交评分标识量
		}

		vm.activeProject = {}; //被评分的项目

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.setPanel = setPanelFn; //设置模块可见不可见
		vm.getReviewDetail = getReviewDetailFn; //获取评审评估详情
		vm.getProjectArray = getProjectArrayFn; //查询该用户对应的评分表下的项目A,B,C的相关数据...

		vm.getArray = getArrayFn; //根据最大值，生成数组;

		vm.showAlertDialog = showAlertDialogFn; //提交显示复杂弹框
		vm.alertDialogConfirm = alertDialogConfirmFn; //确定函数

		/*****************函数 end****************/

		(function init() {

			//需要先登录
			if (!$rootScope.userInfo.id) {
				$state.go("login");
				return false;
			}

			vm.getReviewDetail();
		})();

		//
		//
		//
		//
		//
		//----------------------------模块切换：评审通知 、评分界面------------------------------------------
		//
		//
		//
		//
		//
		function setPanelFn(param) {
			vm.showPanel = param;
			angular.element($window).scrollTop(0);
		}

		//
		//
		//
		//
		//
		//----------------------------获取评审评估详情------------------------------------------
		//
		//
		//
		//
		//
		function getReviewDetailFn() {
			var params = {
				"user_id": $rootScope.userInfo.id, //用户ID
				"review_sn": $stateParams.review_sn //表单号
			}

			examineService.getReviewDetail(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						if (!!data.data.list) {
							vm.reviewInfo = data.data.list; //基本信息

							//只有“专家”、“评审发起人”能进入此页面
							if ($rootScope.userInfo.identity_conditions == "1" || vm.reviewInfo.user_id == $rootScope.userInfo.id) {
								vm.designJson = JSON.parse(data.data.list.review_from.toString()); //自定义表单
								vm.getProjectArray(); //查询该用户对应的评分表下的项目数据
							} else {
								window.showAutoDialog("无访问权限");
								$state.go("index");
								return false;
							}

						} else {
							//无数据
							window.showAutoDialog("访问出错，可能表单未设置");
							$state.go("index");
						}
					} else {
						window.showAutoDialog(data.data.msg);
						$state.go("index");
					}
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------查询该用户对应的评分表下的项目A,B,C的相关数据...------------------------------------------
		//
		//
		//
		//
		//
		function getProjectArrayFn() {
			var params = {
				"user_id": $rootScope.userInfo.id, //用户ID
				"review_id": vm.reviewInfo.id //表单号
			}
			examineService.getProjectArray(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {

						vm.projectArray = data.data.list; //项目名称数组
						//设置当前页面所需要处理的项目（如：评分项目A,B,C）
						var count = 0;
						for (var i = 0; i < vm.projectArray.length; i++) {
							if (vm.projectArray[i].status == '0') {
								vm.activeProject = vm.projectArray[i];
								//如果第一个已经评过分了，则不要显示评审通知界面，直接显示评分界面
								if (i >= 1) {
									vm.showPanel = "2";
								}
								break;
							} else {
								count++;
							}

						}

						//如果以下成立，则说明所有项目已经全部评完，跳转到“评分结果页面”
						if (count == vm.projectArray.length) {
							$state.go("finalScore", {
								'review_id': vm.reviewInfo.id
							});
						}

					} else if (data.data.code == "40003") {
						window.showAutoDialog(data.data.msg);
						$state.go("index");
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
		//-----------------------------根据最大值，返回一个数组-----------------------------------------
		//
		//
		//
		//
		//
		function getArrayFn(max) {
			var newArray = [];
			for (var i = 0; i <= max; i++) {
				newArray.push(i);
			}
			return newArray;
		}

		//
		//
		//
		//
		//
		//-----------------------------显示弹框-----------------------------------------
		//
		//
		//
		//
		//
		function showAlertDialogFn(param) {
			//对话框内容
			var alertDialogObj = {
				alertDialogTitle: "提交后不可重新修改评分，确定提交对该项目的评分吗？",
				alertDialogConfirm: vm.alertDialogConfirm,
				alertDialogCancel: null, //无值，则使用默认的取消事件
				alertDialogCancelButton: true //显示取消按钮
			}

			//显示弹框
			$rootScope.$broadcast("public.showAlertDialog", alertDialogObj);
		}
		//
		//
		//
		//
		//
		//-----------------------------确定提交-----------------------------------------
		//
		//
		//
		//
		//
		function alertDialogConfirmFn() {

			//发起者，不能自己评分
			if (vm.reviewInfo.user_id == $rootScope.userInfo.id) {
				window.showAlertTip("发起者不可评分");
				return false;
			}

			//防止重复点击
			if (!vm.flag.submitFlag) {
				return false;
			}

			//隐藏掉所有弹框
			$rootScope.$broadcast("public.hide", []);

			//循环遍历三维数组，检查是否有哪些题，没进行评分
			for (var a = 0; a < vm.designJson.length; a++) {
				var array1 = vm.designJson[a].data;
				for (var b = 0; b < array1.length; b++) {
					var array2 = array1[b].data;
					for (var c = 0; c < array2.length; c++) {
						if (!array2[c]["valid_points"] && array2[c]["valid_points"] != '0') {
							//分数为空，不可提交
							if ($stateParams.review_template == "1") {
								//模板1
								window.showAutoDialog("有一道题的<span class='color-red'>分值</span>没编辑，无法提交<br>题目序号：" + (c + 1));
							} else if ($stateParams.review_template == "2") {
								//模板2
								window.showAutoDialog("有一道题的<span class='color-red'>分值</span>没编辑，无法提交<br>题目序号：" + (b + 1) + "." + (c + 1));
							} else if ($stateParams.review_template == "3") {
								//模板3
								window.showAutoDialog("有一道题的<span class='color-red'>分值</span>没编辑，无法提交<br>题目序号：" + (a + 1) + "." + (b + 1) + "." + (c + 1));
							}
							return false;
						} else if (array2[c]["valid_points"] > array2[c]["score"]) {
							//超过最高分，不可提交
							window.showAutoDialog("分值超过最高分，无法提交<br>题目序号：" + (c + 1));
							return false;
						}
					}
				}
			}

			//参数
			var params = {
				"user_id": $rootScope.userInfo.id, //用户id
				"review_id": vm.reviewInfo.id, //表单ID
				"project_id": vm.activeProject.id, //评审项目标题ID
				"review_data": JSON.stringify(vm.designJson), //评分多维数组
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.submitFlag = false;
			//接口请求
			examineService.submitScore(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if (data.data.code == 20000) {
							window.showAlertTip(data.data.msg);
							//刷新本页面
							$state.reload();
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {
					//TODO handle the exception
				} finally {
					//隐藏：加载动画
					$rootScope.$broadcast("public.hide", ['loading_panel']);
					vm.flag.submitFlag = true;
				}
			});
		}

	}
})();