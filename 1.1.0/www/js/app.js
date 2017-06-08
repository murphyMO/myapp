/**
 * 容器模块
 */
var app = angular.module('app',[
	'ionic',
	'oc.lazyLoad',
	'ngResource',
	'$localStorage',
	'angular-intro',
	'ngCordova',
	'ion-gallery',
	'chatFactory',
	'rongCloudService',
	'ionic-datepicker',
	'ionic-timepicker',
	'$CommonFactory',
	'CommonDirective',
	'VersionCheck',
	'ngIOS9UIWebViewPatch',
	'tabSlideBox',
	'angular-carousel',
	'ionicLazyLoad',
	'AndroidPermissionService'
]);

/**
 * 入口
 */
app.run(function($ionicPlatform, $ionicHistory, $rootScope, $localStorage,$cordovaMedia, $timeout,chatFactory,rongCloudService,$state,$cordovaToast,versionFactory,$cordovaNetwork,$CommonFactory,AndroidPermissionService) {

	/**
	 *发布时间戳
	 */
	$rootScope.showTime = function (releaseTimeStr) {
		var releaseTime = new Date(releaseTimeStr);
		var now = new Date();
		var nowMillisec = Date.parse(now);
		var releaseMillisec = Date.parse(releaseTimeStr);
		var periodTime = nowMillisec - releaseMillisec;
		var minute = Math.floor(periodTime / 60000);
		var hour = Math.floor(minute / 60);
		var day = Math.floor(hour / 24);

		if (releaseTime.getFullYear() != now.getFullYear()) {
			return releaseTimeStr.slice(0, 10);
		} else if (day > 1) {
			return releaseTimeStr.slice(5, 10);
		} else if (day == 1) {
			var timeArr = ['昨天'];
			timeArr[1] = releaseTimeStr.slice(11, 16);
			return timeArr.join('');
		} else if (hour > 0) {
			return hour + '小时前';
		} else if (minute > 0) {
			return minute + '分钟前';
		} else {
			return '刚刚';
		}
	}

	//设置token
	$rootScope.setAccessToken = function (accesstoken) {
		$localStorage.set("accesstoken", accesstoken);
	};

	// 从cookie中获取accessToken
	$rootScope.getAccessToken = function () {
		return $localStorage.get("accesstoken");
	};

	//设置用户对象
	$rootScope.setCurrentUser = function (userObj) {
		$localStorage.setObject("currentUser", userObj);
	};

	//从cookie中获取登录的当前用户对象
	$rootScope.getCurrentUser = function () {
		return $localStorage.getObject("currentUser");
	};

	//注销融云登录
	$rootScope.rongYunLogout = function () {
		$ionicPlatform.ready(function() {
			chatFactory.rongCloudLogout();
		});
	};


	//路由切换开始
	var timeout = null;
	$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
		
		// 登陆、注册、忘记密码都不进行权限认证
		if (toState.name == "login" || toState.name == "regist" || toState.name == "forgetpwd" || toState.name == "start" || toState.name == "tiaokuan") {
			return;
		}
		//延迟加载
		if (timeout) {
			$timeout.cancel(timeout);
		}
		timeout = $timeout(function () {
			// 用户未登录，跳转到登陆画面
			if (!$rootScope.getCurrentUser()) {
				event.preventDefault();// 取消默认跳转行为
				$state.go("start");
			}
		}, 1);
	});

	//路由请求成功
	$rootScope.$on('$stateChangeSuccess', function () {
//		$timeout(function(){
//			$rootScope.loading = false;
//		}, 500);
//
//		$rootScope.isShowBottom = true;
//		$rootScope.appHeader = true; //头部为true显示
//		$rootScope.appNav = true; //底部导航为true显示
	});

	//路由请求错误
	$rootScope.$on('$stateChangeError', function() {
//		$timeout(function(){
//			$rootScope.loading = false;
//		}, 1000);
	});

	$rootScope.$on("userInfoUpdate",function(event,data){
		var oldCurrentUser = $rootScope.getCurrentUser();
		var oldUserText = '';
		var newUserText = '';
		switch(oldCurrentUser.user_type){
			case 0:
				oldUserText = "侠客岛员工";
				break;
			case 1:
				oldUserText = "注册会员";
				break;
			case 2:
				oldUserText = "云会员";
				break;
			case 3:
				oldUserText = "入驻会员";
				break;
			case 9:
				oldUserText = "灵活会员";
				break;
		}
		var data2 = JSON.parse(data.msg.content.data);
		var from = data2.from;
		var newUserType = data2.user_type;
		switch(data2.user_type){
			case 0:
				newUserText = "侠客岛员工";
				break;
			case 1:
				newUserText = "注册会员";
				break;
			case 2:
				newUserText = "云会员";
				break;
			case 3:
				newUserText = "入驻会员";
				break;
			case 9:
				newUserText = "灵活会员";
				break;
		}
		if (oldCurrentUser.user_type != newUserType) {
			oldCurrentUser.user_type = newUserType;
			$localStorage.setObject("currentUser", oldCurrentUser);
			$cordovaToast.show("您当前会员等级已由" + oldUserText + "变更为" + newUserText,"long", "center");
			
			// $CommonFactory.showAlert("你当前会员等级已由" + oldUserText + "变更为" + newUserText)
		}
		if (from == 'mhi') {
			$state.go("tab.business");
		}
		else if(from == 'hi'){
			$state.go("tab.mine");
		}

	});

	//初始化融云
	$rootScope.RongCloudInit = function(){
		//获取融云的用户token
		var data = {
			'accesstoken' : $localStorage.get("accesstoken")
		};
		rongCloudService.rongCloudToken(data,function(response){
			//console.log(response);
			if (response.statuscode == CODE_SUCCESS) {
				chatFactory.initRong(appKey,response.data.token);
			} else {
				//TODO
			}
		});
	}

	//聊天消息未读数目
	$rootScope.msgCount = 0;


	var isIOS = ionic.Platform.isIOS();
	var isAndroid = ionic.Platform.isAndroid();
	$rootScope.isIOS = isIOS;
	$rootScope.locationInfo = {};

	//退出app
	$rootScope.exit = function(){
		ionic.Platform.exitApp();
	}

	//版本检查
	$rootScope.versionCheck = function (isShow) {
		$ionicPlatform.ready(function() {
			if (!isIOS) {
				var type = isIOS ? '2' : '1';
				var data = {
					type : type
				};
				rongCloudService.versionCheck(data, function(response){
					if (response.data.length > 0) {
						versionFactory.checkUpdate(response.data[0],type,isShow);
					} else {
						$CommonFactory.showToast("操作失败，请稍后再试","short","bottom");
					}
				});
			}
		});
	}
	var currentPlatform = ionic.Platform.platform();
	var currentPlatformVersion = ionic.Platform.version();
	// console.log(currentPlatform,currentPlatformVersion)
	$rootScope.versionCheck();

	//是否有新版本
	$rootScope.hasNewVersion = function () {
		var type = isIOS ? '2' : '1';
		var data = {
			type : type
		};
		rongCloudService.versionCheck(data, function(response){
			if (response.data.length > 0) {
				versionFactory.isNewVersion(response.data[0].versioncode);
			}
		});
	}


		//游客检查
	// $rootScope.isGuest = $rootScope.getAccessToken() == 'youketoken';
	$rootScope.checkGuest = function() {
		var token = $rootScope.getAccessToken();
		$rootScope.isGuest = (token == 'youketoken');
	}
	$rootScope.checkGuest();

	// 断开，且接收 Push
	$rootScope.disconnect = function(){
		chatFactory.disconnect();
	}




	//app后台运行事件
	$ionicPlatform.on("pause",function(){
		$rootScope.appPause = true;
	});

	//app继续运行事件
	$ionicPlatform.on("resume",function(){
		$rootScope.appPause = false;
		$rootScope.connectionCheck();
		//跳转到会话列表页
		if ($rootScope.msgCount > 0 && $state.current.name != 'chat') {
			$state.go("tab.contact");
		}
	});

	//网络断线事件
	$ionicPlatform.on("offline",function(){
		//console.log("offline");
		// $CommonFactory.showLoadingWithAlert('网络不好，小师妹在路上了~');
		$rootScope.connectionCheck();
	});

	//网络连上了的事件
	$ionicPlatform.on("online",function(){
		$rootScope.connectionCheck();
	});

	//热更新事件监听--即将安装更新
	document.addEventListener('chcp_beforeInstall', hotCodeBeforeUpdate, false);

	//热更新事件监听--已经更新完成
	document.addEventListener('chcp_updateInstalled', hotCodeUpdated, false);

	//即将安装热更新--显示文字提示
	function hotCodeBeforeUpdate(eventData) {
		$CommonFactory.showLoadingWithAlert("安装更新中~请稍等");
	}

	//安装完成热更新--隐藏提示
	function hotCodeUpdated(eventData) {
		$CommonFactory.hideLoading();
	}

	//双击退出
	$ionicPlatform.registerBackButtonAction(function (e) {
		//判断处于哪个页面时双击退出
		if ($state.current.name == 'tab.business' || $state.current.name == 'tab.contact' || $state.current.name == 'tab.community'
			|| $state.current.name == 'tab.mine' || $state.current.name == 'login') {
			if ($rootScope.backButtonPressedOnceToExit) {
				$rootScope.disconnect();
				ionic.Platform.exitApp();
			} else {
				$rootScope.backButtonPressedOnceToExit = true;
				$CommonFactory.showToast('再按一次退出程序',"short","bottom");
				$timeout(
					function () {
					$rootScope.backButtonPressedOnceToExit = false;
				}, 2000);
			}
		}
		else if ($ionicHistory.backView()) {
			if ($ionicHistory.backView().stateName == 'confirmOrder' && $state.current.name == 'intelligoo') {
				$state.go('tab.business');
			} else {
				$ionicHistory.goBack();
			}
		} else {
			// $rootScope.backButtonPressedOnceToExit = true;
			// $CommonFactory.showToast('再按一次退出程序',"short","bottom");
			// $timeout(function () {
			// 	$rootScope.backButtonPressedOnceToExit = false;
			// }, 2000);
			window.history.back();
		}
		e.preventDefault();
		return false;
	}, 101);

	
	//这个方法会导致android启动一直卡在开机动画，就是他↓↓↓----那是因为你没插件，请更新platform目录
	$rootScope.AndroidBackgroundModeInit = function(){
		if (ionic.Platform.isAndroid()) {
			// Android customization
			cordova.plugins.backgroundMode.setDefaults({ 
				text:'小师妹在后台陪着你哦.',
				title: '侠客岛里'
			});
			// Enable background mode
			cordova.plugins.backgroundMode.enable();

			// Called when background mode has been activated
			cordova.plugins.backgroundMode.onactivate = function () {
				$rootScope.appPause = true;
				setTimeout(function () {
					// Modify the currently displayed notification
					cordova.plugins.backgroundMode.configure({
					text:'小师妹在后台陪着你哦.',
					title: '侠客岛里'
					});
				}, 500);
			}
		}
	}


	//平台初始化
	$rootScope.appReady = {status:false};
	$ionicPlatform.ready(function() {

		//键盘初始化--必须放在第一位，否则ios不执行。interesting
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			$rootScope.connectionCheck();
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}

		//通知栏样式初始化
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

		//安卓-初始化后台模式
		$rootScope.AndroidBackgroundModeInit();

		//安卓-权限请求
		AndroidPermissionService.requestPermission();

		//保存umeng
		$rootScope.setUmengToken();

		//锁定屏幕不跟随系统旋转
		screen.lockOrientation('portrait');

		//延迟splash screnn 隐藏时间,不然会有短暂的白屏出现
		setTimeout(function () {
			navigator.splashscreen.hide();
		}, 1500);

		//判断设备剩余存储空间
		if(window.plugins.getOddMemory){
			window.plugins.getOddMemory("",function(data){
					//成功的操作
					if (data.oddMemory < 50) {
						$CommonFactory.showConfirm(
							function(){
								if (isAndroid){
									$rootScope.disconnect();
									ionic.Platform.exitApp();
								}
							},
							"您的手机存储为"+ data.oddMemory + "MB,退出清理一下吧",
							"存储提示",
							"好吧",
							"勉强使用"
							);
					}
				},function(err){
					//失败的操作
				});
		}

		$rootScope.appReady.status = true;
		$rootScope.lastId = "1";//上一条聊天数据的id

	});
	

	

	/**
	 * 判断空对象方法
	 */
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	$rootScope.isEmptyObject = function (obj) {
		// null and undefined are "empty"
		if (obj == null) return true;
		// Assume if it has a length property with a non-zero value
		// that that property is correct.
		if (obj.length > 0) {
			return false;
		}
		if (obj.length === 0) {
			return true;
		}
		// If it isn't an object at this point
		// it is empty, but it can't be anything *but* empty
		// Is it empty?  Depends on your application.
		if (typeof obj !== "object") {
			return true;
		}

		// Otherwise, does it have any properties of its own?
		// Note that this doesn't handle
		// toString and valueOf enumeration bugs in IE < 9
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) {
				return false;
			}
		}

		return true;
	}

	/*处理距离公式 少于1000m显示m为单位 大于1000m 以km为单位*/
	$rootScope.handleDistance = function(distance) {
		if (parseFloat(distance) < 1000) {
			return parseFloat(distance).toFixed(0)+'m';
		} else {
			return (Math.round(distance)/1000).toFixed(2) + 'km';
		}
	}

});

