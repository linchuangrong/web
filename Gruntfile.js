/**
 * Created by Administrator on 2016/12/30.
 */

module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		//css压缩
		cssmin: {
			options: {
				keepSpecialComments: 0
			},
			target: {
				files: [{
					expand: true,
					cwd: 'css', //js目录下
					src: ['*.css', '!*.min.css'], //所有css文件
					dest: 'css', //输出到此目录下
					ext: '.min.css'
				}]
			}
		},
		//js压缩
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			//压缩service.js
			serviceMin: {
				files: [{
					expand: true,
					cwd: 'js/service/', //js目录下
					src: '*.js', //所有js文件
					dest: 'js/service/service_min/', //输出到此目录下
					ext: '.service.min.js'
				}]
			},
			//压缩public.controller.js
			js2: {
				files: [{
					expand: true,
					cwd: 'js/components/', //js目录下
					src: '*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩activity
			js3: {
				files: [{
					expand: true,
					cwd: 'js/components/activity', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/activity', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩addForm
			js4: {
				files: [{
					expand: true,
					cwd: 'js/components/addForm', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/addForm', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩companyList
			js5: {
				files: [{
					expand: true,
					cwd: 'js/components/companyList', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/companyList', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩crowdFund
			js6: {
				files: [{
					expand: true,
					cwd: 'js/components/crowdFund', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/crowdFund', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩examine
			js7: {
				files: [{
					expand: true,
					cwd: 'js/components/examine', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/examine', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩findpassword
			js8: {
				files: [{
					expand: true,
					cwd: 'js/components/findpassword', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/findpassword', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩index
			js9: {
				files: [{
					expand: true,
					cwd: 'js/components/index', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/index', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩list
			js10: {
				files: [{
					expand: true,
					cwd: 'js/components/list', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/list', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩login
			js11: {
				files: [{
					expand: true,
					cwd: 'js/components/login', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/login', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩order
			js12: {
				files: [{
					expand: true,
					cwd: 'js/components/order', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/order', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩payMoney
			js13: {
				files: [{
					expand: true,
					cwd: 'js/components/payMoney', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/payMoney', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩personal
			js14: {
				files: [{
					expand: true,
					cwd: 'js/components/personal', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/personal', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩software
			js15: {
				files: [{
					expand: true,
					cwd: 'js/components/software', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/software', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
			//压缩sponsor
			js16: {
				files: [{
					expand: true,
					cwd: 'js/components/sponsor', //js目录下
					src: '**/*.js', //所有js文件
					dest: 'js/js_min/', //输出到此目录下
					//dest: 'js/components/sponsor', //输出到此目录下
					ext: '.controller.min.js'
				}]
			},
		},
		//监听文件变化，然后执行js，css压缩
		watch: {
			css: {
				files: ['css/*.css'],
				tasks: ['css'],
				options: {
					livereload: false
				}
			},
			//监听service.js
			serviceMin:{
				files: ['js/service/*.js'],
				tasks: ['serviceMin'],
				options: {
					livereload: false
				}
			},
			//监听项目根目录下minAll.js,只要文件一发生改变，就压缩所有js文件
			jsAll: {
				files: ['minAll.js'],
				tasks: ['jsAll'],
				options: {
					livereload: false
				}
			},
			//监听public.controller.js
			js2: {
				files: ['js/components/*.js'],
				tasks: ['js2'],
				options: {
					livereload: false
				}
			},
			//监听
			js3: {
				files: ['js/components/activity/*.js'],
				tasks: ['js3'],
				options: {
					livereload: false
				}
			},
			//监听
			js4: {
				files: ['js/components/addForm/*.js'],
				tasks: ['js4'],
				options: {
					livereload: false
				}
			},
			//监听
			js5: {
				files: ['js/components/companyList/*.js'],
				tasks: ['js5'],
				options: {
					livereload: false
				}
			},
			//监听
			js6: {
				files: ['js/components/crowdFund/*.js'],
				tasks: ['js6'],
				options: {
					livereload: false
				}
			},
			//监听
			js7: {
				files: ['js/components/examine/*.js'],
				tasks: ['js7'],
				options: {
					livereload: false
				}
			},
			//监听
			js8: {
				files: ['js/components/findpassword/*.js'],
				tasks: ['js8'],
				options: {
					livereload: false
				}
			},
			//监听
			js9: {
				files: ['js/components/index/*.js'],
				tasks: ['js9'],
				options: {
					livereload: false
				}
			},
			//监听
			js10: {
				files: ['js/components/list/*.js'],
				tasks: ['js10'],
				options: {
					livereload: false
				}
			},
			//监听
			js11: {
				files: ['js/components/login/*.js'],
				tasks: ['js11'],
				options: {
					livereload: false
				}
			},
			//监听
			js12: {
				files: ['js/components/order/*.js'],
				tasks: ['js12'],
				options: {
					livereload: false
				}
			},
			//监听
			js13: {
				files: ['js/components/payMoney/*.js'],
				tasks: ['js13'],
				options: {
					livereload: false
				}
			},
			//监听
			js14: {
				files: ['js/components/personal/*.js'],
				tasks: ['js14'],
				options: {
					livereload: false
				}
			},
			//监听
			js15: {
				files: ['js/components/software/*.js'],
				tasks: ['js15'],
				options: {
					livereload: false
				}
			},
			//监听
			js16: {
				files: ['js/components/sponsor/*.js'],
				tasks: ['js16'],
				options: {
					livereload: false
				}
			},

		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('css', ['cssmin']); //压缩css
	grunt.registerTask('serviceMin', ['uglify:serviceMin']); //压缩service
	grunt.registerTask('jsAll', ['uglify']); //压缩所有js
	grunt.registerTask('js2', ['uglify:js2']); //压缩public.controller.js
	grunt.registerTask('js3', ['uglify:js3']); //压缩activity
	grunt.registerTask('js4', ['uglify:js4']); //压缩addForm
	grunt.registerTask('js5', ['uglify:js5']); //压缩companyList
	grunt.registerTask('js6', ['uglify:js6']); //压缩crowdFund
	grunt.registerTask('js7', ['uglify:js7']); //压缩examine
	grunt.registerTask('js8', ['uglify:js8']); //压缩findpassword
	grunt.registerTask('js9', ['uglify:js9']); //压缩index
	grunt.registerTask('js10', ['uglify:j103']); //压缩list
	grunt.registerTask('js11', ['uglify:js11']); //压缩login
	grunt.registerTask('js12', ['uglify:js12']); //压缩order
	grunt.registerTask('js13', ['uglify:js13']); //压缩payMoney
	grunt.registerTask('js14', ['uglify:js14']); //压缩personal
	grunt.registerTask('js15', ['uglify:js15']); //压缩software
	grunt.registerTask('js16', ['uglify:js16']); //压缩sponsor

	grunt.registerTask('watcher', ['watch']);
};