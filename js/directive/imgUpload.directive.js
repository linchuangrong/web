/**
 * 图片上传
 * 林创荣
 * 提示：默认是上传一张，在某个位置显示这张图
 * 		如果有imgArray这个参数，则是上传完成后，往这个数组里push图片地址
 * 2016年10月19日
 */
angular.module('imgUpload.directive', ['app.config'])
	.directive('imgUpload', function(appConfig, $rootScope) {
		return {
			restrict: 'A',
			scope: {
				btnId: "@btnId", //按钮的id
				imgSize: "@imgSize", //图片的最大内存
				imgSrc: "=imgSrc", //返回的图片地址url
				imgArray: "=imgArray" //多图片显示
			},
			link: function(scope, element, attrs, ngModel) {

				var uploader = Qiniu.uploader({
					runtimes: 'html5,flash,html4', //上传模式,依次退化
					browse_button: scope.btnId, //上传选择的点选按钮，**必需**
					uptoken_url: appConfig.newApiUrl + '?service=Images.uploadFile&username=' + $rootScope.userInfo.user_name, //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
					//uptoken : scope.token, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
					unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
					//save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
					domain: 'https://image.eitty.cn/', //bucket 域名，下载资源时用到，**必需**
					//container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
					max_file_size: scope.imgSize || '2mb', //最大文件体积限制
					flash_swf_url: '/app/Tpl/web/js/libs/plupload/Moxie.swf', //引入flash,相对路径
					//文件类型过滤，这里限制为图片类型
					filters: {
						mime_types: [{
							title: "Image files",
							extensions: "jpg,jpeg,gif,png,bmp"
						}]
					},
					multi_selection: false, //设置为只能选择一个文件
					max_retries: 3, //上传失败最大重试次数
					//dragdrop: true, //开启可拖曳上传
					//drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
					chunk_size: '4mb', //分块上传时，每片的体积
					auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
					init: {
						'FilesAdded': function(up, files) {
							plupload.each(files, function(file) {
								// 文件添加进队列后,处理相关的事情
							});
						},
						'BeforeUpload': function(up, file) {
							// 每个文件上传前,处理相关的事情
						},
						'UploadProgress': function(up, file) {
							// 每个文件上传时,处理相关的事情
						},
						'FileUploaded': function(up, file, info) {
							var domain = up.getOption('domain');
							var res = JSON.parse(info);
							var sourceLink = domain + res.key;
							scope.$apply(function() {
								if(scope.imgSrc != undefined) {
									scope.imgSrc = sourceLink; //图片链接地址
									console.log(scope.imgSrc);
								}

								if(scope.imgArray != undefined) {
									scope.imgArray.push(sourceLink);
									console.log(scope.imgArray);
								}
								
							});

						},
						'Error': function(up, err, errTip) {
							//上传出错时,处理相关的事情
							switch(err.code) {
								case -600:
									window.showAlertTip("文件过大，不可上传");
									break;
								case -601:
									window.showAlertTip("选择的文件类型不符合要求");
									break;
								case -602:
									window.showAlertTip("该文件已上传过一次，不允许有重复文件");
									break;
								case -200:
									//window.showAlertTip("发生http网络错误:" + "-200");
									console.log("发生http网络错误:" + "-200");
									break;
								default:
									window.showAlertTip("发生未知错误：" + err.code);
									break;
							}
						},
						'UploadComplete': function() {
							//队列文件处理完毕后,处理相关的事情
						}
					}
				});

			}
		};
	});