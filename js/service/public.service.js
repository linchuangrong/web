/**
 * 林创荣
 * 功能：公共接口
 * 		退出
 * 		短信验证码
 * 		省市二级关联
 * 2016年10月21日
 */
(function() {
	'use strict';

	angular.module("public.service", [])
		.service("publicService", publicService);

	publicService.$inject = ["appApiDao", "$rootScope"];

	function publicService(appApiDao, $rootScope) {

		var dateNow = new Date(); //今天的时间
		this.dateNowStamp = Date.parse(dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate() + ' 00:00:00') / 1000; //今天00:00:00的时间戳
		this.dateOneMonthStamp = Date.parse(dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate() + ' 00:00:00') / 1000 + 31 * 24 * 60 * 60 - 1; //一个月后的时间戳

		this.exit = exitFn; //退出
		this.sendsms = sendsmsFn; //发送验证码
		this.getArea = getAreaFn; //获取省市关联数据
		this.getSmsEmailCode = getSmsEmailCodeFn; //获取用户绑定的手机号、邮箱，然后发送验证码
		this.getBankList = getBankListFn; //获取银行列表
		this.getActivityType = getActivityTypeFn; //获取活动类别，形式，标签等

		this.getTimeStamp = getTimeStampFn; //根据传进来的中文，转化为开始时间戳，结束时间戳

		//退出接口
		function exitFn(params) {
			var url = appApiDao.url.common.exit;
			return appApiDao.getData(url, params);
		}

		//发送短信验证码
		function sendsmsFn(params) {
			return appApiDao.postData(appApiDao.url.common.sendsms, params);
		}

		//获取省市关联数据
		function getAreaFn(params) {
			return appApiDao.postData(appApiDao.url.common.getArea, params);
		}

		//获取用户绑定的手机号、邮箱，然后发送验证码
		function getSmsEmailCodeFn(username) {
			var params = {
				"username": ""
			};

			if(!!username) {
				params.username = username;
			} else {
				params.username = $rootScope.userInfo.user_name
			}

			return appApiDao.getData(appApiDao.url.common.getSmsEmailCode, params);
		}

		//获取银行列表
		function getBankListFn() {
			var url = appApiDao.url.common.getBankList;
			return appApiDao.getData(url);
		}

		//获取活动类别，形式，标签等
		function getActivityTypeFn() {
			var url = appApiDao.url.activity.getActivityType;
			var params = {
				"act": "active"
			}
			return appApiDao.getData(url, params);
		}

		//根据传进来的中文，转化为开始时间戳，结束时间戳
		function getTimeStampFn(param) {
			var dateNow = new Date();
			var year = dateNow.getFullYear(); //年
			var month = dateNow.getMonth() + 1; //月
			var day = dateNow.getDate(); //日

			var startTimeStamp = "";
			var endTimeStamp = "";

			if(param == "今天") {
				startTimeStamp = Date.parse(year + "-" + month + "-" + day + ' 00:00:00') / 1000; //今天00:00:00的时间戳
				endTimeStamp = Date.parse(year + "-" + month + "-" + day + ' 23:59:59') / 1000; //今天23:59:59的时间戳
			} else if(param == "明天") {
				startTimeStamp = Date.parse(year + "-" + month + "-" + day + ' 00:00:00') / 1000 + 86400; //明天00:00:00的时间戳
				endTimeStamp = Date.parse(year + "-" + month + "-" + day + ' 23:59:59') / 1000 + 86400; //明天23:59:59的时间戳
			} else if(param == "周末") {
				var week = "7123456";
				//获取本周星期六
				var first = 0 - week.indexOf(dateNow.getDay());
				var firstDay = new Date;
				firstDay.setDate(firstDay.getDate() + first + 5); //星期一，加上5天，就是星期六
				//获取本周星期天
				var last = 6 - week.indexOf(dateNow.getDay());
				var lastDay = new Date;
				lastDay.setDate(lastDay.getDate() + last);
				//设置时间
				startTimeStamp = Date.parse(firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1) + "-" + firstDay.getDate() + ' 00:00:00') / 1000; //星期六00:00:00的时间戳
				endTimeStamp = Date.parse(lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate() + ' 23:59:59') / 1000; //星期天23:59:59的时间戳
			} else if(param == "本周") {
				var week = "7123456";
				//获取本周星期一
				var first = 0 - week.indexOf(dateNow.getDay());
				var firstDay = new Date;
				firstDay.setDate(firstDay.getDate() + first);
				//获取本周星期天
				var last = 6 - week.indexOf(dateNow.getDay());
				var lastDay = new Date;
				lastDay.setDate(lastDay.getDate() + last);
				//设置时间
				startTimeStamp = Date.parse(firstDay.getFullYear() + "-" + (firstDay.getMonth() + 1) + "-" + firstDay.getDate() + ' 00:00:00') / 1000; //星期一00:00:00的时间戳
				endTimeStamp = Date.parse(lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate() + ' 23:59:59') / 1000; //星期天23:59:59的时间戳
			} else if(param == "本月") {
				//设置时间
				if(month == 12) {
					startTimeStamp = Date.parse(year + "-" + month + "-01 00:00:00") / 1000; //本月1号00:00:00的时间戳
					endTimeStamp = Date.parse((year + 1) + "-01-01 23:59:59") / 1000 - 86400; //本月最后一天的23:59:59的时间戳
				} else {
					startTimeStamp = Date.parse(year + "-" + month + "-01 00:00:00") / 1000; //本月1号00:00:00的时间戳
					endTimeStamp = Date.parse(year + "-" + (month + 1) + "-01 23:59:59") / 1000 - 86400; //本月最后一天的23:59:59的时间戳
				}
			} else if(!!param) {
				try {
					var date = new Date(param);
					var year = date.getFullYear(); //年
					var month = date.getMonth() + 1; //月
					var day = date.getDate(); //日
					startTimeStamp = Date.parse(year + "-" + month + "-" + day + ' 00:00:00') / 1000; //今天00:00:00的时间戳
					endTimeStamp = Date.parse(year + "-" + month + "-" + day + ' 23:59:59') / 1000; //今天23:59:59的时间戳
					//console.log(new Date(startTimeStamp * 1000));
					//console.log(new Date(endTimeStamp * 1000));
				} catch(e) {
					startTimeStamp = "";
					endTimeStamp = "";
				}
			}

			return {
				"startTimeStamp": startTimeStamp,
				"endTimeStamp": endTimeStamp
			};

		}
	}
})();