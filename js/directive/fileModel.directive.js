/**
 * 图片上传预览
 * 林创荣
 * 2016年9月20日
 */
(function() {
	'use strict';
	angular.module('fileModel.directive', [])
		.directive('filePreview', function() {
			return {
				restrict: 'A',
				scope: {
					previewDom: '@previewDom', //需要插入图片的div
					maxSize: '@maxSize', //文件大小
					fileModel: '=fileModel' //双向绑定
				},
				link: function(scope, ele, attrs, ngModel) {
					angular.element(ele).bind('change', function(event) {
						//附件预览
						var myFile = (event.srcElement || event.target);

						if(myFile.files && myFile.files[0] && window.FileReader) {
							scope.file = myFile.files[0];
							console.log(scope.file);
							//判断图片是否超出大小，默认500K
							var maxSize = !!scope.maxSize ? scope.maxSize : 500;
							if(scope.file.size / 1024 > maxSize) {
								alert("图片不可超过" + maxSize + "KB");
								return false;
							}
							var reader = new FileReader();
							reader.onload = function(evt) {
								//获取到base64编码
								document.getElementById(scope.previewDom).innerHTML = '<img src="' + evt.target.result + '" />';
								scope.fileModel = evt.target.result;
							}
							reader.readAsDataURL(file.files[0]);
						} else {
							//IE
							console.log(file.value);
							//document.getElementById("preview1").style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod="scale",src="C:\\fakepath\\03.jpg")';
							//document.getElementById(scope.previewDom).style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=\'scale\',src="' + myFile.value + '")';
						}

					});
				}
			}
		});
})();