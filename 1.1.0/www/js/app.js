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

	//检查融云链接
	$rootScope.connectionCheck = function(){
		//游客模式--不登录融云
		if($rootScope.getAccessToken('youketoken') == "youketoken"){
			return true;
		} else {
			RongCloudLibPlugin.getConnectionStatus(function (ret, err) {
				if(ret && ret.result.connectionStatus=="CONNECTED"){
					return true;
				}
				$rootScope.RongCloudInit();
			});
		}
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


//android定位
	$rootScope.androidPosition = function(){
		function successCallback(data){
			console.log(data);
			if (data.locType == 162) {
				$rootScope.iosPosition();
			}
			else{
				$rootScope.locationInfo.latitude = data.latitude;
				$rootScope.locationInfo.longitude = data.lontitude;
			}
		}
		function failedCallback(data){
			console.log(data);
		}
		$ionicPlatform.ready(function() {
			baidu_location.getCurrentPosition(successCallback, failedCallback);
		});
	}

//ios定位
	$rootScope.iosPosition = function(){
		var onSuccess = function(position) {
		// 百度地图API功能
		//GPS坐标
		var x = position.coords.longitude;
		var y = position.coords.latitude;
		var ggPoint = new BMap.Point(x,y);
		//坐标转换完之后的回调函数
		translateCallback = function (data){
			console.log(data.points)
			if(data.status === 0) {
				$rootScope.locationInfo.latitude = data.points[0].lat;
				$rootScope.locationInfo.longitude = data.points[0].lng;
			}
		}
		var convertor = new BMap.Convertor();
		var pointArr = [];
		pointArr.push(ggPoint);
		convertor.translate(pointArr, 1, 5, translateCallback)
		};
		function onError(error) {
			console.log(error);
		}
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}

	//地图定位--老潘
	$rootScope.reloadPosition = function(){
		if (isAndroid) {
			$rootScope.androidPosition();
		}
		if (isIOS) {
			$rootScope.iosPosition();
		}
	}
	$rootScope.reloadPosition();


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

	//获取友盟devicetoken
	$rootScope.setUmengToken = function(token,user_id){
		var flag = 0;
		$ionicPlatform.ready(function() {
			var umeng_token = $localStorage.getObject(KEY_UMENG_TOKEN);
			//没有保存过token
			if (!umeng_token.token) {
				flag ++;
				if(window.plugins && window.plugins.getUmengDeviceToken){
					window.plugins.getUmengDeviceToken("",function(data){
						//成功的操作
						umeng_token.token = data.token;
						$localStorage.setObject(KEY_UMENG_TOKEN,umeng_token);
					},function(err){
						//失败的操作
					});
				}
			}
			//没有用户id
			if (!umeng_token.user_id || (user_id && user_id != umeng_token.user_id)) {
				flag ++;
				umeng_token.user_id = user_id || $rootScope.getCurrentUser().id;
				$localStorage.setObject(KEY_UMENG_TOKEN,umeng_token);
			}
			//日期变了---umengtoken可能会每日失效
			if (!umeng_token.day || umeng_token.day != new Date().getDate())　{
				flag ++;
				if(window.plugins && window.plugins.getUmengDeviceToken){
					window.plugins.getUmengDeviceToken("",function(data){
						//成功的操作
						umeng_token.token = data.token;
						umeng_token.day = new Date().getDate();
						$localStorage.setObject(KEY_UMENG_TOKEN,umeng_token);
					},function(err){
						//失败的操作
					});
				}
			}
			//调用更新token接口
			if (flag > 0){
				$timeout(function() {
					var data = {
						"accesstoken" : token || $localStorage.get("accesstoken"),
						"device_token" : umeng_token.token
					};
					rongCloudService.deviceToken(data,function(response){});
				}, 1000);
			}
		});
	}

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
	
		//微信分享方法，传入参数分别为：分享显示的标题--title，描述--description，点击分享进入的页面地址--url，
		// 分享到微信好友(传入"Wechat.Scene.SESSION")或是朋友圈(传入"Wechat.Scene.TIMELINE")默认好友--type，
		// 缩略图--thumb，分享成功后回调函数--success，失败后回调函数--fail
		$rootScope.WechatShare = function (title,description,url,type,thumb,success,fail) {
			console.log(1111);
			$CommonFactory.showToast("分享中...","long","center");
			//检测微信是否安装
			Wechat.isInstalled(function (installed) {
				if(!installed){
					alert("您没有安装微信");
				}
			}, function (reason) {
				//console.log(12);
			});
			if(type== undefined){
				type="Wechat.Scene.SESSION";
			}
			if(thumb== undefined){
				thumb="http://www.heroera.com/hicoffice/share/img/hi.jpg";
			}
			if(title== undefined){
				title="侠客岛联合办公室";
			}
			if(description== undefined){
				description="侠客岛联合办公室欢迎您";
			}
			if(url== undefined){
				url="http://www.hi-coffice.com";
			}

			Wechat.share({
				message: {
					title: title,
					description: description,
					thumb: thumb,
					mediaTagName: "侠客岛联合办公室",
					messageExt: "侠客岛联合办公室",
					messageAction: "<action>dotalist</action>",
					media: {
						type: Wechat.Type.WEBPAGE,
						webpageUrl: url
					}
				},
				scene: type=="Wechat.Scene.SESSION"?Wechat.Scene.TIMELINE:Wechat.Scene.SESSION
			}, function () {
				success;
			}, function (reason) {
				console.log(314);
				fail;
			});
		};
		//QQ分享方法，传入参数分别为：分享显示的标题--title，描述--description，点击分享进入的页面地址--url，
		// 缩略图--thumb，分享成功后回调函数--success，失败后回调函数--fail
		$rootScope.QQShare = function(title,description,url,thumb,success,fail){
			$CommonFactory.showToast("分享中...","long","center");
			//检测QQ是否安装
			YCQQ.checkClientInstalled(function(){
			},function(){
				alert("您没有安装QQ");
				// if installed QQ Client version is not supported sso,also will get this error
			});
			if(thumb== undefined){
				thumb="http://www.heroera.com/hicoffice/share/img/hi.jpg";
			}
			var args = {};
			args.url = url;
			args.title = title;
			args.description = description;
			args.imageUrl = thumb;
			args.appName = "侠客岛联合办公室";
			YCQQ.shareToQQ(function(){
				success;
			},function(failReason){
				fail;
			},args);
		}
	//小师妹-统一客服
	$rootScope.initXSM = function(store_id){
		var data;
		if (store_id) {
			//切换了岛，需要重新获取小师妹数据
			data = {
				'accesstoken' : $localStorage.get("accesstoken"),
				'store_id' : store_id
			};
		} else {
			//初始化小师妹
			var temp = $localStorage.getObject(KEY_CITY_SELECT);
			var id = temp.city_id ? temp.city_id : '-1';
			data = {
				'accesstoken' : $localStorage.get("accesstoken"),
				'store_id' : id
			};
		}
		rongCloudService.getServiceId(data, function(response){
			if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
				$CommonFactory.hideLoading();
				$localStorage.setObject(KEY_COMMON_XSM, response.data[0]);
				xsm_info = response.data[0];
				//console.log($localStorage.getObject(KEY_COMMON_XSM));
			}
		});
	}

	//第一次进入，判断是否有小师妹
	var xsm_info = $localStorage.getObject(KEY_COMMON_XSM);
	if ( !xsm_info || !xsm_info.user_id || !xsm_info.user_name) {
		$rootScope.initXSM();
	}

	//保存历史消息到自家server
	var win = function (r) {
		console.log(r);
	}

	var fail = function (error) {
		console.log(error);
	}

	var saveHistoryMsgs = function(msg){
		//消息类型（1表示文字，2表示图片，3表示语音，4个人名片，5公司信息，6产品详情）
		var message_type = '3';
		var data = {
			"to_user_id" : msg.targetId,
			"from_user_id" : $rootScope.getCurrentUser().id,
			"message_content" : msg.content.text || msg.content.voicePath || msg.content.imageUrl || msg.content.data,
			"service_id" : '0',
			"message_id" : msg.messageId,
			"accesstoken" : $localStorage.get("accesstoken"),
			"send_return_status" : JSON.stringify(msg),
			"send_time" : msg.sentTime,
			"message_type" : message_type
		};
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = data.message_content.substr(data.message_content.lastIndexOf('/')+1);
		options.mimeType = "image/jpeg";

		var params = new Object();
		params = data;
		options.params = params;

		var ft = new FileTransfer();
		console.log(options);
		ft.upload(data.message_content, platformServer + 'chat-datas?accesstoken=' + $localStorage.get("accesstoken"), win, fail, options);
	}

	var extra = '0';

	//发送语音消息
	var sendVoiceMessage = function(src,dur){
		var sentTime = new Date().getTime();
		var msg = {
			messageDirection : 'SEND',
			conversationType : 'PRIVATE',
			targetId : xsm_info.user_id,
			objectName: 'RC:VcMsg',
			sentTime : sentTime
		};
		msg.content = {
			voicePath: src,
			duration: dur,
			extra: extra + '+' + sentTime
		};
		var data = {
		conversationType: 'PRIVATE',
		targetId: xsm_info.user_id,
		voicePath: src,
		duration: Number(dur),
		extra: extra + '+' + sentTime
		};
		//融云发送语音消息
		RongCloudLibPlugin.sendVoiceMessage(data,function(ret, err) {
				if (ret) {
					if (ret.status == "prepare") {
						//准备ing
					}
					if (ret.status == "success") {
						msg.messageId = ret.result.message.messageId
						saveHistoryMsgs(msg);
						// alert("success");
						$cordovaToast.show("成功联系小师妹，请注意‘联系’中的回复~", "short", "center")
							.then(function(success) {
							$state.go('tab.business');
							}, function (error) {
							// error
						});
						// 后续加入发送成功后修改显示样式
					}
				}
				if (err) {
					console.log(err);
				}
			}
		);
	}

	//开始录音
	var mediaRec;
	var reordTimeLimit = 60;//录音限制时间--60s
	function start() {
		var src= "";
		var timestamp = new Date().getTime();
		if(isIOS){
			path = window.cordova.file.documentsDirectory;
			src = path + "cordovaIMVoice" + timestamp + ".wav";
			src = src.replace('file://', '');
		}
		else{
			path = window.cordova.file.externalApplicationStorageDirectory;
			src = path + "cordovaIMVoice" + timestamp + ".wav";
		}

		//实例化录音类
		if (mediaRec) {
			mediaRec = {};
		}
		mediaRec = new Media(src,
			// 录音执行函数
			function() {
				//console.log("start():Audio Success");
			},
			// 录音失败执行函数
			function(err) {
				console.log("start():Audio Error: " + JSON.stringify(err)+ "----"+ src);
			}
		);
	}

	var path = "";
	function getNewMediaURL(s) {
		if (isAndroid) {
			return s.replace('file://', '');
		}
		return s.replace('documents://', '');
	}

	//计时器--若60秒后还在录音，停止之
	var timer;
	var recordTimeout = 0;
	var recordTimer = function () {
		timer = $timeout(
			function() {
				if (recording) {
					recordTimeout = 2;
					stopRecord();
				}
		},(reordTimeLimit - 0 -1) * 1000);
	}

	//开始录音
	var recording = false;
	var startRecord = function () {
		angular.element(document.querySelector('#recordCover')).css("display","block");
		recording = true;
		recordTimer();
		//实例化录音类
		start();
		//开始录音
		mediaRec.startRecord();
		dateStart = new Date();
		return false;
	}

	//停止录音
	var stopRecord = function () {
		angular.element(document.querySelector('#recordCover')).css("display","none");
		//阻止超时之后 on-release事件
		if (--recordTimeout == 0) {
			return false;
		}
		recording = false;
		$timeout.cancel(timer);
		//console.log($scope.isRecording);
		if (mediaRec) {
			//结束录音
			mediaRec.stopRecord();
			dateEnd = new Date();
			//释放系统底层的音频播放资源
			mediaRec.release();
			var durTemp = (dateEnd.getTime() - dateStart.getTime())/1000;
			// if(durTemp < 0.5){
			// 	toast("录音时间过短!",'short','bottom');
			// 	return false;
			// }
			sendVoiceMessage(getNewMediaURL(mediaRec.src),Math.ceil(durTemp));
		}
	}

	//去和小师妹聊天的页面
	var chatWithXsm = function () {
		if (!xsm_info.user_id || !xsm_info.user_name) {
			$rootScope.initXSM();
			$state.go($state.current.name);
			$CommonFactory.showLoadingWithAlert("数据准备中~");
			return false;
		}
		  var data = {
			chat_user_id : xsm_info.user_id, //必传  聊天对方id
			chat_user_name : xsm_info.user_name, // 必传 对方名字
			chat_user_face : "",//非必传 自己的头像  
			service_id : 0, //必传 服务（产品）id 
			user_role : 'B',//必传 一般是买方（默认） ‘A’卖方，'B' 买方
			from : $state.current.name, //非必传 来的路由名，用作返回
			is_xsm : true,//非必传，是否从小师妹处点进来  true false
			from_param: {}
		};
		$state.go('chat',{data: data});
	}

	//点击小师妹
	var timeStart = null;
	var timeEnd = null;
	var waitTime = 1000;//300ms之后开始录音
	var chating = false;
	$rootScope.xsm = function (param) {
		if (param) {
			var temp1 = new Date();
			timeStart =  temp1.getTime();
			timer = $timeout(
				function() {
					//waitTime之后 没有被取消，则当做长按事件
					if (!chating) {
						//开始录音
						console.log('开始录音');
						startRecord();
						var chating = false;
					}
			},waitTime);
		} else {
			var temp2 = new Date();
			timeEnd =  temp2.getTime();
			if ((timeEnd - timeStart) < waitTime) {
				//点击事件
				chating = true;
				chatWithXsm();
				$timeout.cancel(timer);
			} else {
				//是长按事件的结束，停止录音
				chating = false;
				stopRecord();
			}
		}
	}

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

	//办公室/位----灵活办公----定制办公
	.state('roomList', {
		url: '/roomList/:com_service_name',
		params: {store_id:null},
		templateUrl: 'templates/business/business_room_list.html',
		resolve: load([
			'js/controllers/business/RoomListController.js',
			'js/services/BusinessService.js'
		])
	})
	//服务产品详情
	.state('businessProduct', {
		url: '/product/:com_service_id',
		templateUrl: 'templates/business/business_product.html',
		params:{from:null,page:null},
		resolve: load([
			'js/controllers/business/BussinessProductController.js',
			'js/services/BusinessService.js',
			'js/services/CommunityService.js',
			'lib/ngCordova/dist/ng-cordova.js'
		])
	})
	//企业服务需求列表
	.state('aboutcompany', {
		url: '/aboutcompany/:com_id',
		templateUrl: 'templates/aboutcompany.html',
		resolve: load([
			'js/controllers/company/CompanyNeedListController.js',
			'js/controllers/company/CompanySumServiceController.js',
			'js/services/UserService.js',
			'js/services/company/CompanySummaryService.js'
		])
	})

	//企业列表
	.state('companylist', {
		url: '/companylist',
		templateUrl: 'templates/company/company_list.html',
		cache : false,
		resolve: load([
			'js/controllers/company/CompanyListController.js',
			'js/services/BusinessService.js',
			'js/services/company/CompanySummaryService.js'
		])
	})
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
	//忘记密码
	.state('forgetpwd', {
		url: '/forgetpwd',
		templateUrl: 'templates/public/forgetpwd.html',
		resolve: load([
			'js/controllers/public/ForgetPwdController.js',
			'js/services/CommonService.js'
		])
	})
	//修改密码
	.state('updetepwd', {
		url: '/updetepwd',
		templateUrl: 'templates/public/updetepwd.html',
		resolve: load([
			'js/controllers/public/UpdetePwdController.js',
			'js/services/CommonService.js'
		])
	})


	//企业logo
	/*.state('comlogo', {
		url: '/comlogo',
		templateUrl: 'templates/company/company_logo.html',
		resolve: load([
			'js/controllers/mine/MineFaceLogoController.js',
			'js/services/mine/MineService.js'
		])
	})*/
	//企业编辑
	.state('comedit', {
		url: '/comedit',
		templateUrl: 'templates/company/company_edit.html',
		resolve: load([
			'js/controllers/company/CompanyEditController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js'
		])
	})
	//企业基础信息编辑
	.state('combase', {
		url: '/combase',
		templateUrl: 'templates/company/company_base_edit.html',
		cache: false,
		resolve: load([
			'js/controllers/company/CompanyEditController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js'
		])
	})
	//企业基础信息
	.state('combasemsg', {
		url: '/combasemsg',
		templateUrl: 'templates/company/company_base_message.html',
		cache:false,
		resolve: load([
			'js/controllers/company/CompanyDetailController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js'
		])
	})
	//企业资质信息编辑
	.state('comaptitude', {
		url: '/comaptitude',
		templateUrl: 'templates/company/company_aptitude_edit.html',
		cache:false,
		resolve: load([
			'js/controllers/company/CompanyEditController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			// 'lib/ion-gallery-0.1.14/src/js/gallery.js',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js',
		])
	})

	//余额列表
	.state('balanceList', {
		url: '/balancelist',
		templateUrl: 'templates/company/balance_list.html',
		resolve: load([
			'js/controllers/company/BalanceListController.js',
			'js/services/company/CompanyBillService.js'
		])
	})
	//企业优惠券列表
	.state('couponList', {
		url: '/couponlist',
		templateUrl: 'templates/company/coupon_list.html',
		resolve: load([
			'js/controllers/company/CouponListController.js',
			'js/services/company/CompanyBillService.js'
		])
	})

	//企业订单列表
	.state('companyBillList', {
		url: '/companybilllist',
		templateUrl: 'templates/company/company_bill_list.html',
		params:{data:{}},
		resolve: load([
			'js/controllers/company/CompanyBillListController.js',
			'js/services/company/CompanyBillService.js'
		])
	})

	//企业账单详情
	.state('companyBillDetail', {
		url: '/companybilldetail/:order_id',
		templateUrl: 'templates/company/company_bill_detail.html',
		resolve: load([
			'js/controllers/company/CompanyBillDetailController.js',
			'js/services/company/CompanyBillService.js'
		])
	})


	//企业资质信息
	.state('comaptitudemsg', {
		url: '/comaptitudemsg',
		cache:false,
		templateUrl: 'templates/company/company_aptitude_message.html',
		resolve: load([
			'js/controllers/company/CompanyDetailController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js'
		])
	})

	//企业审核
	.state('comcheck', {
		url: '/comcheck',
		cache:false,
		templateUrl: 'templates/company/company_check.html',
		resolve: load([
			'js/controllers/company/CompanyCheckController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js'
		])
	})

	//企业标签
	.state('commsgedit', {
		url: '/commsgedit/:type',
		cache:false,
		templateUrl: 'templates/company/company_message_edit.html',
		params:{'value': null,'from':null},
		resolve: load([
			'js/controllers/company/CompanyMessageEditController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js'
		])
	})
	//企业标签
	.state('comtag', {
		url: '/comtag/:type',
		cache:false,
		templateUrl: 'templates/company/company_tag.html',
		params:{'value': null,'from':null},
		resolve: load([
			'js/controllers/company/CompanyTagController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js'
		])
	})
	//企业区域
	.state('comarea', {
		url: '/comarea',
		templateUrl: 'templates/company/company_area.html',
		resolve: load([
			'js/controllers/company/CompanyDetailController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js'
		])
	})
	//企业投递
	.state('compost', {
		url: '/compost',
		cache : false,
		templateUrl: 'templates/company/company_post.html',
		resolve: load([
			'js/controllers/company/CompanyPostController.js',
			'js/services/company/CompanyServiceService.js'
		])
	})
	//企业投递详情
	.state('compostdetail', {
		url: '/compostdetail/:com_service_id',
		templateUrl: 'templates/company/company_post_detail.html',
		resolve: load([
			'js/controllers/company/CompanyPostDetailController.js',
			'js/services/BusinessService.js',
			'js/services/company/CompanyServiceService.js'
		])
	})
	// //企业订单
	// .state('comorders', {
	// 	url: '/comorders',
	// 	cache:false,
	// 	templateUrl: 'templates/company/company_orders.html',
	// 	resolve: load([
	// 		'js/controllers/company/CompanyOrdersController.js',
	// 		'js/services/MineOrdersService.js'
	// 	])
	// })
	// //企业订单详情
	// .state('comordersdetail', {
	// 	url: '/comordersdetail/{detail_id}',
	// 	templateUrl: 'templates/company/company_orders_detail.html',
	// 	resolve: load([
	// 		'js/controllers/company/CompanyOrdersDetailController.js',
	// 		'js/services/MineOrdersService.js'
	// 	])
	// })
	//企业设置
	.state('comsetting', {
		url: '/comsetting',
		templateUrl: 'templates/company/company_setting.html',
		cache:false,
		resolve: load([
			'js/controllers/company/CompanySettingController.js',
			'js/services/SettingSafetyService.js'
		])
	})
	//企业名片
	.state('commsg', {
		//url: '/commsg',
		url: '/commsg/:com_id',
		templateUrl: 'templates/company/company_message.html',
		cache:false,
		//params: {data:{}},
//		params : {'from':null,'from_id':null,data:{}},
		resolve: load([
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js',
			'js/controllers/company/CompanyMessageController.js',
			'js/services/UserService.js',
			'js/services/company/CompanySummaryService.js',
			'js/controllers/community/CommunityController.js',
			'js/services/CommunityService.js',
		])
	})
	//企业--产品详情
	.state('commsgBusinessProduct', {
		url: '/comproduct/:com_service_id',
//		url: '/comproduct',
		templateUrl: 'templates/company/company_business_product.html',
		params: {'from': null,'com_service_id':null},
		resolve: load([
			'js/controllers/company/CompanyBussinessProductController.js',
			'js/services/BusinessService.js',
			'js/services/CommunityService.js'/*,
			'lib/ngCordova/dist/ng-cordova.js'*/
		])
	})
	//企业动态列表
	.state('companyActivelist', {
		url: '/companyActivelist/:com_id',
		templateUrl: 'templates/company/company_active_list.html',
		resolve: load([
			'js/controllers/company/CompanyActiveListController.js',
			'js/services/company/CompanySummaryService.js'
		])
	})
	//企业服务列表
	.state('compServicelist', {
		url: '/compServicelist/:com_id',
		templateUrl: 'templates/company/company_service.html',
		resolve: load([
			'js/controllers/company/CompanySumServiceController.js',
			'js/services/UserService.js',
			'js/services/company/CompanySummaryService.js'
		])
	})
	//企业需求列表
	.state('companyNeedlist', {
		url: '/companyNeedlist/:com_id',
		templateUrl: 'templates/company/company_need.html',
		resolve: load([
			'js/controllers/company/CompanyNeedListController.js',
			'js/services/UserService.js',
			'js/services/company/CompanySummaryService.js'
		])
	})
	//统一客服--部门列表
	.state('department', {
		url: '/department',
		cache : false,
		templateUrl: 'templates/company/department_list.html',
		resolve: load([
			'js/controllers/company/SettingdepartmentController.js',
			'js/services/SettingSafetyService.js',
			'js/services/DeptService.js',
			'js/services/UserService.js'
		])
	})
	//统一客服--员工列表
	.state('staffdept', {
		url: '/staffdept/{dept_id}/{dept_name}',
		templateUrl: 'templates/company/staffdept.html',
		resolve: load([
			'js/controllers/company/SettingDepartmentController.js',
			'js/services/SettingSafetyService.js',
			'js/services/UserService.js',
			'js/services/DeptService.js'
		])
	})
	//统一客服--员工列表
	.state('staffdeptlist', {
		url: '/staffdeptlist/{dept_id}/{dept_name}',
		templateUrl: 'templates/company/staff_deptlist.html',
		resolve: load([
			'js/controllers/company/PersonalDeptListController.js',
			'js/controllers/company/SettingDepartmentController.js',
			'js/services/SettingSafetyService.js',
			'js/services/UserService.js',
			'js/services/DeptService.js'
		])
	})
	//登录成功之后的企业选择列表
	.state('comSelect', {
		url: '/comselect',
		cache : false,
		templateUrl: 'templates/company/company_select_list.html',
		resolve: load([
			'js/controllers/company/CompanySelectListController.js',
			'js/services/CommonService.js',
			'js/services/UserService.js',
			'js/services/CompanyService.js',
		])
	})
	//企业添加
	.state('comAdd', {
		url: '/comadd',
		templateUrl: 'templates/company/company_add.html',
		resolve: load([
			'js/controllers/company/CompanyAddController.js',
			'js/services/CompanyService.js',
			'js/services/CommonService.js',
			'js/services/UserService.js'
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
//		cache:false,
//		params: {refresh:false},
		views: {
			'tab-business': {
				templateUrl: 'templates/tab-business.html',
				resolve: load([
					'js/controllers/business/BusinessController.js',
//					'js/controllers/business/BusinessAllServiceController.js',
					'lib/angular-intro.js-master/bower_components/intro.js/introjs.css',
					'js/services/IntelligooService.js',
					'js/services/BusinessService.js',
					'css/index.css'
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
	//msgpage
	.state('msgpage',{
		'url' : '/msgpage',
		cache : false,
		templateUrl : 'templates/tab-msgpage.html',
		resolve : load([
			'js/controllers/msgpageListController.js',
			'css/index.css'
		])
	})
	//留言列表
	.state('contactcommentlist',{
		'url' : '/contactcommentlist',
		cache : false,
		templateUrl : 'templates/contact/contact_comment_list.html',
		resolve : load([
			'js/controllers/contact/ContactCommentListController.js',
			'js/services/ContactService.js'
		])
	})
	//点赞列表
	.state('contactlikelist',{
		'url' : '/contactlikelist',
		cache : false,
		templateUrl : 'templates/contact/contact_like_list.html',
		resolve : load([
			'js/controllers/contact/ContactLikeListController.js',
			'js/services/ContactService.js'
		])
	})
	//聊天页面
	.state('chat', {
			url: '/chat',
			templateUrl: 'templates/contact/chat.html',
			cache:false,
			params:{data:{}},
			resolve: load([
				'js/controllers/contact/ChatController.js',
				'js/services/ContactService.js',
				'js/services/UserService.js',
				'js/services/CompanyService.js'
			])
		})
	//购买页面
	.state('purchase', {
			url: '/purchase',
			templateUrl: 'templates/purchase/purchase.html',
			cache:false,
			params:{data:{}},
			resolve: load([
				'js/controllers/purchase/PurchaseController.js',
				'js/services/ContactService.js',
				'js/services/UserService.js',
				'js/services/CompanyService.js',
				'js/services/PurchaseService.js'
			])
		})
	//聊天发送产品列表
	.state('chatproductlist',{
		url : '/chatproductlist/:com_id',
		templateUrl : 'templates/contact/product_list.html',
		cache: false,
		resolve: load([
			'js/controllers/contact/ChatProductListController.js',
			'js/services/ContactService.js',
			'js/services/TransferPostDataService.js'
		])
	})
	//聊天页面
	.state('test', {
			url: '/test',
			templateUrl: 'templates/test-chat.html',
			params:{data:{}},
			resolve: load([
				'js/controllers/contact/ChatController.js',
				'js/services/ContactService.js'
			])
		})
		//社区-需求列表
		.state('tab.community', {
			url: '/community',
			// params:{refresh:false},
			cache : false,
			views: {
				'tab-community': {
					templateUrl: 'templates/tab_community.html',
					resolve: load([
						'js/controllers/community/CommunityBoxController.js',
						'js/controllers/community/CommunityServiceController.js',
						'js/controllers/community/CommunityDynamicController.js',
						'js/controllers/community/CommunityActivityController.js',
						'js/services/BusinessService.js',
						'js/services/CommunityService.js',
						'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
						// 'lib/ion-gallery-0.1.14/src/js/gallery.js',
						'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
						'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
						'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
						'lib/ion-gallery-0.1.14/src/js/slideAction.js',
						'lib/ion-gallery-0.1.14/src/js/slider.js'
					])
				}
			}
		})

		//聊天-单条需求
		.state('demanditem', {
			url: '/demanditem/:id',
			templateUrl: 'templates/community/demanditem_item.html',
			params:{from: null},
			resolve: load([
			'js/controllers/community/DemandItemController.js',
			'js/services/CommunityService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			// 'lib/ion-gallery-0.1.14/src/js/gallery.js',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js',
			'lib/angular-intro.js-master/bower_components/intro.js/introjs.css'
			])
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

		//社区-话题
		.state('topiclist', {
			url: '/topiclist',
			params:{refresh:true},
			templateUrl: 'templates/topic/topic_list.html',
			resolve: load([
				'js/controllers/topic/TopicListController.js',
				'js/services/CommunityService.js',
				'js/services/TransferPostDataService.js'
			])
		})


		//聊天-单条动态
		.state('dynamicitem', {
			url: '/dynamicitem/:id',
			templateUrl: 'templates/community/dynamicitem_item.html',
			params:{from: null},
			resolve: load([
			'js/controllers/community/DynamicItemController.js',
			'js/services/CommunityService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			// 'lib/ion-gallery-0.1.14/src/js/gallery.js',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js',
			'lib/angular-intro.js-master/bower_components/intro.js/introjs.css'
			])
		})

		//社区-活动
		.state('tab.communityactivity', {
			url: '/activity',
			params:{refresh:false},
			views: {
				'tab-community': {
					templateUrl: 'templates/community/community_activity.html',
					resolve: load([
						'js/controllers/community/CommunityActivityController.js',
						'js/services/CommunityService.js',
						'lib/angular-intro.js-master/bower_components/intro.js/introjs.css'
					])
				}
			}
		})

		//聊天-单条活动
		.state('activityitem', {
			url: '/activityitem/:id',
			templateUrl: 'templates/community/activityitem_item.html',
			params:{from: null},
			resolve: load([
			'js/controllers/community/ActivityItemController.js',
			'js/services/CommunityService.js',
			'lib/angular-intro.js-master/bower_components/intro.js/introjs.css'
			])
		})


		//社区-动态搜索
		.state('dynamicSearch', {
			url: '/dynamicsearch',
			templateUrl: 'templates/community/dynamic_search.html',
			resolve: load([
				'js/controllers/community/CommunityDynamicSearchController.js',
				'js/services/CommunityService.js'
			])
		})
		//社区-需求搜索
		.state('demandSearch', {
			url: '/demandsearch',
			templateUrl: 'templates/community/demand_search.html',
			resolve: load([
				'js/controllers/community/CommunityDemandSearchController.js',
				'js/services/CommunityService.js'
			])
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

	//我的LOGO
	.state('minefacelogo', {
		url: '/minefacelogo',
		templateUrl: 'templates/mine/mine_face_logo.html',
		resolve: load([
			'js/controllers/mine/MineFaceLogoController.js',
			'js/services/mine/MineService.js'
		])
	})
	//我的订单
	.state('mineorders', {
		url: '/mineorders',
		cache:false,
		templateUrl: 'templates/mine/mine_orders.html',
		resolve: load([
			'js/controllers/mine/MineOrdersController.js',
			'js/services/MineOrdersService.js'
		])
	})
	//订单详情
	.state('ordersdetail', {
		url: '/ordersdetail/{detail_id}',
		templateUrl: 'templates/mine/mine_orders_detail.html',
		resolve: load([
			'js/controllers/mine/MineOrdersDetailController.js',
			'js/services/MineOrdersService.js'
		])
	})
	//确认订单
	.state('confirmOrder', {
		url: '/confirmOrder',
		params:{'data':null},
		cache:false,
		templateUrl: 'templates/purchase/confirmOrder.html',
		resolve: load([
			'js/controllers/purchase/ConfirmOrderController.js',
			'js/services/PurchaseService.js'
		])
	})
	//订购成功
	.state('purchaseSuccess',{
		url:"/purchaseSuccess",
		params:{'data':null},
		templateUrl: 'templates/purchase/purchaseSuccess.html',
		resolve: load([
			'js/controllers/purchase/PurchaseSuccessController.js',
			'js/services/PurchaseService.js'
		])
	})
	//我的订单列表
	.state('mineorderslist', {
		url: '/mineorderslist',
		// cache:false,
		// params:{'from':null},
		templateUrl: 'templates/mine/mine_orders_list.html',
		resolve: load([
			'js/controllers/mine/MineOrdersListController.js',
			'js/services/MineOrdersService.js'
		])
	})
	//全部订单单个详情
	.state('mineorderdetail', {
		url: '/mineorderdetail/:order_id',
		cache:false,
		templateUrl: 'templates/mine/mine_order_detail.html',
		resolve: load([
			'js/controllers/mine/MineOrderDetailController.js',
			'js/services/MineOrdersService.js'
		])
	})
	//我的会员购买统计
	.state('minememberlist', {
		url: '/minememberlist',
		cache:false,
		templateUrl: 'templates/mine/mine_member_list.html',
		resolve: load([
			'js/controllers/mine/MineMemberListController.js',
			'js/services/MineOrdersService.js'
		])
	})
	//我的爱好
	.state('minehobbies', {
		url: '/minehobbies',
		cache:false,
		templateUrl: 'templates/mine/mine_hobbies.html',
		resolve: load([
			'js/controllers/mine/MineHobbiesController.js',
			'js/services/UserService.js'
		])
	})
	//爱好列表
	.state('hobbieslist', {
		url: '/hobbieslist',
		templateUrl: 'templates/mine/hobbies_list.html',
		resolve: load([
			'js/controllers/mine/MineHobbiesController.js',
			'js/services/UserService.js'
		])
	})
	//我的关注
	.state('mineconcern', {
		url: '/mineconcern',
		cache:false,
		templateUrl: 'templates/mine/mine_concern.html',
		resolve: load([
			'js/controllers/mine/MineConcernController.js',
			'js/services/mine/MineConcernService.js',
	 		'js/services/UserService.js',
	 		'js/directives/localStorage.js'
		])
	})
	//身份验证
	.state('idverify',{
		url: '/idverify',
		cache:false,
		templateUrl: 'templates/mine/id_verify.html',
		resolve: load([
			'js/controllers/mine/IdVerifyController.js',
			'js/services/UserService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
		])
	})
	//身份验证状态
	.state('idverifyState',{
		url: '/idverifystate',
		cache:false,
		templateUrl: 'templates/mine/id_verify_state.html',
		resolve: load([
			'js/controllers/mine/IdVerifyStateController.js',
			'js/services/UserService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
		])
	})
	//会员权限
	.state('memauthority',{
		url: '/memauthority',
		templateUrl: 'templates/mine/mem_authority.html',
		resolve: load([
			'js/controllers/mine/MemAuthorityController.js',
			'js/services/UserService.js',
			'js/services/RongYunService.js',
			'js/services/PurchaseService.js'
		])
	})
	//企业资质证明
	.state('aptitudeverify',{
		url: '/aptitudeverify',
		templateUrl: 'templates/company/aptitude_verify.html',
		resolve: load([
			'js/controllers/company/AptitudeVerifyController.js',
			//'js/services/DeptService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			// 'lib/ion-gallery-0.1.14/src/js/gallery.js',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
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


	//消息接收
	.state('msgreceiving', {
		url: '/msgreceiving',
		templateUrl: 'templates/mine/messages_receiving.html',
		resolve: load([
			'js/controllers/mine/MessagesReceivingController.js'
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
	//个人名片
	.state('profile', {
		url: '/profile',
		templateUrl: 'templates/personal/personal_profile.html',
		cache : false,
		params:{data:{}},
		resolve: load([
			'js/controllers/personal/PersonalProfileController.js',
			'js/services/PersonalService.js',
			'js/services/UserService.js',
	  ])
	})

	//个人信息
//	.state('personalmsg', {
//		url: '/personalmsg/{user_id}/{com_id}',
//		templateUrl: 'templates/personal/personal_message.html',
//		params : {'from':null},
//		resolve: load([
//			'js/controllers/personal/PersonalMessageController.js',
//			'js/services/UserService.js',
//			'js/services/mine/MineService.js',
//			'js/services/CommunityService.js',
//			'js/services/company/CompanySummaryService.js'
//		])
//	})
	//个人信息
	.state('personalmsg', {
		url: '/personalmsg/{user_id}/{com_id}',
		templateUrl: 'templates/personal/personal_message.html',
		params : {'from':null},
		cache : false,
		resolve: load([
			'js/controllers/personal/PersonalMessageController.js',
			'js/services/UserService.js',
			'js/services/mine/MineService.js',
			'js/services/PersonalService.js',
			'js/services/CommunityService.js',
			'js/services/company/CompanySummaryService.js'
		])
	})

	//兴趣爱好
	.state('hobbies', {
		url: '/hobbies',
		templateUrl: 'templates/mine/mine_hobbies.html',
		resolve: load([
		'js/controllers/mine/MineHobbiesController.js',
		'js/services/UserService.js',
	  ])
	})

	//地区
	.state('profile_area',{
		url:'/profile_area',
		templateUrl: 'templates/personal/personal_profile_area.html',
		resolve: load([
		'css/style.css',
		'js/controllers/personal/PersonalProfileAreaController.js',
		'js/services/area/PersonalAreaService.js'

		])
	})
	//地区详情
	.state('province_name', {
		url: 'province_name:province_name',
		templateUrl: 'templates/personal/personal_profile_area_detail.html',
		resolve: load([
		'css/style.css',
		'js/controllers/personal/PersonalCityController.js',
		'js/services/area/PersonalCityService.js'

		])
	})
	//我的职业生涯-手机端
	.state('mineoccup', {
		url: '/mineoccup',
		templateUrl: 'templates/mine/mine_occupation.html',
		params:{data:{}},
		cache:false,
		resolve: load([
		'css/style.css',
		'js/controllers/chart.js',
		'js/controllers/mine/MineOccupController.js',
		'js/services/mine/MineService.js',
		'js/services/UserService.js'
		])
	})
	//我的-添加工作经验-手机端
	.state('addoccup', {
		url: '/addoccup',
		templateUrl: 'templates/mine/mine_occup_add.html',
		resolve: load([
		'css/style.css',
		'js/controllers/mine/AddOccupController.js',
		'js/services/mine/MineService.js'
		])
	})
	//我的-编辑工作经验-手机端
	.state('editoccup', {
		url: '/editoccup/:work_id',
		cache:false,
		templateUrl: 'templates/mine/mine_occup_edit.html',
		resolve: load([
			'css/style.css',
			'js/controllers/mine/EditOccupController.js',
			'js/services/mine/MineService.js'
		])
	})
	//我的-添加教育经验-手机端
	.state('addedu', {
		url: '/addedu',
		templateUrl: 'templates/mine/mine_occup_eduadd.html',
		resolve: load([
		'css/style.css',
		'js/controllers/mine/AddEduController.js',
		'js/services/mine/MineService.js'
		])
	})
	//我的-编辑教育经验-手机端
	.state('editedu', {
		url: '/editedu/{edu_id}',
		templateUrl: 'templates/mine/mine_occup_eduedit.html',
		resolve: load([
		'css/style.css',
		'js/controllers/mine/EditEduController.js',
		'js/services/mine/MineService.js'
		])
	})
//我发布的
	.state('minerelease', {
		url: '/minerelease',
		cache : false,
		params:{refresh:false},
		templateUrl: 'templates/mine/mine_release.html',
		resolve: load([
		'js/controllers/mine/MineReleaseController.js',
		'js/services/mine/getMineReleaseListService.js'
		])
	})
	//会员等级
	// .state('memberlevel', {
	// 	url: '/memberlevel',
	// 	templateUrl: 'templates/memberLevel/member_level.html',
	// 	resolve: load([
	// 	'css/style.css',
	// 	'js/controllers/memberLevel/MemberLevelController.js',
	// 	'js/services/HomeService.js',
	// 	'js/services/CommonService.js'
	// 	])
	// })
	//我的报名
	.state('mineenroll', {
		url: '/mineenroll',
		templateUrl: 'templates/mine/mine_enroll.html',
		cache : false,
		resolve: load([
		'css/style.css',
		'js/controllers/mine/MineEnrollController.js',
		'js/services/mine/MineEnrollService.js'
		])
	 })


	/**
	* 组织架构
	*/
	//部门列表
	.state('deptlist', {
		url: '/deptlist',
		templateUrl: 'templates/manage/dept_list.html',
		cache: false,
		resolve: load([
			'js/controllers/manage/DeptListController.js',
			'js/services/DeptService.js',
			'js/services/UserService.js'
		])
	})
	//新增员工
	.state('personaladd', {
		url: '/personaladd/{dept_id}/{dept_name}',
		templateUrl: 'templates/manage/personal_add.html',
		cache: false,
		resolve: load([
			'js/controllers/manage/PersonalAddController.js',
			'js/services/UserService.js'
		])
	})
	//新增部门
	.state('deptadd', {
		url: '/deptadd/{dept_id}/{dept_type}/{dept_name}',
		templateUrl: 'templates/manage/dept_add.html',
		resolve: load([
			'js/controllers/manage/DeptAddController.js',
			'js/services/DeptService.js'
		])
	})
	//编辑员工
	.state('personaledit', {
		url: '/personaledit/{user_id}/{dept_name}',
		templateUrl: 'templates/manage/personal_edit.html',
		resolve: load([
			'js/controllers/manage/PersonalEditController.js',
			'js/services/UserService.js',
			'js/services/AdminService.js',
			'js/directives/localStorage.js'
		])
	})
	//员工列表
	.state('personallist', {
		url: '/personallist/{dept_id}/{dept_name}',
		cache : false,
		templateUrl: 'templates/manage/personal_list.html',
		resolve: load([
			'js/controllers/manage/PersonalListController.js',
			'js/services/DeptService.js'
		])
	})
	//会员列表
	.state('memberList', {
		url: '/memberlist',
		templateUrl: 'templates/manage/member_list.html',
		resolve: load([
			'js/controllers/manage/MemberListController.js',
			'js/services/DeptService.js'
		])
	})

	.state('stafflist', {
		url: '/stafflist/{{dept_id}}',
		templateUrl: 'templates/company/staff_list.html',
		resolve: load([
			'js/controllers/company/StaffListController.js',
			'js/services/SettingSafetyService.js',
			'js/services/DeptService.js'
		])
	})
	//员工详情
	.state('personaldetail', {
		url: '/personaldetail/{user_id}/{dept_name}',
		cache: false,
		templateUrl: 'templates/manage/personal_detail.html',
		resolve: load([
			'js/controllers/manage/PersonalDetailController.js',
			'js/services/AdminService.js'
		])
	})
	//编辑部门
	.state('deptedit', {
		url: '/deptedit/{dept_id}/{dept_name}',
		templateUrl: 'templates/manage/dept_edit.html',
		resolve: load([
		'js/controllers/manage/DeptEditController.js',
		'js/services/DeptService.js'
		])
	})
	//选择部门
	.state('deptselect', {
		url: '/deptselect',
		templateUrl: 'templates/manage/dept_select.html',
		resolve: load([
		'js/controllers/manage/DeptSelectController.js',
		'js/services/DeptService.js'
		])
	})
	//需求管理-手机端
	.state('companypublish', {
		url: '/companypublish/:com_id',
		cache:false,
		//params:{article_target_id:1,article_type_id:1},
		templateUrl: 'templates/company/company_publish.html',
		resolve: load([
		'js/controllers/company/CompanyPublishController.js',
		'js/services/company/CompanyServiceService.js',
		'js/controllers/community/CommunityController.js',
		'js/services/CommunityService.js',
		'js/services/BusinessService.js',
		])
	})
		//活动管理-手机端
	.state('companyactivity', {
		url: '/companyactivity',
		//params:{article_target_id:1,article_type_id:1},
		templateUrl: 'templates/company/activitymanage.html',
		resolve: load([
		'js/controllers/company/ActivityManageController.js',
		'js/services/company/CompanyServiceService.js',
		'js/services/CommunityService.js',
		])
	})
	//发布管理-投给我的
	.state('publishforme', {
		url: '/publishforme/{article_target_id}',
		templateUrl: 'templates/company/publish_forme.html',
		resolve: load([
		'js/controllers/company/PublishForMeController.js',
		'js/services/BusinessService.js',
		'js/services/company/CompanyServiceService.js'
		])
	})

	//报名我的
	 .state('activityforme', {
	 	url: '/activityforme/{article_target_id}',
	 	templateUrl: 'templates/company/activity_forme.html',
	 	resolve: load([
	 	'js/controllers/company/ActivityForMeController.js',
	 	'js/services/BusinessService.js',
	 	'js/services/company/CompanyServiceService.js'
	 	])
	 })

	//会议室预定
	.state('boardroomreservation',{
		url:'/boardroomreservation',
		templateUrl:'templates/customerservice/boardroom_reservation.html',
		cache: false,
		resolve: load([
			'js/controllers/customerservice/BoardroomReservationController.js',
			'js/services/customerservice/CustomerServiceService.js'
		])
	})

	//预约入场
	.state('ordervisit',{
		url:'/ordervisit',
		templateUrl:'templates/customerservice/order_visit.html',
		cache: false,
		resolve: load([
			'js/controllers/customerservice/OrderVisitController.js',
			'js/services/customerservice/CustomerServiceService.js',
			'js/services/UserService.js'
		])
	})

	//意向分岛
	.state('willingisland',{
		url:'/willingisland',
		templateUrl:'templates/customerservice/willing_island.html',
		resolve: load([
			'js/controllers/customerservice/WillingIslandController.js'
		])
	})

	//加班登记
	.state('overtimeregist',{
		url:'/overtimeregist',
		templateUrl:'templates/customerservice/overtime_regist.html',
		cache: false,
		resolve: load([
			'js/controllers/customerservice/OvertimeRegistController.js',
			'js/services/customerservice/CustomerServiceService.js'
		])
	})

	//意见与投诉
	.state('suggestioncomplain',{
		url:'/suggestioncomplain',
		templateUrl:'templates/customerservice/suggestion_complain.html',
		cache: false,
		resolve: load([
			'js/controllers/customerservice/SuggestionComplainController.js',
			'js/services/customerservice/CustomerServiceService.js',
			'js/services/UserService.js'
		])
	})


	//详情介绍
	.state('detailintroduction',{
		url:'/detailintroduction',
		templateUrl:'templates/detailintroduction/detail_introduction.html',
		resolve: load([
		])
	})

	//登记列表
	.state('bookform',{
		url:'/bookform',
		cache:false,
		templateUrl:'templates/mine/book_form.html',
		resolve: load([
		'js/controllers/mine/BookFormController.js',
		'js/services/mine/BookFormService.js'
		])
	})

	//合作事项
	.state('cooperationmatters',{
		url:'/cooperationmatters',
		templateUrl:'templates/mine/cooperation_matters.html',
		resolve: load([
		'js/controllers/mine/CooMattersController.js',
		'js/services/mine/CooMattersService.js'
		])
	})


	//活动参与表格
	.state('activityentryform',{
		url:'/activityentryform',
		templateUrl:'templates/community/activity_entry_form.html',
		resolve: load([
		'js/controllers/community/ActivityEntryForm.js'
		])
	})
	/**
	 * 商务模块
	 */
	//城市选择
	.state('businessCitySelect', {
		url: '/cityselect',
		templateUrl: 'templates/business/business_city_select.html',
		resolve: load([
			'js/controllers/business/BusinessCitySelectController.js',
			'js/services/BusinessService.js'
		])
	})
	//测试百度地图
	.state('businessCitySelectMap', {
		url: '/cityselectmap',
		templateUrl: 'templates/business/map.html',
		resolve: load([
			'js/controllers/business/BusinessCitySelectMapController.js'
		])
	})




	//搜索
	.state('businessSearch', {
		url: '/search',
		templateUrl: 'templates/business/business_search.html',
		cache: false,
		resolve: load([
			'js/controllers/business/BusinessSearchController.js',
			'js/services/BusinessService.js',
			'css/index.css'
		])
	})
	//搜索列表
	.state('businessSearchList', {
		url: '/searchlist/:com_service_type',
		templateUrl: 'templates/business/business_search_list.html',
		// cache: false,
		// params:{data:{}},
		resolve: load([
		'js/controllers/business/BusinessSearchListController.js',
		'js/services/BusinessService.js',
	  ])
	})
	//企业搜索列表
	.state('companysearchlist',{
		url : '/companysearchlist',
		templateUrl : 'templates/business/company_search_list.html',
		//
		params : {data : {}},
		resolve : load ([
			'js/controllers/business/CompanySearchListController.js',
			'js/services/BusinessService.js',
		])
	})
	//需求搜索列表
	.state('needssearchlist',{
		url : '/needssearchlist',
		templateUrl : 'templates/business/needs_search_list.html',
		params : {data : {}},
		resolve : load ([
			'js/controllers/business/NeedsSearchListController.js',
			'js/services/BusinessService.js',
		])
	})
	//服务列表
	.state('businessService', {
		url: '/service',
		templateUrl: 'templates/business/business_service.html',
		cache : false,
		resolve: load([
			'js/controllers/business/BusinessServiceController.js',
			'js/services/BusinessService.js'
		])
	})
	//服务详情列表
	.state('businessServiceType', {
		url: '/servicetype',
		templateUrl: 'templates/business/business_service_type.html',
		resolve: load([
			'js/controllers/business/BusinessServiceController.js',
			'js/services/BusinessService.js'
		])
	})
	//发布类型列表页
	.state('posttypelist',{
		url: '/posttypelist',
		templateUrl: 'templates/community/post_type_list.html',
		resolve: load([
			'js/controllers/community/PostTypeListController.js'
		])
	})
	//发布需求
	.state('postneed',{
		url: '/postneed',
		templateUrl: 'templates/post/post_need.html',
		cache: false,
		resolve: load([
			'js/controllers/post/PostNeedController.js',
			'lib/ngCordova/dist/ng-cordova.js',
			'js/services/TransferPostDataService.js',
			'js/services/CommunityService.js',
			'js/services/post/PostService.js',
			'js/services/BusinessService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
		])
	})
	//发布活动
	.state('postactivity',{
		url: '/postactivity',
		templateUrl: 'templates/post/post_activity.html',
		cache: false,
		resolve: load([
			'js/controllers/post/PostActivityController.js',
			'lib/ngCordova/dist/ng-cordova.js',
			'js/services/TransferPostDataService.js',
			'js/services/post/PostService.js',
			'js/services/CommunityService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
		])
	})
	//发布服务
	.state('postservice',{
		url: '/postservice',
		templateUrl: 'templates/post/post_service.html',
		cache: false,
		resolve: load([
			'js/controllers/post/PostServiceController.js',
			'lib/ngCordova/dist/ng-cordova.js',
			'js/services/TransferPostDataService.js',
			'js/services/CommunityService.js',
			'js/services/post/PostService.js',
			'js/services/BusinessService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
		])
	})
	//发布产品
	.state('postproduct',{
		url: '/postproduct',
		templateUrl: 'templates/community/post_product.html',
		cache: false,
		resolve: load([
			'js/controllers/community/PostProductController.js',
			'lib/ngCordova/dist/ng-cordova.js',
			'js/services/TransferPostDataService.js',
			'js/services/CommunityService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			// 'lib/ion-gallery-0.1.14/src/js/gallery.js',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
		])
	})
	//发布公司简介
	.state('postcompanyintr',{
		url: '/postcompanyintr',
		templateUrl: 'templates/community/post_company_intr.html',
		cache: false,
		resolve: load([
			'js/controllers/community/PostCompanyIntrController.js',
			'lib/ngCordova/dist/ng-cordova.js',
			'js/services/TransferPostDataService.js',
			'js/services/CommunityService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			// 'lib/ion-gallery-0.1.14/src/js/gallery.js',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
		])
	})
	//发布员工简介
	.state('postpersonintr',{
		url: '/postpersonintr',
		templateUrl: 'templates/community/post_person_intr.html',
		cache: false,
		resolve: load([
			'js/controllers/community/PostPersonIntrController.js',
			'lib/ngCordova/dist/ng-cordova.js',
			'js/services/TransferPostDataService.js',
			'js/services/CommunityService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			// 'lib/ion-gallery-0.1.14/src/js/gallery.js',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
		])
	})
	//发布动态
	.state('postdynamic',{
		url: '/postdynamic',
		templateUrl: 'templates/community/post_dynamic.html',
		params: {'from': null, 'topic_title': null},
		cache: false,
		resolve: load([
			'js/controllers/community/PostDynamicController.js',
			'lib/ngCordova/dist/ng-cordova.js',
			'js/services/TransferPostDataService.js',
			'js/services/CommunityService.js',
			'js/services/TopicService.js',
			'lib/ion-gallery-0.1.14/dist/ion-gallery.css',
			// 'lib/ion-gallery-0.1.14/src/js/gallery.js',
			'lib/ion-gallery-0.1.14/src/js/galleryHelper.js',
			'lib/ion-gallery-0.1.14/src/js/galleryConfig.js',
			'lib/ion-gallery-0.1.14/src/js/rowHeight.js',
			'lib/ion-gallery-0.1.14/src/js/slideAction.js',
			'lib/ion-gallery-0.1.14/src/js/slider.js'
		])
	})
	//发布选择行业标签
	.state('postbusinesslabels',{
		url: '/postbusinesslabels',
		templateUrl: 'templates/community/post_business_label.html',
		cache: false,
		resolve: load([
			'js/controllers/community/PostBusinessLabelController.js',
			'js/services/CommunityService.js',
			'js/services/TransferPostDataService.js'

		])
	})
	//发布选择素材列表
	.state('postmateriallist',{
		url : '/postmateriallist/:type',
		templateUrl : 'templates/community/post_material_list.html',
		cache: false,
		resolve: load([
			'js/controllers/community/PostMaterialListController.js',
			'js/services/CommunityService.js',
			'js/services/CompanyService.js',
			'js/services/TransferPostDataService.js'
		])
	})

	//发布选择产品类型
	.state('postproducttype', {
		url : '/postproducttype',
		templateUrl : 'templates/community/post_product_type_first.html',
		cache: false,
		resolve: load([
			'js/controllers/community/PostProductTypeController.js',
			'js/services/CommunityService.js',
			'js/services/TransferPostDataService.js',
			'js/directives/CommonFactory.js',
			'js/services/BusinessService.js'
		])
	})
	//发布选择产品二级类型
	.state('postprodcuttypesecond', {
		url : '/postprodcuttypesecond',
		templateUrl: 'templates/community/post_product_type_second.html',
		params: {item:null},
		cache: false,
		resolve: load([
			'js/controllers/community/PostProductTypeSecondController.js',
			'js/services/CommunityService.js',
			'js/services/CompanyService.js',
			'js/services/TransferPostDataService.js'
		])
	})
	//发布选择服务区域列表
	.state('postproductarea', {
		url : '/postproductarea',
		templateUrl : 'templates/community/post_product_area.html',
		cache: false,
		resolve: load([
			'js/controllers/community/PostProductAreaController.js',
			'js/services/CommunityService.js',
			'js/services/CompanyService.js',
			'js/services/TransferPostDataService.js'
		])
	})
	//发布查看素材详情页面
	.state('postMaterialDetail',{
		url : '/postMaterialDetail/:id',
		templateUrl : 'templates/community/post_material_detail.html',
		params: {'from':null},
		resolve : load([
			'js/controllers/community/PostMaterialDetailController.js',
			'js/services/CommunityService.js',
			'js/services/TransferPostDataService.js'

		])
	})
	//投递产品
	.state('deliverproduct', {
		url : '/deliverproduct',
		templateUrl : 'templates/community/deliver_product.html',
		params : {'com_needs_id':null},
		cache : false,
		resolve : load([
			'js/controllers/community/DeliverProductController.js',
			'js/services/CommunityService.js',
			'js/services/TransferPostDataService.js'
		])
	})
	//投递产品-产品列表
	.state('deliverproductlist',{
		url : '/deliverproductlist',
		templateUrl : 'templates/community/deliver_product_list.html',
		resolve : load([
			'js/controllers/community/DeliverProductListController.js',
			'js/services/CommunityService.js',
			'js/services/TransferPostDataService.js'
		])
	})

	//服务列表二级列表
	.state('businessServiceList', {
		url: '/servicelist/:type_id',
		templateUrl: 'templates/business/business_service_list.html',
		//params: {'from': null},
//		params: {data:{}},
//		cache:false,
		resolve: load([
			'js/controllers/business/BusinessServiceListController.js',
			'js/services/BusinessService.js'
		])
	})

	//全国列表二级列表
	.state('countrylist',{
		url:'/countrylist/:type_id/:store_id',
//		url:'/countrylist',
		//url:'/countrylist',
		templateUrl: 'templates/business/business_country_list.html',
		resolve: load([
			'js/controllers/business/BusinessCountryListController.js',
			'js/services/BusinessService.js'
		])
	})



	//需求详情
	.state('businessNeedsDetail', {
		url: '/businessneedsdetail/:com_needs_id ',
		templateUrl: 'templates/business/business_needs_detail.html',
		params:{from: null,page:null},
		resolve: load([
			'js/controllers/business/BussinessNeedsDetailController.js',
			'js/services/BusinessService.js',
			'js/services/CommunityService.js',
			'lib/ngCordova/dist/ng-cordova.js'
		])
	})

	//找办公室-服务产品详情
	.state('businessFindProduct', {
		url: '/findproduct/:com_service_id',
		templateUrl: 'templates/business/business_find_product.html',
		params: {'from': null,'type_id':null},
		resolve: load([
			'js/controllers/business/BussinessFindProductController.js',
			'js/services/BusinessService.js',
			'js/services/CommunityService.js',
			'lib/ngCordova/dist/ng-cordova.js'
		])
	})
	//会议室列表界面路由
	.state('conferenceRoomList', {
		url : '/conferenceroomlist/:store_id',
		templateUrl : 'templates/business/business_conference_room_list.html',
		resolve: load([
			'js/controllers/business/ConferenceSpaceSlideController.js',
			'js/controllers/business/ConferenceRoomListController.js',
			'js/services/BusinessService.js',
			'js/controllers/business/SpaceRoomListController.js',
			'js/services/BusinessService.js'
		])
	})
	//会议室详情界面路由
	.state('conferenceRoomDetail', {
		url : '/conferenceroomdetail',
		templateUrl : 'templates/business/business_conference_room_detail.html',
		resolve: load([
			'js/controllers/business/ConferenceRoomDetailController.js',
			'js/services/BusinessService.js'
		])
	})
	//会议室预订界面路由
	.state('conferenceRoomBook', {
		cache: false,
		url : '/conferenceroombook/:parent_order_id',
		params:{from: null},
		templateUrl : 'templates/business/business_conference_room_book.html',
		resolve: load([
			'js/controllers/business/ConferenceRoomBookController.js',
			'js/services/BusinessService.js'
		])
	})
	//场地列表界面路由
	.state('spaceRoomList', {
		url : '/spaceroomlist/:store_id',
		templateUrl : 'templates/business/business_space_room_list.html',
		resolve: load([
			'js/controllers/business/SpaceRoomListController.js',
			'js/services/BusinessService.js'
		])
	})
	//场地列表详情界面路由
	.state('spaceRoomDetail', {
		url : '/spaceroomdetail',
		templateUrl : 'templates/business/business_space_room_detail.html',
		resolve: load([
			'js/controllers/business/SpaceRoomDetailController.js',
			'js/services/BusinessService.js'
		])
	})
	//场地预订界面路由
	.state('spaceRoomBook', {
		cache: false,
		url : '/spaceroombook/:parent_order_id',
		params:{from: null},
		templateUrl : 'templates/business/business_space_room_book.html',
		resolve: load([
			'js/controllers/business/SpaceRoomBookController.js',
			'js/services/BusinessService.js'
		])
	})
	//查看所有发布界面路由
	.state('businessallposts', {
		url : '/businessallposts',
		templateUrl : 'templates/business/business_all_posts_old.html',
		cache : false,
		resolve: load([
			'js/controllers/business/BusinessAllPostsSlideController.js',
			'js/controllers/business/BusinessAllActivityController.js',
			'js/controllers/business/BusinessAllNeedController.js',
			'js/controllers/business/BusinessAllRecommandController.js',
			'js/controllers/business/BusinessAllServiceController.js',
			'js/services/CommunityService.js',
			'js/services/BusinessService.js',
			'js/directives/CommonFactory.js'
		])
	})
//	//服务产品详情--详情
//	.state('businessProductDetail', {
//		url: '/productdetail/:com_service_id/:com_article_material_id',
//		templateUrl: 'templates/business/business_product_detail.html',
//		resolve: load([
//			'js/controllers/business/BusinessProductDetailController.js',
//			'js/services/MaterialService.js',
//			'js/services/CommunityService.js'
//		])
//	})

	//1.1.1-空间产品详情
	// .state('spaceproductdetail', {
	// 	url : '/spaceproductdetail',
	// 	templateUrl : 'templates/business/business_space_product_detail.html',
	// 	resolve: load([
	// 		'js/controllers/business/SpaceProductDetailController.js',
	// 		'js/services/BusinessService.js'
	// 	])
	// })
	//测试card
	.state('testcard',{
		url:'/testcard',
		templateUrl : 'templates/contact/test_card.html',
		resolve : load([
			'js/controllers/contact/ChatCardTestController.js'
		])
	})
	//蓝牙门禁
	.state('intelligoo', {
		url : '/intelligoo',
		cache : false,
		params: {from:{}},
		templateUrl : 'templates/intelligoo/intelligoo_list.html',
		resolve : load([
			'js/controllers/intelligoo/IntelligooController.js',
			'js/services/IntelligooService.js'
		])
	})

	.state('paytest', {
		url: '/paytest',
		cache : false,
		templateUrl : 'templates/paytest.html',
		resolve : load([
			'js/controllers/payCtrl.js',
		])
	})
	//话题详情
	.state('topicdetail', {
		url: '/topicdetail/:topic_id',
		cache : false,
		params:{refresh:true},
		templateUrl: 'templates/topic/topic_detail.html',
		resolve: load([
			'js/controllers/topic/TopicDetailController.js',
			'js/services/TopicService.js',
			'js/services/TransferPostDataService.js'
		])
	})

	//申请话题
	.state('topicapply', {
		url: '/topicapply',
		cache: false,
		params : {from:''},
		templateUrl: 'templates/topic/topic_apply.html',
		resolve: load([
			'js/controllers/topic/TopicApplyController.js',
			'js/services/TopicService.js'
		])

	})

	//发布话题
	.state('topicpost', {
		url: '/topicpost',
		cache: false,
		templateUrl: 'templates/topic/topic_post.html',
		resolve: load([
			'js/controllers/topic/TopicPostController.js',
			'js/services/TopicService.js',
			'js/services/TransferPostDataService.js'
		])

	})
	//选择发布话题
	.state('topicselect', {
		url: '/topicselect',
		cache: false,
		templateUrl: 'templates/topic/topic_select.html',
		resolve: load([
			'js/controllers/topic/TopicSelectController.js',
			'js/services/TopicService.js',
			'js/services/TransferPostDataService.js'
		])

	})
	//岛里APP使用情况反馈
	.state('feedback', {
		url: '/feedback',
		cache: false,
		templateUrl: 'templates/feedback.html',
		resolve: load([
			'js/controllers/FeedbackController.js',
			'js/services/UserService.js',
		])
	})
	//反馈表2
	.state('feedback2', {
		url: '/feedback2',
		cache: false,
		templateUrl: 'templates/feedback2.html',
		resolve: load([
			'js/controllers/Feedback2Controller.js',
			'js/services/UserService.js',
		])
	})
	//会员默认首页
	.state('newbusiness', {
		url: '/newbusiness',
		cache: false,
		templateUrl: 'templates/tab-newbusiness.html',
		resolve: load([
			'js/controllers/business/BusinessController.js',
			'css/index.css'
		])
	})
	.state('myofficezone', {
		url: '/myofficezone',
		cache: false,
		templateUrl: 'templates/tab-myofficezone.html',
		resolve: load([
			'js/controllers/mine/MyOfficeZoneController.js'
		])
	})

	/*****办公申请******/
	//办公手册
	.state('officeBook', {
		url: '/officebook',
		
		templateUrl: 'templates/officenedd/office_book.html',
		resolve: load([
			'js/controllers/officenedd/OfficeBookController.js',
			'js/services/OfficeBookService.js'
		])
	})
	.state('officeBookList', {
		url: '/officebooklist',
		// cache: false,
		params :{type:null},
		templateUrl: 'templates/officenedd/office_book_list.html',
		resolve: load([
			'js/controllers/officenedd/OfficeBookListController.js',
			'js/services/OfficeBookService.js'
		])
	})
	//办公手册-入驻通知
	.state('entryNotice', {
		url: '/entrynotice/:id',
		// cache: false,
		templateUrl: 'templates/officenedd/entry_notice.html',
		resolve: load([
			'js/controllers/officenedd/EntryNoticeController.js',
			'js/services/OfficeBookService.js'
		])
	})
	//办公手册-入驻手续清单
	.state('entryLst', {
		url: '/entrylist/:id',
		// cache: false,
		templateUrl: 'templates/officenedd/entry_list.html',
		resolve: load([
			'js/controllers/officenedd/EntryListController.js',
			'js/services/OfficeBookService.js'
		])
	})
	//办公手册-离店登记
	.state('checkoutReg', {
		url: '/checkoutreg/:id',
		// cache: false,
		templateUrl: 'templates/officenedd/checkout_reg.html',
		resolve: load([
			'js/controllers/officenedd/CheckOutRegController.js',
			'js/services/OfficeBookService.js'
		])

	})
	//办公手册-手册
	.state('entryBook', {
		url: '/entrybook',
		// cache: false,
		templateUrl: 'templates/officenedd/entry_book.html',
		resolve: load([
			'js/controllers/officenedd/EntryBookController.js',
		])
	})
	//快递
	.state('expressform', {
		url: '/expressform',
		cache: false,
		templateUrl: 'templates/officenedd/express_form.html',
		resolve: load([
			'js/controllers/officenedd/ExpressController.js',
			'js/services/WorkOrderService.js'
		])
	})
	//快递查询
	.state('expresscheck', {
		url: '/expresscheck',
		cache: false,
		templateUrl: 'templates/officenedd/express_check.html',
		resolve: load([
			'js/controllers/officenedd/ExpressCheckController.js',
			'js/services/ExpressService.js'
		])
	})
	//维修申请
	.state('maintenance', {
		url: '/maintenance',
		cache: false,
		templateUrl: 'templates/officenedd/maintenance_application.html',
		resolve: load([
			'js/controllers/officenedd/MaintenAppliController.js',
			'js/services/WorkOrderService.js'
		])
	})
	//保洁申请
	.state('cleaningappli', {
		url: '/cleaningappli',
		cache: false,
		templateUrl: 'templates/officenedd/cleaning_application.html',
		resolve: load([
			'js/controllers/officenedd/CleaningController.js',
			'js/services/WorkOrderService.js'
		])
	})
	//上门服务
	.state('personalservice', {
		url: '/personalservice',
		cache: false,
		templateUrl: 'templates/officenedd/personal_service.html',
		resolve: load([
			'js/controllers/officenedd/PesonalServController.js',
			'js/services/WorkOrderService.js'
		])
	})
	//定制办公
	// .state('customoffice', {
	// 	url: '/customoffice',
	// 	templateUrl: 'templates/customNeed/custom_office.html',
	// 	cache: false,
	// 	resolve: load([
	// 		'js/controllers/CustomNeed/CustomOfficeController.js',
	// 		'js/services/CustomNeed/CustomNeedService.js'

	// 	])
	// })
	//闲置出租
	// .state('leaverent', {
	// 	url: '/leaverent',
	// 	templateUrl: 'templates/customNeed/leave_rent.html',
	// 	cache: false,
	// 	resolve: load([
	// 		'js/controllers/CustomNeed/LeaveRentController.js',
	// 		'js/services/CustomNeed/CustomNeedService.js'

	// 	])
	// })
	//侠客寓介绍
	.state('xiakeyu', {
		url: '/xiakeyu',
		templateUrl: 'templates/xiakeyu.html',
		resolve: load([
			'js/controllers/XiaKeYuController.js',
			'js/services/UserService.js',
		])
	})
	//定制办公需求列表
	// .state('customNeed', {
	// 	url: '/customNeed',
	// 	templateUrl: 'templates/customNeed/custom_need.html',
	// 	cache: false,
	// 	resolve: load([
	// 		'js/controllers/CustomNeed/CustomNeedController.js',
	// 		'js/services/CustomNeed/CustomNeedService.js'
	// 	])
	// })
	//定制办公所属行业列表
	// .state('customTradeList', {
	// 	url: '/customTradeList',
	// 	templateUrl: 'templates/customNeed/custom_trade_list.html',
	// 	cache: false,
	// 	resolve: load([
	// 		'js/controllers/CustomNeed/CustomTradeController.js',
	// 		'js/services/CustomNeed/CustomNeedService.js'
	// 	])
	// })

	/***开始办公***/
	//我要招聘
	.state('employ', {
		url : '/employ',
		templateUrl : 'templates/startwork/employ.html',
		resolve: load([
			'js/controllers/startwork/EmployController.js',
			'js/services/BusinessService.js'
		])
	})
	//招聘提交
	.state('submitemploy', {
		url: '/submitemploy',
		cache:false,
		templateUrl: 'templates/startwork/submitemploy.html',
		resolve: load([
			'js/controllers/startwork/SubmitEmployController.js',
			'js/services/BusinessService.js'
		])
	})
	//财务服务
	.state('finance', {
		url : '/finance',
		templateUrl : 'templates/startwork/finance.html',
		resolve: load([
			'js/controllers/startwork/FinanceController.js',
			'js/services/BusinessService.js'
		])
	})
	//法律助手
	.state('legal', {
		url : '/legal',
		templateUrl : 'templates/startwork/legal.html',
		resolve: load([
			'js/controllers/startwork/LegalController.js',
			'js/services/BusinessService.js'
		])
	})
	//整合营销
	.state('market', {
		url : '/market',
		templateUrl : 'templates/startwork/market.html',
		resolve: load([
			'js/controllers/startwork/MarketController.js',
			'js/services/BusinessService.js'
		])
	})
	//政策申报
	.state('policy', {
		url : '/policy',
		templateUrl : 'templates/startwork/policy.html',
		resolve: load([
			'js/controllers/startwork/PolicyController.js',
			'js/services/BusinessService.js'
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

//						if (JQ_CONFIG[src]) {
//							return $ocLazyLoad.load(JQ_CONFIG[src]);
//						}
//						angular.forEach(MODULE_CONFIG, function (module) {
//							if (module.name == src) {
//								name = module.name;
//							} else {
//								name = src;
//							}
//						});
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
