/**
 * 作者：林创荣
 * 功能：登录
 * 时间：2016年9月13日
 */
(function() {
	'use strict';

	app.import('/app/Tpl/web/js/service/service_min/activity.service.min.js', 'activity.service'); //引入“个人中心”接口 服务
	app.import('/app/Tpl/web/js/directive/tooltip.directive.js', 'tooltip.directive'); //引入“tooltip”插件
	app.import('/app/Tpl/web/js/service/service_min/comment.service.min.js', 'comment.service'); //引入“评论”接口 服务

	app.addController("activityDetailController", activityDetailController);
	activityDetailController.$inject = ['$rootScope', '$timeout', '$window', '$stateParams', 'activityService', '$http', 'commentService', '$state'];

	function activityDetailController($rootScope, $timeout, $window, $stateParams, activityService, $http, commentService, $state) {
		angular.element($window)
			.scrollTop(0);
		$rootScope.title = "活动详情";
		var vm = this;

		/*****************变量 begin****************/

		vm.activePanel = "detail"; //默认显示详情

		vm.activityInfo = {}; //活动详情
		vm.sponsorInfo = {}; //主办方信息
		vm.freeTicketArray = []; //免费票
		vm.chargeTicketArray = []; //收费票
		vm.tagsArray = []; //活动标签
		vm.selectTicketId = "";
		vm.focusFlag = false; //标识量，用户是否收藏了活动。  1：收藏；0：未收藏；

		vm.show = {
			joinDialog: false
		};

		vm.flag = {
			"joinFormFlag": true, //允许提交报名表
			addCommentFlag: true, //允许添加评论
			addReplyFlag: true, //允许回复评论
		}

		vm.joinForm = {
			nickname: "", //报名名称
			mobile: "", //报名联系手机
			email: "", //报名联系邮箱
			company: "", //报名公司名
			qq: "", //报名联系QQ
			wechat: "", //报名联系微信
			sex: "", //性别
			age: "", //年龄
			department: "", //部门
			job: "", //职务
			address: "" //地址 	

		}

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

		/*****************变量 end****************/

		/*****************函数 begin****************/

		vm.getUserFocusFlag = getUserFocusFlagFn; //判断用户是否已经收藏了活动
		vm.getActivityDetail = getActivityDetailFn; //获取活动详情
		vm.getTicket = getTicketFn; //活动门票详情
		vm.focusActivity = focusActivityFn; //收藏活动
		vm.selectTicket = selectTicketFn; //点击选票函数

		//参与活动报名弹框，有确定、删除功能
		vm.showAlertDialog = showAlertDialogFn; //有确定、删除按钮的弹框
		vm.alertDialogConfirm = alertDialogConfirmFn; //确定删除
		vm.alertDialogCancel = alertDialogCancelFn; //取消删除

		vm.setActivePanel = setActivePanelFn; //切换选项卡

		vm.setCommentBox = setCommentBoxFn; //显示或隐藏“评论输入框”--‘B用户’回复‘A用户’
		vm.setReplyBox = setReplyBoxFn; //显示或隐藏“回复输入框”
		vm.getCommentList = getCommentListFn; //获取评论一级列表、分页
		vm.getReplyList = getReplyListFn; //获取评论二级列表
		vm.addComment = addCommentFn; //添加评论
		vm.addReply = addReplyFn; //添加回复

		/*****************函数 end****************/

		(function init() {
			vm.getActivityDetail(); //活动详情
			vm.getTicket(); //获取门票

			if (!!$rootScope.userInfo) {
				vm.getUserFocusFlag(); //判断用户是否已经收藏了活动
			}

			vm.getCommentList(); //加载评论列表

		})();

		//
		//
		//
		//
		//
		//----------------------------判断用户是否已经收藏了活动------------------------------------------
		//
		//
		//
		//
		//
		function getUserFocusFlagFn() {
			var params = {
				"deal_id": $stateParams.activityId,
				"user_id": $rootScope.userInfo.id
			}
			activityService.getUserFocusFlag(params)
				.success(function(data) {
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
		//----------------------------活动详情------------------------------------------
		//
		//
		//
		//
		//

		function getActivityDetailFn() {
			var params = {
				"id": $stateParams.activityId,
				"username": $rootScope.userInfo ? $rootScope.userInfo["user_name"] : ""
			}
			activityService.detail(params)
				.success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							vm.activityInfo = data.data.list[0];
							vm.tagsArray = data.data.list[0].tags.split(',');
							vm.sponsorInfo = data.data.sponsor[0];
							//地理定位
							getMapLocation(vm.activityInfo.province + vm.activityInfo.city + vm.activityInfo.address);

							//判断活动是否已经结束
							if (Date.parse(new Date()) / 1000 > vm.activityInfo.end_time) {
								window.showAutoDialog("活动已结束");
							}

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
									"bdText": vm.activityInfo.name, //标题
									"bdPic": vm.activityInfo.image, //图片
									"bdComment": vm.activityInfo.brief, //简介
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
		//----------------------------活动门票详情------------------------------------------
		//
		//
		//
		//
		//
		function getTicketFn() {
			var params = {
				id: $stateParams.activityId
			}
			activityService.getTicket(params)
				.success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							for (var i = 0; i < data.data.list.length; i++) {
								//要求剩余票大于0张
								if (data.data.list[i].ticket_num > 0) {
									if (data.data.list[i].ticket_price == "0" || data.data.list[i].ticket_price == "") {
										//免费票
										vm.freeTicketArray.push(data.data.list[i]);
									} else {
										//收费票
										vm.chargeTicketArray.push(data.data.list[i]);
									}
								}
							}
							if (vm.freeTicketArray.length == '0' && vm.chargeTicketArray.length == '0') {
								window.showAutoDialog("门票已售完");
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
		//----------------------------收藏活动------------------------------------------
		//
		//
		//
		//
		//
		function focusActivityFn() {

			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("请先登录");
				return false;
			}

			var params = {
				deal_id: $stateParams.activityId,
				user_id: $rootScope.userInfo.id,
				username: $rootScope.userInfo.user_name
			}
			activityService.focusActivity(params)
				.success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
						return false;
					} else {
						if (data.data.code == 20000) {
							//修改标识量
							vm.focusFlag = data.data.status;
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
		//----------------------------选择门票事件------------------------------------------
		//
		//
		//
		//
		//
		function selectTicketFn(id) {
			if (vm.selectTicketId == id) {
				vm.selectTicketId = "";
			} else {
				vm.selectTicketId = id;
			}
		}
		//
		//
		//
		//
		//
		//----------------------------百度地图API功能------------------------------------------
		//
		//
		//
		//
		//
		function getMapLocation(address) {
			$http.jsonp("https://api.map.baidu.com/geocoder/v2/?ak=f9vN5ry16uR26GXGGfgbcTELUqG1kmhX&output=json&&callback=JSON_CALLBACK&address=" + address)
				.success(function(data) {
					if (data.status == 0) {
						var map = new BMap.Map("activityMap");
						var point = new BMap.Point(data.result.location.lng, data.result.location.lat);
						map.centerAndZoom(point, 15);
						var marker = new BMap.Marker(point); // 创建标注
						map.addOverlay(marker); // 将标注添加到地图中
						map.enableScrollWheelZoom(); //启用滚轮放大缩小
						marker.disableDragging(); // 点不可拖拽

						var opts = {
							width: 200, // 信息窗口宽度   
							height: 0,
							//offset: new BMap.Size(0, 0),
							title: " " // 信息窗口标题   
						}
						var sContent = "<div style='font-size:14px;line-height:20px;margin-top:10px;'>" + address + "</div>";
						var infoWindow = new BMap.InfoWindow(sContent, opts); // 创建信息窗口对象
						marker.openInfoWindow(infoWindow, point); //开启信息窗口

						//点击事件，开启信息窗口
						marker.addEventListener("click", function() {
							this.openInfoWindow(infoWindow);
						});
					} else {
						console.log("地理定位失败");
					}
				});

		};
		//
		//
		//
		//
		//
		//----------------------------参与活动报名------------------------------------------
		//
		//
		//
		//
		//
		//显示弹框
		function showAlertDialogFn() {
			if (!vm.selectTicketId) {
				window.showAlertTip("请先选择票种");
				return false;
			}
			vm.show.joinDialog = true;
		}

		//确定按钮
		function alertDialogConfirmFn() {

			//防止重复提交
			if (vm.flag.joinFormFlag == false) {
				return false;
			}

			var params = {
				"deal_id": $stateParams.activityId, //活动id
				"user_id": $rootScope.userInfo.id, //用户id
				"username": $rootScope.userInfo.user_name, //用户名
				"nickname": vm.joinForm.nickname, //报名名称
				"mobile": vm.joinForm.mobile, //报名联系手机
				"email": vm.joinForm.email, //报名联系邮箱
				"company": vm.joinForm.company, //报名公司名
				"qq": vm.joinForm.qq, //报名联系QQ
				"wechat": vm.joinForm.wechat, //报名联系微信
				"sex": vm.joinForm.sex, //性别
				"age": vm.joinForm.age, //年龄
				"department": vm.joinForm.department, //部门
				"job": vm.joinForm.job, //职务
				"address": vm.joinForm.address, //地址 
				"ticket_id": vm.selectTicketId
			}

			//1.设置报名表
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.joinFormFlag = false;
			activityService.getUserSinUpForm(params)
				.success(function(data) {
					try {
						if (data.ret != 200) {
							window.showAutoDialog(data.msg);
							return false;
						} else {
							if (data.data.code == 20000) {
								//2.参加活动
								var params = {
									"ticket_id": vm.selectTicketId,
									"deal_id": $stateParams.activityId, //活动id
									"user_id": $rootScope.userInfo.id, //用户id
									"username": $rootScope.userInfo.user_name, //用户名
									"extends_id": data.data.extends_id
								}
								activityService.joinActivity(params)
									.success(function(data) {
										if (data.ret != 200) {
											window.showAutoDialog(data.msg);
											return false;
										} else {
											if (data.data.code == 20000) {

												//如果有订单号，说明是需要付款的
												if (data.data.sn && data.data.price != '0') {
													//跳转到付款页面
													$state.go("payMoney", {
														"id": data.data.sn, //订单号
														"price": data.data.price, //价格
														"num": '1', //数量
														"Project_type": '0', //项目类型：0活动众筹，1评审评估
														"url": "personal.joinActivity"
													});
												} else {
													//不需要付款
													vm.show.joinDialog = false;
													window.showAutoDialog(data.data.msg);
												}
											} else {
												window.showAutoDialog(data.data.msg);
											}
										}
									});
							} else {
								window.showAlertTip(data.data.msg);
							}
						}
					} catch (e) {

					} finally {
						$rootScope.$broadcast("public.hide", ["loading_panel"]);
						vm.flag.joinFormFlag = true;
					}
				});
		}

		//取消按钮
		function alertDialogCancelFn() {
			vm.show.joinDialog = false;
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
		//----------------------------获取评论一级列表、分页------------------------------------------
		//
		//
		//
		//
		//
		function getCommentListFn() {
			var params = {
				deal_id: $stateParams.activityId,
				pageSize: vm.commentPageParams.pageSize,
				current: vm.commentPageParams.current
			}
			commentService.getCommentList(params)
				.success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if (data.data.code == 20000) {
							vm.commentArray = data.data.list;
							vm.commentPageParams.page_count = data.data.page_count;
							vm.comment_count = data.data.comment_count; //评论总数

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
			commentService.getReplyList(params)
				.success(function(data) {
					if (data.ret != 200) {
						window.showAutoDialog(data.msg);
					} else {
						if (data.data.code == 20000) {
							for (var i = 0; i < pidArray.length; i++) {
								//往一级评论里，插入二级评论数组
								vm.commentArray[i]["list"] = data.data.list[pidArray[i]];
							}
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
					angular.element($window)
						.scrollTop(0);
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
					angular.element($event.target)
						.closest("li")
						.find("li.answer-item:first")
						.find("textarea")
						.focus();
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
					angular.element($event.target)
						.closest("ul")
						.find("li:last")
						.find("textarea")
						.focus();
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
			if (vm.commentText.toString()
				.trim()
				.length == 0) {
				return false;
			}

			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("请先登录");
				return false;
			}

			var params = {
				"deal_id": $stateParams.activityId,
				"user_id": $rootScope.userInfo.id,
				"nickname": $rootScope.userInfo.nickname,
				"content": vm.commentText
			}
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.addCommentFlag = false;
			commentService.addComment(params)
				.success(function(data) {
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
			if (vm.replyText.toString()
				.trim()
				.length == 0) {
				return false;
			}

			if (!$rootScope.userInfo.id) {
				window.showAutoDialog("请先登录");
				return false;
			}

			var params = {
				"deal_id": $stateParams.activityId,
				"user_id": $rootScope.userInfo.id,
				"nickname": $rootScope.userInfo.nickname,
				"content": vm.replyText,
				"pid": vm.pid,
				"reply_user_id": vm.reply_user_id,
				"reply_nickname": vm.reply_nickname
			}
			$rootScope.$broadcast("public.show", ["loading_panel"]);
			vm.flag.addReplyFlag = false;
			commentService.addComment(params)
				.success(function(data) {
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

	}
})();