/**
 * 依赖app.config.js
 */

(function() {
	'use strict';

	angular.module("common.filter", ['app.config'])
		.filter('toHtml', toHtmlFn) //展示Html样式
		.filter('toTimeStamp', toTimeStampFn) //日期转时间戳（时间戳单位为：秒）
		.filter('toDate', toDateFn) //时间戳转日期（2016-09-20）
		.filter('toTime', toTimeFn) //时间戳转日期（2016-09-20 12:30:23）
		.filter('toAutoTime', toAutoTimeFn) //时间戳转日期(2016-10-01 12:00)
		.filter('toShortTime', toShortTimeFn) //时间戳转时间（10-01 12:30）
		.filter('toYearMonth', toYearMonthFn) //时间戳转年月（2016年10月）
		.filter('plainText', plainTextFn)
		.filter('bsToChinese', bsToChinese);

	//展示Html样式
	toHtmlFn.$inject = ['$sce'];

	function toHtmlFn($sce) {
		return function(text) {
			return $sce.trustAsHtml(text);
		}
	}

	function toTimeStampFn() {
		return function(text) {
			return Date.parse(new Date(text)) / 1000;
		}
	}

	toDateFn.$inject = ['$filter'];

	function toDateFn($filter) {
		return function(text) {
			if(!!text) {
				if(angular.isNumber(parseInt(text))) {
					return $filter('date')(text * 1000, 'yyyy-MM-dd');
				} else {
					return text;
				}
			}
		}
	}

	toTimeFn.$inject = ['$filter'];

	function toTimeFn($filter) {
		return function(text) {
			if(!!text) {
				if(angular.isNumber(parseInt(text))) {
					return $filter('date')(text * 1000, 'yyyy-MM-dd HH:mm:ss');
				} else {
					return text;
				}
			}
		}
	}

	toAutoTimeFn.$inject = ['$filter'];

	function toAutoTimeFn($filter) {
		return function(text) {
			if(!!text) {
				if(angular.isNumber(parseInt(text))) {
					try {
						var result = $filter('date')(text * 1000, 'yyyy-MM-dd HH:mm');
						return result;
					} catch(e) {
						return "";
					}
				} else {
					return text;
				}
			}

		}
	}

	toShortTimeFn.$inject = ['$filter'];

	function toShortTimeFn($filter) {
		return function(text) {
			if(!!text) {
				if(angular.isNumber(parseInt(text))) {
					return $filter('date')(text * 1000, 'MM-dd HH:mm');
				} else {
					return text;
				}
			}
		}
	}

	//时间戳转年月（2016年10月）
	toYearMonthFn.$inject = ['$filter'];

	function toYearMonthFn($filter) {
		return function(text) {
			if(!!text) {
				if(angular.isNumber(parseInt(text))) {
					return $filter('date')(text * 1000, 'yyyy年MM月');
				} else {
					return text;
				}
			}
		}
	}

	//将HTML等文本格式化为纯文本
	function plainTextFn() {
		return function(text) {
			return angular.element(text).text();
		}
	}

	function bsToChinese() {
		return function(text) {
			var obj = {
				"1": "一",
				"2": "二",
				"3": "三",
				"4": "四",
				"5": "五",
				"6": "六",
				"7": "七",
				"8": "八",
				"9": "九"
			}
			for(var i in obj) {
				if(text == i) {
					return obj[i];
				}
			}

		}
	}

})();