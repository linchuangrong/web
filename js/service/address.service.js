/**
 * 作者：林创荣
 * 功能：地址省市列表数据
 * 时间：2016年11月8日
 */
(function() {
	'use strict';

	angular.module("address.service", [])
		.service("addressService", addressService);

	addressService.$inject = ['appApiDao'];

	function addressService(appApiDao) {

		this.getProvinceList = getProvinceListFn; //获取省
		this.getCityList = getCityListFn; //获取城市列表

		//获取省数组,因为数组在不同环境下被修改，仍然会被修改到。利用这个问题，可以在此文件，修改其它页面的省份数组
		function getProvinceListFn(callback) {
			var url = appApiDao.url.common.getArea;
			var params = {
				"pid": '1'
			}
			appApiDao.getData(url, params).success(function(data) {
				if(data.ret != 200) {
					return false;
				} else {
					if(data.data.code == 20000) {
						callback(data.data.list);
						return data.data.list;
					} else {
						window.showAutoDialog("获取省份地区数据失败,请联系管理员");
						return false;
					}
				}
			});
		}

		//获取城市列表
		//参数
		//myProvinceArray		省数组
		//province				省中文描述
		//firstCallBack			回调函数1：清空城市的值
		//lastCallBack			回调函数2：为城市数组赋值
		function getCityListFn(myProvinceArray, province, firstCallBack, lastCallBack) {
			
			//这里的callback，是为了将城市的值先清空。（所以在点击事件时，传一个firstCallBack，内部代码是将city赋值为空）
			if(firstCallBack) {
				firstCallBack();
			}

			//省ID
			var provinceId = null;

			//根据省中文名称,获取省id
			for(var i = 0; i < myProvinceArray.length; i++) {
				if(myProvinceArray[i].name == province) {
					provinceId = myProvinceArray[i].id; //获取省ID，等下获取市要用到
					break;
				}
			}

			//获取城市列表
			var params = {
				"pid": provinceId
			}
			appApiDao.getData(appApiDao.url.common.getArea, params).success(function(data) {
				if(data.ret != 200) {
					return false;
				} else {
					if(data.data.code == 20000) {
						//赋值：城市数组
						lastCallBack(data.data.list);
						return data.data.list;
					} else {
						window.showAutoDialog("获取城市地区数据失败,请联系管理员");
					}
				}
			});
		}

	}
})();