//系统配置
app.config(
	['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
	function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

		// lazy controller, directive and service
		app.controller = $controllerProvider.register;
		app.directive = $compileProvider.directive;
		app.filter = $filterProvider.register;
		app.factory = $provide.factory;
		app.service = $provide.service;
		app.constant = $provide.constant;
		app.value = $provide.value;
	}
]);

/**
 * 错误处理
 */
app.config(["$httpProvider", function ($httpProvider) {
	$httpProvider.interceptors.push('sessionRecoverer');
}]);

app.factory('sessionRecoverer', ['$injector', function ($injector) {
	var sessionRecoverer = {
		responseError: function (response) {
			// Session has expired;
			var $CommonFactory = $injector.get('$CommonFactory');
			//404 not found,500内部服务器错误，504网关超时
			if (response.status == 404 || response.status == 500 || response.status == 504){
				$CommonFactory.hideLoading();
				$CommonFactory.showToast("网络信号不好，请稍后再试","short","bottom");
			}
		}
	};
	return sessionRecoverer;
}]);

/**
 * 路由配置
 */
app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	//导航底部
	$ionicConfigProvider.tabs.position('bottom'); // other values: top
	//	$ionicConfigProvider.platform.android.tabs.style('standard');
	//禁止左滑返回
	$ionicConfigProvider.views.swipeBackEnabled(false);
	//安卓使用原生滚动
	$ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
	//禁用页面切换动画
	$ionicConfigProvider.views.transition("none");

	//默认路由
	$urlRouterProvider.otherwise('/tab/business');

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js
	$stateProvider
	//登陆
	.state('login', {
		url: '/login',
		templateUrl: 'templates/public/login.html',
		cache : false,
		resolve: load([
			'js/services/CommonService.js',
			'js/services/UserService.js',
			'js/controllers/public/LoginController.js'
		])
	})
	//注册
	.state('regist', {
		url: '/regist',
		templateUrl: 'templates/public/regist.html',
		cache: false,
		resolve: load([
			'js/controllers/public/RegistController.js',
			'js/services/CommonService.js',
			'js/services/UserService.js'
		])
	})
	//注册用户服务条款
	.state('tiaokuan', {
		url: '/tiaokuan',
		templateUrl: 'templates/public/tiaokuan.html',
		resolve: load([
			'js/controllers/public/RegistController.js',
		])
	})

	// setup an abstract state for the tabs directive

	// setup an abstract state for the tabs directive

	.state('tab', {
		url: '/tab',
		abstract: true,
		templateUrl: 'templates/tabs.html'
	})
	//商务
	.state('tab.business', {
		url: '/business',
		views: {
			'tab-business': {
				templateUrl: 'templates/tab-business.html',
				resolve: load([
					'js/controllers/business/BusinessController.js',
					'lib/angular-intro.js-master/bower_components/intro.js/introjs.css',
					'js/services/IntelligooService.js',
					'js/services/BusinessService.js',
					'css/index.css'
				])
			}
		}
	})
	//社区-动态
	.state('tab.communitydynamic', {
		url: '/dynamic',
		params:{refresh:true},
		// cache : false,
		views: {
			'tab-community': {
				templateUrl: 'templates/community/community_dynamic.html',
				resolve: load([
					'js/controllers/community/CommunityDynamicController.js',
					'js/services/CommunityService.js',
					'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
					'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
					'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
					'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
					'lib/ion-gallery-0.1.14/src/js/slideAction.js',
					'lib/ion-gallery-0.1.14/src/js/slider.js'
				])
			}
		}
	})
	//联系
	.state('tab.contact', {
		url: '/contact',
		cache:false,
		views: {
			'tab-contact': {
				templateUrl: 'templates/contact/contactlist.html',
				resolve: load([
					'js/controllers/contact/ContactListController.js',
					'js/services/ContactService.js'
				])
			}
		}
	})


	//我的
	.state('tab.mine', {
		url: '/mine/:id',
		cache:false,
		views: {
			'tab-mine': {
				templateUrl: 'templates/tab-mine.html',
				resolve: load([
					'js/controllers/mine/MineController.js',
					'js/services/mine/MineService.js',
					'js/services/CompanyService.js',
					// 'js/services/UserService.js'
				])
			}
		}
	})

	// 关注
	.state('focus', {
		url: '/focus/:id',
		templateUrl: 'templates/mine/mine-focus.html',
		resolve: load([
			'js/controllers/mine/FocusController.js',
			'js/services/mine/MineService.js',
		])
	})

	// 粉丝
	.state('fans', {
		url: '/fans/:id',
		templateUrl: 'templates/mine/mine-fans.html',
		resolve: load([
			'js/controllers/mine/FansController.js',
			'js/services/mine/MineService.js',
		])
	})

	//我的设置
	.state('minesetting', {
		url: '/minesetting',
		templateUrl: 'templates/mine/mine_setting.html',
		resolve: load([
			'js/controllers/mine/MineSettingController.js'
		])
	})

	//修改用户名等信息
	.state('change', {
		url: '/change',
		templateUrl: 'templates/personal/personal_profile_change.html',
		cache : false,
		resolve: load([
			'js/controllers/personal/PersonalProfileChangeController.js',
			'js/services/mine/MineService.js'
		])
	})




	//关于岛里
	.state('about', {
		url: '/about',
		templateUrl: 'templates/mine/about.html',
		resolve: load([
			'js/controllers/mine/AboutController.js',
			'js/services/CommonService.js',
		])
	})

	//去评分
	.state('toScore', {
		url: '/toscore',
		templateUrl: 'templates/mine/to_score.html',
		resolve: load([
			'js/controllers/mine/ToScoreController.js'
		])
	})
	//服务协议
	.state('service_agreement', {
		url: '/service_agreement',
		templateUrl: 'templates/mine/service_agreement.html',
		resolve: load([
			'js/controllers/mine/ServiceAgreementController.js'
		])
	})
	// 新功能介绍
	.state('aboutnewfunction',{
		url:'/aboutnewfunction',
		templateUrl:'templates/mine/about_new_function.html'
	})
	// 扫码下载
	.state('download',{
		url:'/download',
		templateUrl:'templates/mine/download.html',
		resolve: load([
			'js/controllers/mine/DownloadController.js'
		])
	})
	// 更改密码
	.state('changepassword',{
		url:'/changepassword',
		templateUrl:'templates/mine/change_password.html',
		resolve: load([
			'js/controllers/mine/ChangePasswordController.js',
			'js/services/CommonService.js'
		])
	})

	//启动动画
	.state('start', {
		url: '/start',
		cache : false,
		templateUrl: 'templates/start/start.html',
		resolve: load([
			'js/services/CommonService.js',
			'js/services/UserService.js',
			'js/controllers/start/StartController.js'
		])
	})

	//懒加载数据
	function load(srcs, callback) {
		return {
			deps: ['$ocLazyLoad', '$q',
			function ($ocLazyLoad, $q) {
				var deferred = $q.defer();
				var promise = false;
				srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
				if (!promise) {
					promise = deferred.promise;
				}
				angular.forEach(srcs, function (src) {
					promise = promise.then(function () {
						name = src;
						return $ocLazyLoad.load(name);
					});
				});
				deferred.resolve();
				return callback ? promise.then(function () {
					return callback();
				}) : promise;
			}]
		}
	};
});
