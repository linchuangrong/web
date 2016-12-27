/**
 * 富文本编辑器(此代码单独运行是执行不了的)
 * 林创荣
 * 2016年9月22日
 */
angular.module('contenteditable.directive', ['app.config'])
	.directive('contenteditable', function(appConfig, $rootScope) {
		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				token: "=token"
			},
			link: function(scope, element, attrs, ngModel) {
				// 初始化 编辑器内容
				if(!ngModel) {
					return;
				} // do nothing if no ng-model
				// Specify how UI should be updated
				ngModel.$render = function() {
					element.html(ngModel.$viewValue || '');
				};
				// Listen for change events to enable binding
				element.on('blur keyup change', function() {
					scope.$apply(readViewText);
				});
				// No need to initialize, AngularJS will initialize the text based on ng-model attribute
				// Write data to the model
				function readViewText() {
					var html = element.html();
					// When we clear the content editable the browser leaves a <br> behind
					// If strip-br attribute is provided then we strip this out
					if(attrs.stripBr && html === '<br>') {
						html = '';
					}
					ngModel.$setViewValue(html);
				}

				// 创建编辑器
				var editor = new wangEditor(element);

				// 自定义菜单
				editor.config.menus = [
					//'source',
					//'|',
					'bold',
					'underline',
					'italic',
					'strikethrough',
					'eraser',
					'forecolor',
					'bgcolor',
					'lineheight',
					'indent',
					'|',
					//'quote',
					'fontfamily',
					'fontsize',
					//'head',//因为这个已经被整个全局样式设置为无padding,无margin，无字体大小
					//'unorderlist',
					//'orderlist',
					'alignleft',
					'aligncenter',
					'alignright',
					'|',
					'link',
					'unlink',
					'table',
					//'emotion',
					'|',
					'img',
					//'video',
					//'location',
					//'insertcode',
					'|',
					'undo',
					//'redo',
					'fullscreen'
				];

				editor.config.customUpload = true; // 配置自定义上传
				editor.config.customUploadInit = uploadInit; // 配置上传事件

				//创建富文本编辑器
				editor.create();

				function uploadInit() {
					var editor = this;
					var btnId = editor.customUploadBtnId;
					var containerId = editor.customUploadContainerId;

					var uploader = Qiniu.uploader({
						runtimes: 'html5,flash,html4', //上传模式,依次退化
						browse_button: btnId, //上传选择的点选按钮，**必需**
						uptoken_url: appConfig.newApiUrl + '?service=Images.uploadFile&username=' + $rootScope.userInfo.user_name, //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
						//uptoken : scope.token, //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
						unique_names: true, // 默认 false，key为文件名。若开启该选项，SDK为自动生成上传成功后的key（文件名）。
						//save_key: true,   // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK会忽略对key的处理
						domain: 'https://image.eitty.cn/', //bucket 域名，下载资源时用到，**必需**
						container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
						max_file_size: '2mb', //最大文件体积限制
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
								// 显示进度条
								editor.showUploadProgress(file.percent);
							},
							'FileUploaded': function(up, file, info) {
								var domain = up.getOption('domain');
								var res = JSON.parse(info);
								var sourceLink = domain + res.key;
								//获取上传成功后的文件的Url
								// 插入到编辑器中
								editor.command(null, 'insertHtml', '<img src="' + sourceLink + '" style="max-width:100%;"/>');

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
								// 隐藏进度条
								editor.hideUploadProgress();
							}
						}
					});
				}
			}
		};
	});