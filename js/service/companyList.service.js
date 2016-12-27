/**
 * 作者：林创荣
 * 功能：机构名录
 * 时间：2016年12月16日
 */
( function() {
	'use strict';

	angular.module( "companyList.service", [] )
		.service( "companyListService", companyListService );

	companyListService.$inject = [ "appApiDao" ];

	function companyListService( appApiDao ) {
		this.getCompanyList = getCompanyListFn; //名录列表
		this.joinCompanyList = joinCompanyListFn; //加入名录

		//名录列表
		function getCompanyListFn( params ) {
			var url = appApiDao.url.companyList.getCompanyList;
			return appApiDao.getData( url, params );
		}

		//加入名录
		function joinCompanyListFn( params ) {
			var url = appApiDao.url.companyList.joinCompanyList;
			return appApiDao.postData( url, params );
		}
	}
} )();