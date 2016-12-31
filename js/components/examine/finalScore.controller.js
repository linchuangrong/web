/**
 * 作者：林创荣
 * 功能：评分结果（个人）
 * 时间：2016年12月22日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/examine.service.min.js', 'examine.service'); //引入“评审评估”接口 服务

	app.addController("finalScoreController", finalScoreController);
	finalScoreController.$inject = ['$rootScope', '$window', 'examineService', '$stateParams', '$state', '$timeout'];

	function finalScoreController($rootScope, $window, examineService, $stateParams, $state, $timeout) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "评分结果（个人）";
		var vm = this;

		/*****************变量 begin****************/

		vm.projectArray = [];
		vm.project_id = ""; //选中的项目id
		vm.projectDetailArray = [];

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getReviewScoreAverage = getReviewScoreAverageFn; //1.查询个人评审评估总分平均分
		vm.getProjectArray = getProjectArrayFn; //2.查询评分表下的项目A,B,C...
		vm.getProjectScore = getProjectScoreFn; //3.查询某项目A的评分结果

		/*****************函数 end****************/

		(function init() {

			//需要先登录
			if (!$rootScope.userInfo.id) {
				$state.go("login");
				return false;
			}

			vm.getReviewScoreAverage(); //查询个人评审评估总分平均分

		})();

		//
		//
		//
		//
		//
		//----------------------------查询个人评审评估总分平均分------------------------------------------
		//
		//
		//
		//
		//
		function getReviewScoreAverageFn() {
			var params = {
				"user_id": $rootScope.userInfo.id, //用户ID
				"review_id": $stateParams.review_id //表单号
			}

			examineService.getReviewScoreAverage(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.finalScoreArray = data.data.average_points;
						vm.maxScore = Math.max.apply(null, vm.finalScoreArray);

						vm.getProjectArray(); //获取评分项目数组
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
		//----------------------------查询评分表下的项目A,B,C...------------------------------------------
		//
		//
		//
		//
		//
		function getProjectArrayFn() {
			var params = {
				"user_id": $rootScope.userInfo.id, //用户ID
				"review_id": $stateParams.review_id //表单号
			}

			examineService.getProjectArray(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {

						vm.projectArray = data.data.list; //项目数组
						vm.project_id = data.data.list[0].id; //默认选中第一个

						//如果最后一个项目的status不等于1，说明该表没评完，不可以查看评分。
						if (vm.projectArray[vm.projectArray.length - 1].status != '1') {
							window.showAutoDialog("未评完所有项目（题目），不可查看评分结果");
							$state.go("index");
							return false;
						}

						vm.getProjectScore(); //查询某项目A的评分结果

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
		//----------------------------查询某项目A的评分结果------------------------------------------
		//
		//
		//
		//
		//
		function getProjectScoreFn() {
			var params = {
				"user_id": $rootScope.userInfo.id, //用户ID
				"project_id": vm.project_id //表单号
			}

			$rootScope.$broadcast("public.show", ["loading_panel"]);
			examineService.getProjectScore(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//某个项目的评分结果
							vm.projectDetailArray = data.data.list;

							//这个项目的名称
							vm.thisProjectName = data.data.list[0].project_name;

							//这个项目的评分总分
							vm.thisProjectScore = data.data.sum_score;

							//这个项目的满分总分
							(function() {
								var allScore = 0;
								for (var i = 0; i < vm.projectDetailArray.length; i++) {
									allScore = allScore + parseInt(vm.projectDetailArray[i].score);
								}
								vm.thisProjectAllScore = allScore;
							})();

						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					//给个1秒左右的延迟，防止页面闪烁
					$timeout(function() {
						$rootScope.$broadcast("public.hide", ["loading_panel"]);
					}, 1000, true);
				}

			});
		}
	}
})();