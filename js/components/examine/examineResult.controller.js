/**
 * 作者：林创荣
 * 功能：评审/评估结果
 * 时间：2016年9月27日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/directive/mouseover.directive.js', 'ngMouseOver.directive'); //鼠标经过评分事件
	app.import('/app/Tpl/web/js/service/examine.service.js', 'examine.service'); //引入“评审评估”接口 服务

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
							vm.reviewInfo = data.data.list; //基本信息

							vm.getProjectResultArray(); //查询该用户对应的评分表下的项目数据
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
				"review_id": vm.reviewInfo.id //表单号
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
				"review_id": vm.reviewInfo.id, //表单号
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
							//数组赋值
							var resultScoreArray = [];
							for (var i = 0; i < data.data.list.length; i++) {
								resultScoreArray.push({
									"username": data.data.user[i],
									"score": data.data.list[i]
								});
							}
							vm.resultScoreArray = resultScoreArray;
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

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