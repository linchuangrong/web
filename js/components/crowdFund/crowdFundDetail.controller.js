/**
 * 作者：林创荣
 * 功能：公益众筹
 * 时间：2016年10月8日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/crowdFund.service.min.js', 'crowdFund.service'); //引入“众筹”接口 服务
	app.import('/app/Tpl/web/js/service/service_min/comment.service.min.js', 'comment.service'); //引入“评论”接口 服务
	app.import('/app/Tpl/web/js/directive/pagebar.directive.js', 'pagebar.directive'); //分页插件
	app.import('/app/Tpl/web/js/directive/imgUpload.directive.js', 'imgUpload.directive'); //图片上传插件

	app.addController("crowdFundDetailController", crowdFundDetailController);
	crowdFundDetailController.$inject = ['$rootScope', '$window', '$timeout', '$stateParams', 'crowdFundService', '$state', 'commentService'];

	function crowdFundDetailController($rootScope, $window, $timeout, $stateParams, crowdFundService, $state, commentService) {
		angular.element($window).scrollTop(0);
		$rootScope.title = "众筹详情";
		var vm = this;

		/*****************变量 begin****************/

		vm.activePanel = "detail"; //默认显示详情

		vm.focusFlag = false; //标识量，用户是否收藏了活动。  1：收藏；0：未收藏；

		//项目进展数组
		vm.projectProgressArray = [];

		//添加项目进展
		vm.projectProgressDesc = ""; //项目进展：描述
		vm.projectImgArray = []; //项目进展：图片

		//评论分页参数
		vm.commentPageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 8, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: commentPageChangeFn //切换页面函数
		}
		vm.commentArray = []; //评论数组
		vm.comment_count = 0; //默认是0条评论记录
		vm.replyPlaceholder = "";
		vm.showCommentBoxIndex = -1; //默认所有的“评论输入框”都是隐藏的
		vm.showReplyBoxIndex = -1; //默认所有的“回复输入框”都是隐藏的，大评论的下标index,用来控制哪个模块下面，可以出现textarea输入框
		vm.replyPlaceholderIndex = -1; //设置“二次点击同一个人”进行回复时，“回复输入框”隐藏掉
		vm.commentText = ""; //回复一级文本的textarea
		vm.replyText = ""; //回复二级文本的textarea，页面存在两个textarea都是ng-model="replyText"

		//提交按钮标识量
		vm.flag = {
			addProjectProgressFlag: true, //标识量，默认允许发布项目进展
			addCommentFlag: true, //允许添加评论
			addReplyFlag: true, //允许回复评论
			creatFreeOrderFlag: true, //创建无私奉献订单
		}

		//主办方信息
		vm.sponsorInfo = {};

		//回报数组
		vm.repayArray = [];

		//支持者数组
		vm.peopleArray = [];
		vm.peopleCount = "0";
		//支持者分页参数
		vm.peoplePageParams = {
			showPage: 5, //显示多少个页码提供用户点击，不会变
			pageSize: 8, //1页显示的数量,不会变
			current: 1, //当前页
			page_count: 1, //总共多少页
			pageChange: peoplePageChangeFn //切换页面函数
		}

		vm.freeMoney = 1; //自由捐赠钱

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getUserFocusFlag = getUserFocusFlagFn; //判断用户是否已经收藏了众筹
		vm.focusCrowdFund = focusCrowdFundFn; //收藏

		vm.getCrowdFundDetail = getCrowdFundDetailFn; //众筹详情

		vm.setActivePanel = setActivePanelFn; //切换选项卡

		vm.deleteImage = deleteImageFn; //删除图片

		vm.addProjectProgress = addProjectProgressFn; //添加项目进展

		vm.setCommentBox = setCommentBoxFn; //显示或隐藏“评论输入框”--‘B用户’回复‘A用户’
		vm.setReplyBox = setReplyBoxFn; //显示或隐藏“回复输入框”
		vm.getCommentList = getCommentListFn; //获取评论一级列表、分页
		vm.getReplyList = getReplyListFn; //获取评论二级列表
		vm.addComment = addCommentFn; //添加评论
		vm.addReply = addReplyFn; //添加回复

		vm.getPeopleList = getPeopleListFn; //项目支持者列表

		vm.toggleImageWidth = toggleImageWidthFn; //图片放大，缩小

		vm.addFreeMoney = addFreeMoneyFn; //无私奉献
		vm.creatFreeOrder = creatFreeOrderFn; //创建无私奉献订单
		vm.goToOrderPage = goToOrderPageFn; //去下单

		/*****************函数 end****************/

		(function init() {
			vm.getCrowdFundDetail(); //众筹详情

			if (!!$rootScope.userInfo.id) {
				vm.getUserFocusFlag(); //判断用户是否已经收藏了众筹
			}

			vm.getPeopleList(); //获取项目支持者列表

			vm.getCommentList(); //加载评论列表

		})();

		//
		//
		//
		//
		//
		//----------------------------判断用户是否已经收藏了众筹------------------------------------------
		//
		//
		//
		//
		//
		function getUserFocusFlagFn() {
			var params = {
				"deal_id": $stateParams.crowdFundId,
				"user_id": $rootScope.userInfo ? $rootScope.userInfo["id"] : ""
			}
			crowdFundService.getUserFocusFlag(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.focusFlag = (data.data.status == 1 ? true : false);
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
		//----------------------------收藏------------------------------------------
		//
		//
		//
		//
		//
		function focusCrowdFundFn() {

			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("请先登录");
				return false;
			}

			var params = {
				deal_id: $stateParams.crowdFundId,
				user_id: $rootScope.userInfo.id,
				username: $rootScope.userInfo.user_name
			}
			crowdFundService.focusCrowdFund(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						//修改标识量
						vm.focusFlag = data.data.status;
						window.showAlertTip(data.data.msg);
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
		//----------------------------众筹详情------------------------------------------
		//
		//
		//
		//
		//
		function getCrowdFundDetailFn() {
			var params = {
				"id": $stateParams.crowdFundId,
				"username": $rootScope.userInfo["user_name"] ? $rootScope.userInfo["user_name"] : ""
			}
			crowdFundService.detail(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						//众筹详情
						vm.crowdFundInfo = data.data.list[0];

						//项目进展
						vm.projectProgressArray = data.data.deal_log;
						(function() {
							for (var i = 0; i < vm.projectProgressArray.length; i++) {
								if (!!vm.projectProgressArray[i].image) {
									vm.projectProgressArray[i]["imgArray"] = vm.projectProgressArray[i].image.split(',');
								}
							}
						})();

						//主办方信息
						vm.sponsorInfo = data.data.sponsor[0];

						//回报数组
						vm.repayArray = data.data.item;

						//百度分享
						window._bd_share_config = {
							"common": {
								"bdSnsKey": {
									"tsina": "89d1afaf46168b260f0a8adee885f71d",
									"tqq": "c4ea495e3ee3f424b0118f72de250fb4"
								},
								"bdSign": "off",
								"bdMini": "2",
								"bdMiniList": false,
								"bdStyle": "0",
								"bdSize": "24",
								"bdText": vm.crowdFundInfo.name, //标题
								"bdPic": vm.crowdFundInfo.image, //图片
								"bdComment": vm.crowdFundInfo.brief //简介
							},
							"share": {}
						};
						window._bd_share_main = null; //如果不设置这句话，会导致第二次进入页面，无法出现分享图标
						var path = '/static/api/js/share.js?v=89860593.js?cdnversion=' + ~(-new Date() / 36e5);
						$("body").append("<script defer async='true' src='" + path + "'></script>");
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
		//----------------------------切换选项卡------------------------------------------
		//
		//
		//
		//
		//
		function setActivePanelFn(param) {
			vm.activePanel = param;
		}
		//
		//
		//
		//
		//
		//-------------------------------删除数组里的某一张图片---------------------------------------
		//
		//
		//
		//
		//
		function deleteImageFn(arrayName, $index) {
			vm[arrayName].splice($index, 1);
		}
		//
		//
		//
		//
		//
		//-------------------------------添加一条项目进展---------------------------------------
		//
		//
		//
		//
		//
		function addProjectProgressFn() {

			if (!vm.flag.addProjectProgressFlag) {
				return false;
			}

			if (!vm.projectProgressDesc) {
				window.showAlertTip("请先添加一些文字描述");
				return false;
			}

			var params = {
				"user_id": $rootScope.userInfo.id,
				"deal_id": $stateParams.crowdFundId,
				"username": $rootScope.userInfo.user_name,
				"comment_data": vm.projectProgressDesc,
				"image": vm.projectImgArray.join(",")
			}

			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.addProjectProgressFlag = false;
			crowdFundService.addProjectProgress(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							window.showAutoDialog(data.data.msg);
							$state.reload();
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {
					//TODO handle the exception
				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.addProjectProgressFlag = true;
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------获取评论一级列表、分页------------------------------------------
		//
		//
		//
		//
		//
		function getCommentListFn() {
			var params = {
				deal_id: $stateParams.crowdFundId,
				pageSize: vm.commentPageParams.pageSize,
				current: vm.commentPageParams.current
			}
			commentService.getCommentList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if (data.data.code == 20000) {
						vm.commentArray = data.data.list; //评论数组
						vm.commentPageParams.page_count = data.data.page_count; //总页数
						vm.comment_count = data.data.comment_count; //一级评论总数

						//获取二级回复数组
						var pidArray = [];
						for (var i = 0; i < vm.commentArray.length; i++) {
							pidArray.push(vm.commentArray[i].id);
						}
						vm.getReplyList(pidArray);

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
		//----------------------------获取评论二级列表------------------------------------------
		//
		//
		//
		//
		//
		function getReplyListFn(pidArray) {
			var params = {
				"pid": pidArray.join(',')
			}
			commentService.getReplyList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
				} else {
					if (data.data.code == 20000) {
						for (var i = 0; i < pidArray.length; i++) {
							//往一级评论里，插入二级评论数组
							vm.commentArray[i]["list"] = data.data.list[pidArray[i]];
						}
						console.log(vm.commentArray);
					} else {
						window.showAutoDialog(data.data.msg);
					}
				}
			})
		}
		//
		//
		//
		//
		//
		//----------------------------获取评论列表 分页------------------------------------------
		//
		//
		//
		//
		//
		function commentPageChangeFn() {
			return function(param) {
				if (parseInt(param) > 0 && parseInt(param) <= vm.commentPageParams.page_count) {
					//修改页码
					vm.commentPageParams.current = parseInt(param);
					//获取数据
					vm.getCommentList();
					//滚动到顶部
					angular.element($window).scrollTop(0);
				} else {
					console.log("输入非法");
				}
			}
		}
		//
		//
		//
		//
		//
		//-------------------------------显示评论框---------------------------------------
		//
		//
		//
		//
		//
		function setCommentBoxFn($event, pid, reply_user_id, reply_nickname, $index) {

			vm.pid = pid;
			vm.reply_user_id = reply_user_id;
			vm.reply_nickname = reply_nickname;

			//为了美观性，每次点击任何一个“评论”按钮，都要将“回复输入框”隐藏掉
			vm.showReplyBoxIndex = -1;
			vm.replyPlaceholderIndex = -1;

			if (vm.showCommentBoxIndex == $index) {
				vm.showCommentBoxIndex = -1;
			} else {
				vm.showCommentBoxIndex = $index;
				$timeout(function() {
					angular.element($event.target).closest("li").find("li.answer-item:first").find("textarea").focus();
				}, 100);
			}
		}
		//
		//
		//
		//
		//
		//-------------------------------显示回复框---------------------------------------
		//
		//
		//
		//
		//
		//$event 事件源
		//reply_nickname 被回复的用户名
		//parentIndex 此条大评论的下标index,用来控制哪个模块下面，可以出现textarea输入框
		//index 被回复对象的下标index
		function setReplyBoxFn($event, pid, reply_user_id, reply_nickname, parentIndex, index) {

			vm.pid = pid;
			vm.reply_user_id = reply_user_id;
			vm.reply_nickname = reply_nickname;

			//为了美观性，每次点击任何一个“回复”按钮，都要将“评论输入框”隐藏掉
			vm.showCommentBoxIndex = -1;

			//重复点击同一人进行回复，需要隐藏掉
			if (vm.showReplyBoxIndex == parentIndex && vm.replyPlaceholderIndex == index) {
				vm.showReplyBoxIndex = -1; //隐藏
				vm.replyPlaceholderIndex = -1; //“回复输入框”隐藏后，需要初始化“被回复对象”的下标
			} else {
				vm.showReplyBoxIndex = parentIndex;
				vm.replyPlaceholderIndex = index;
				vm.replyPlaceholder = "回复 " + reply_nickname;
				$timeout(function() {
					angular.element($event.target).closest("ul").find("li:last").find("textarea").focus();
				}, 0);
			}
		}
		//
		//
		//
		//
		//
		//----------------------------添加评论------------------------------------------
		//
		//
		//
		//
		//
		function addCommentFn() {

			if (!vm.flag.addCommentFlag) {
				return false;
			}

			//文本为空时，阻止评论
			if (vm.commentText.toString().trim().length == 0) {
				return false;
			}

			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("请先登录");
				return false;
			}

			var params = {
				"deal_id": $stateParams.crowdFundId,
				"user_id": $rootScope.userInfo.id,
				"nickname": $rootScope.userInfo.nickname,
				"content": vm.commentText
			}
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.addCommentFlag = false;
			commentService.addComment(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if (data.data.code == 20000) {
							window.showAlertTip(data.data.msg);
							$state.reload();
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.addCommentFlag = true;
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------添加回复------------------------------------------
		//
		//
		//
		//
		//
		function addReplyFn() {

			if (!vm.flag.addReplyFlag) {
				return false;
			}

			//文本为空时，阻止评论
			if (vm.replyText.toString().trim().length == 0) {
				return false;
			}

			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("请先登录");
				return false;
			}

			var params = {
				"deal_id": $stateParams.crowdFundId,
				"user_id": $rootScope.userInfo.id,
				"nickname": $rootScope.userInfo.nickname,
				"content": vm.replyText,
				"pid": vm.pid,
				"reply_user_id": vm.reply_user_id,
				"reply_nickname": vm.reply_nickname
			}
			console.log(params);
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.addReplyFlag = false;
			commentService.addComment(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if (data.data.code == 20000) {
							window.showAlertTip(data.data.msg);
							$state.reload();
						} else {
							window.showAutoDialog(data.data.msg);
						}
					}
				} catch (e) {

				} finally {
					$rootScope.$broadcast("public.hide", ["loading_panel"]);
					vm.flag.addReplyFlag = true;
				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------支持者------------------------------------------
		//
		//
		//
		//
		//
		function getPeopleListFn() {
			var params = {
				deal_id: $stateParams.crowdFundId, //众筹id
				pageSize: vm.peoplePageParams.pageSize,
				current: vm.peoplePageParams.current
			}
			crowdFundService.getPeopleList(params).success(function(data) {
				if (data.ret != 200) {
					window.showAutoDialog(data.msg);
					return false;
				} else {
					if (data.data.code == 20000) {
						vm.peopleArray = data.data.list;
						vm.peopleCount = data.data.count_num;
						vm.peoplePageParams.page_count = data.data.page_count;
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
		//-------------------------------支持者 分页---------------------------------------
		//
		//
		//
		//
		//
		function peoplePageChangeFn() {
			return function(param) {
				if (parseInt(param) > 0 && parseInt(param) <= vm.peoplePageParams.page_count) {
					//修改页码
					vm.peoplePageParams.current = parseInt(param);
					//获取数据
					vm.getPeopleList();
					//滚动到顶部
					angular.element($window).scrollTop(0);
				} else {
					console.log("输入非法");
				}
			}
		}
		//
		//
		//
		//
		//
		//----------------------------图片放大，缩小------------------------------------------
		//
		//
		//
		//
		//
		function toggleImageWidthFn($event) {
			var _this = angular.element($event.target);
			if (_this.hasClass("width100")) {
				_this.removeClass("width100");
			} else {
				angular.element("img[toggle].width100").removeClass("width100");
				_this.addClass("width100");
			}
		}
		//
		//
		//
		//
		//
		//----------------------------无私奉献------------------------------------------
		//
		//
		//
		//
		//
		function addFreeMoneyFn(price) {

			if (!$rootScope.userInfo.id) {
				$state.go("login");
				return false;
			}

			if (+price > 0) {
				var params = {
					"deal_id": $stateParams.crowdFundId,
					"user_id": $rootScope.userInfo.id,
					"item_id": 0,
					"price": price,
					"is_invoice": 0,
					"invoice_title": "",
					"address_id": ""
				}

				//创建无偿订单
				vm.creatFreeOrder(params);
			}

		}
		//
		//
		//
		//
		//
		//----------------------------创建无偿订单------------------------------------------
		//
		//
		//
		//
		//
		function creatFreeOrderFn(params) {

			//防止重复提交
			if (vm.flag.creatFreeOrderFlag == false) {
				return false;
			}

			//显示：加载动画
			$rootScope.$broadcast("public.show", ['loading_panel']);
			vm.flag.creatFreeOrderFlag = false;
			//接口请求
			crowdFundService.creatOrderSubmit(params).success(function(data) {
				try {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							$state.go("payMoney", {
								"id": data.data.list.requestNo,
								"price": data.data.list.deal_price,
								"num": '1',
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
					vm.flag.creatFreeOrderFlag = true;

				}
			});
		}
		//
		//
		//
		//
		//
		//----------------------------去下单------------------------------------------
		//
		//
		//
		//
		//
		function goToOrderPageFn(item_id, price) {

			if (!$rootScope.userInfo.id) {
				$state.go("login");
				return false;
			}

			var params = {
				"deal_id": $stateParams.crowdFundId,
				"user_id": $rootScope.userInfo.id,
				"item_id": item_id,
				"price": price
			}
			$state.go("crowdFundOrder", params);
		}

	}
})();