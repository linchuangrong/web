/**获取上一个路由的地址*/
(function() {
	'use strict';

	angular.module("url.service", [])
		.service("urlService", urlService);

	urlService.$inject = ["$rootScope"];

	function urlService($rootScope) {
		var prevRouterName = "";
		var prevRouterParams = {};
		$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			prevRouterName = fromState.name;
			prevRouterParams = fromParams;
			//console.log(prevRouterName);
			//console.log(prevRouterParams);
		});
		this.getPrevRouterName = function() {
			return prevRouterName;
		}
		this.getPrevPouterParams = function() {
			return prevRouterParams;
		}
	}
})();