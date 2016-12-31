/**
 * 作者：林创荣
 * 功能：评审/评估结果
 * 时间：2016年9月27日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/mouseover.directive.js', 'ngMouseOver.directive'); //鼠标经过评分事件
	app.import('/app/Tpl/web/js/service/service_min/examine.service.min.js', 'examine.service'); //引入“评审评估”接口 服务

	app.addController("examineResultController", examineResultController);
	examineResultController.$inject = ['$rootScope', '$window', '$stateParams', 'examineService', '$state', '$timeout'];

	function examineResultController($rootScope, $window, $stateParams, examineService, $state, $timeout) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "评审/评估结果";
		var vm = this;

		/*****************变量 begin****************/

		//判断是评审、还是评估
		if ($stateParams.type == '0') {
			vm.title = "评审结果";
		} else if ($stateParams.type == '1') {
			vm.title = "评估结果";
		}

		vm.projectArray = []; //项目数组
		vm.select_project_id = ""; //选中的项目id

		vm.resultScoreArray = []; //某项目下的分数、专家列表

		vm.maxScore = "--";
		vm.maxProjectName = "--";
		vm.averageScore = "--";

		vm.loaded = false; //判断是否加载过一次接口，计算过总分最高分，平均分

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getReviewDetail = getReviewDetailFn; //获取评审评估详情
		vm.getProjectResultArray = getProjectResultArrayFn; //查询评审评估结果(项目),目的是拿到project_id
		vm.getReviewResult = getReviewResultFn; //查询评审评估项目评分

		/*****************函数 end****************/

		(function init() {

			//需要先登录
			if (!$rootScope.userInfo.id) {
				$state.go("login");
				return false;
			}

			vm.getReviewDetail(); //获取评审评估详情
			vm.getProjectResultArray(); ////查询该用户对应的评分表下的项目数据

		})();

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
							vm.reviewInfo = data.data.list; //基本信息，用于显示界面上的表名，表编号
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
		//----------------------------查询评审评估结果(项目),目的是拿到project_id------------------------------------------
		//
		//
		//
		//
		//
		function getProjectResultArrayFn() {

			var params = {
				"user_id": $rootScope.userInfo.id, //用户ID
				"review_id": $stateParams.review_id //vm.reviewInfo.id //表单号
			}

			examineService.getProjectResultArray(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {

						vm.projectArray = data.data.list; //项目数组
						vm.select_project_id = data.data.list[0].id; //默认选中第一个

						vm.getReviewResult(); //查询评审评估项目评分

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
		//----------------------------查询评审评估项目评分------------------------------------------
		//
		//
		//
		//
		//
		function getReviewResultFn() {
			var params = {
				"user_id": $rootScope.userInfo.id, //用户ID
				"review_id": $stateParams.review_id, // vm.reviewInfo.id, //表单号
				"project_id": vm.select_project_id //项目id
			}

			$rootScope.$broadcast("public.show", ["loading_panel"]);
			examineService.getReviewResult(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {

							var allProjectNameArray = data.data.project_name; //整个表单的所有评分项目（比如：一个表单有3个项目，有4个专家评过分，则“所有评分项目”为  3 * 4 = 12 ）
							var allScoreArray = data.data.all; //整个表单的评分（比如：一个表单有3个项目，有4个专家评过分，则“所有评分”为  3 * 4 = 12）
							var thisProjectUserArray = data.data.user; //某个项目的所有专家
							var thisProjectScoreArray = data.data.list; //某个项目的所有专家，对此项目的评分列表

							if (vm.loaded == false) {

								vm.loaded = true; //设置为处理过一次数据了

								var size = vm.projectArray.length; //计算出该表单有多少个项目（比如，一个表单有3个项目，则 这里就是 3）
								var allProjectScoreArray = [];
								for (var i = 0; i < size; i++) {
									allProjectScoreArray.push([]); //插入空数组
								}
								//此时，allProjectScoreArray = [ [] , [] , [] ]
								for (var i = 0; i < allProjectNameArray.length; i++) {
									for (var j = 0; j < size; j++) {
										//如果 “项目A” == “项目A”
										if (allProjectNameArray[i] == vm.projectArray[j].project_name) {
											allProjectScoreArray[j].push({
												"project_name": allProjectNameArray[i],
												"score": allScoreArray[i]
											});
										}
									}
								}

								(function() {
									var max = 0; //最高分
									var allScore = 0; //总分
									var finalScoreArray = [];
									for (var i = 0; i < allProjectScoreArray.length; i++) {
										var finalScore = 0;
										for (var j = 0; j < allProjectScoreArray[0].length; j++) {
											finalScore += allProjectScoreArray[i][j]["score"];
										}
										finalScoreArray[i] = finalScore;
									}
									//1.计算项目最高平均分
									vm.maxScore = Math.max.apply(null, finalScoreArray); //最高分
									vm.maxProjectName = allProjectScoreArray[finalScoreArray.indexOf(vm.maxScore)][0]["project_name"]; //最高分的项目名称
									//console.log(vm.maxScore);
									//console.log(vm.maxProjectName);

									//2.计算表单平均分
									if (finalScoreArray.length <= 2) {
										//如果项目数量为1-2个，则直接计算平均分
										for (var k = 0; k < finalScoreArray.length; k++) {
											allScore += parseInt(finalScoreArray[k]);
										}
										vm.averageScore = allScore / finalScoreArray.length; //平均分
									} else {
										//如果项目数量大于、等于3个
										for (var k = 1; k < finalScoreArray.length - 1; k++) {
											allScore += parseInt(finalScoreArray[k]);
										}
										vm.averageScore = allScore / (finalScoreArray.length - 2); //平均分
									}

								})();

							}

							//3.某项目的详细评分  数组赋值
							(function() {
								var resultScoreArray = [];
								for (var i = 0; i < thisProjectScoreArray.length; i++) {
									resultScoreArray.push({
										"username": thisProjectUserArray[i],
										"score": thisProjectScoreArray[i]
									});
								}
								vm.resultScoreArray = resultScoreArray;
							})();

						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {
					console.log(e.message);
				} finally {
					//给个1秒左右的延迟，防止页面闪烁
					$timeout(function() {
						$rootScope.$broadcast("public.hide", ["loading_panel"]);
					}, 800);
				}

			});
		}

	}
})();