//配置公共常量
(function() {
	angular.module('app.config', [])
		.constant('appConfig', appConfig()); //常量,注入

	function appConfig() {
		return {
			baseUrl: "/app/Tpl/web/",
			newApiUrl:"/phalapi/public/yiapp/"
		}
	}
})();