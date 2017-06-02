/**
 * 聊天控制器
 */
app.controller('ChatController',
	['$scope', '$window','$timeout','$rootScope','$state', '$localStorage','$anchorScroll', 'ContactService', '$sce','$compile','$ionicHistory',
	'$cordovaCamera', '$cordovaMedia','$CommonFactory','$cordovaImagePicker','UserService','CompanyService','$cordovaLocalNotification','rongCloudService',
		function ($scope, $window,$timeout, $rootScope,$state, $localStorage,$anchorScroll, ContactService, $sce, $compile,$ionicHistory,
		 $cordovaCamera, $cordovaMedia, $CommonFactory,$cordovaImagePicker,UserService,CompanyService,$cordovaLocalNotification,rongCloudService) {

	var accesstoken = $rootScope.getAccessToken();

	$scope.canMore = false;
	$scope.isMore = false;
	$scope.isContent = false;
	$scope.isVoice = false;
	$scope.isImageShow = false;
	$scope.isFocused = false;
	$scope.arrMsgs = new Array();
	$scope.historyMsgs = new Array();
	$scope.conversationType = 'PRIVATE';
	$scope.isSystem = false;//来自系统的消息
	$scope.serviceItem = {};
	$scope.latMsgTime = 0;//默认--上一条消息的时间戳
	$scope.chatBanner = true;
	var reordTimeLimit = 60;//录音限制时间--60s
	var dateStart,dateEnd;//开始，结束录音时间
	var extra = "";//extra信息
	var sendCount = 0;//每条消息尝试标为已读的次数
	var readTimeout = 3000;//每条消息尝试标为已读的间隔时间
	var updateArray = [];//标为已读的队列
	var updating = false;//是否正在更新标为已读
	var currentPage = 0;

	$rootScope.msgCount = 0;

	var isIOS = ionic.Platform.isIOS();
	var isAndroid = ionic.Platform.isAndroid();

	var pathTemp = $localStorage.getObject(KEY_COMMON_PATH);
	$scope.route_path = pathTemp.route_path;
	$scope.path = pathTemp.route_path + pathTemp.photo_path;
	$scope.service_path = pathTemp.route_path + pathTemp.service_path;
	$scope.chat_stuff_path = pathTemp.route_path + pathTemp.chat_stuff_path;

	var errGone = function (err) {
		if(err && err.code == -10000 || err.code == 30002){
			$scope.toast("聊天服务器连接中，请稍候~","center","long");
			//重新初始化融云
			$rootScope.rongCloudInit();
		}
	}

	//处理名字等超长
	$scope.nameString = function (item) {
		item = item + "";
		if (item.length > 30) {
			return item.substring(0,29) + "...";
		}
		return item
	}

	//跳转到页尾
	$scope.goto = function(history){
		if (history) {
			//加载最新消息数据，滚动到底部
			$timeout(
				function() {
					$anchorScroll('xuanTop');
			},400);
		} else {
			//加载历史数据，滚动到顶部
			$timeout(
				function() {
					$anchorScroll('xuanBottom');
			},600);
		}
	}

	//调用原生的toast
	$scope.toast = function(message, duration, position){
		$CommonFactory.showToast(message, duration, position);
	}

	$scope.send = {};
	$scope.$watch('send.newMessage', function (newValue, oldValue) {
		if (!newValue) {
			$scope.canMore = true;//显示+号按钮
		} else {
			$scope.canMore = false;
		}
	}, true);

	//当前用户id
	var user = $rootScope.getCurrentUser();
	if (user && user.id){
		$scope.userId = user.id;
		$scope.userFace = user.photo;
		$scope.user = user;
	} else {
		$CommonFactory.showBaseConfirm(function () {
				$localStorage.removeAll();
				$state.go("login");
			},"登录信息有误,获取不到用户数据,即将重新登录");
		return false;
	}

	//跳转到购买
	$scope.toOrder = function(){
		var data = {
			com_service_id : $scope.serviceItem.com_service_id,
			target_id : $scope.targetId,
			com_id : $scope.serviceItem.com_id
		};
		$state.go('purchase',{data: data});
	}

	//跳转到产品选择
	$scope.chooseProduct = function(){
		$state.go('chatproductlist', {com_id:$scope.user.com_id});
	}

	//准备发送名片的字段
	$scope.sendNameCard = function () {
		var userData = {
			'accesstoken': accesstoken,
		};
		UserService.userMine(userData, function (response) {
			if (response.statuscode == CODE_SUCCESS) {
				var data = {
					name : response.data.userInfo.name,
					com_name : response.data.userInfo.com_name,
					photo : $scope.path + response.data.userInfo.photo,
					id : response.data.userInfo.id,
					com_id : user.com_id
				};
				$scope.sendCustomMsg('grmp',data);
			}
		});
	}

	var isTimeShow = function (temp) {
		temp.showTime = false;
		if ( temp.send_time - $scope.latMsgTime > 300000) {
			//跟上一条消息时间间隔超过5分钟，则显示时间
			temp.showTime = true;
		}
		$scope.latMsgTime = temp.send_time;
		return temp;
	}

	//准备发送公司信息的字段
	$scope.sendCompanyDetail = function(){
		if (!$scope.user.com_id) {
			$scope.toast("您还没有加入公司哦~",'long','bottom');
			return false;
		}
		var temp = {
			id : $scope.user.com_id,
			accesstoken : accesstoken
		};
		CompanyService.companyData(temp,function(response){
			if (response.statuscode == CODE_SUCCESS) {
				var data = {
					id : $scope.user.com_id,
					logo : pathTemp.host_path + '/' + pathTemp.com_logo_path + response.data.com_logo_path,
					com_name : response.data.com_name,
					summary : response.data.comments ? (response.data.comments.length < 13 ? response.data.comments : response.data.comments.substring(0,12)+"...") : "暂无描述",
					address : response.data.com_address
				};
				$scope.sendCustomMsg('gsxx',data);
			}
		});
	}

	//从自家server获取历史消息
	$scope.getChatHistory = function(refresher){
		var data = {
			to_user_id : $scope.targetId,
			accesstoken : accesstoken,
			currentPage : ++currentPage
		};
		ContactService.chatHistory (data,function(response){
			if (response.statuscode == CODE_SUCCESS && response.data && response.data.length != 0) {
				var j = response.data.length;
				for (var i = 0 ;i < j ; i ++) {
					var msg = {};
					msg = response.data[i];
					msg = isTimeShow(msg);
					if(typeof(msg.message_content) == 'string'){
						msg.message_content = $sce.trustAsHtml(msg.message_content);
					}
					$scope.historyMsgs.unshift(msg);
					if (currentPage > 1) {
						$scope.goto(true);
					} else {
						$scope.goto();
					}
					if ( i == (j - 0 - 1) &&　currentPage == 1) {
						//第一次进入，需要从localstorage中获取未读数据
						$scope.compareList();
					}
				}
			} else if(currentPage == 1){
				//第一次进入，需要从localstorage中获取未读数据
				$scope.compareList();
			} else if (response.data.length == 0) {
				$scope.toast("没有更多消息了~",'short','center');
				refresher.complete();
			}
		});
	}

	//服务详情
	var getServiceDetail = function(){
		if ($scope.serviceItem.com_service_id == '0') {
			$scope.chatBanner = false;
			return false;
		}
		if ($scope.serviceItem.com_service_id) {
			var data = {
				accesstoken : accesstoken,
				com_service_id : $scope.serviceItem.com_service_id
			};
			ContactService.getOneService (data,function(response){
				if (response.statuscode == CODE_SUCCESS && response.data.length != 0) {
					$scope.chatBanner = true;
					$timeout(
						function () {
						$scope.serviceItem = response.data;
					}, 100);
				} else {
					$scope.chatBanner = false;
				}
			});
		}
	}

	//正在发送中的消息显示--push到数组中
	var appendNewMsg = function(msg) {
		$scope.isMore = false;
		msg = isTimeShow(msg);
		$scope.arrMsgs.push(msg);
		$scope.goto();
	}

	var win = function (r) {
		//console.log(JSON.stringify(r));
	}

	var fail = function (error) {
		console.log(JSON.stringify(error));
		$scope.toast("云保存历史消息失败=.=","long","center");
	}

	//保存语音，图片消息到服务器
	var svaeHistoryMsgsWithFile = function(msg,data){
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = data.message_content.substr(data.message_content.lastIndexOf('/')+1);
		options.mimeType = "image/jpeg";

		var params = new Object();
		params = data;
		options.params = params;

		var ft = new FileTransfer();
		ft.upload(data.message_content, $window.platformServer + 'chat-datas?accesstoken=' + accesstoken, win, fail, options);
	}

	//保存一份历史消息到当前两人的会话中
	var saveExtraHistory = function (msg,message_type) {
		var data = {
			"to_user_id" : $scope.targetId,
			"from_user_id" : $scope.userId,
			"message_content" : msg.content.data,
			"service_id" : $scope.serviceItem.com_service_id,
			"message_id" : msg.messageId,
			"accesstoken" : accesstoken,
			"send_return_status" : JSON.stringify(msg),
			"send_time" : msg.sentTime,
			"message_type" : message_type
		};
		ContactService.chatDatas(data,function(response){
			//console.log(data);
		});
	}

	//保存历史消息到自家server
	var svaeHistoryMsgs = function (msg) {
		//消息类型（1表示文字，2表示图片，3表示语音，4个人名片，5公司信息，6产品详情，9系统消息）
		var message_type = $scope.switchType(msg);
		var from_user_id =  $scope.userId;
		var to_user_id = $scope.targetId;
		var data = {
			"to_user_id" : to_user_id,
			"from_user_id" : from_user_id,
			"message_content" : msg.content.text || msg.content.voicePath || msg.content.imageUrl || msg.content.data,
			"service_id" : $scope.serviceItem.com_service_id,
			"message_id" : msg.messageId,
			"accesstoken" : accesstoken,
			"send_return_status" : JSON.stringify(msg),
			"send_time" : msg.sentTime,
			"message_type" : message_type
		};
		if (message_type== 2 || message_type == 3) {
			svaeHistoryMsgsWithFile(msg,data);
			//return true;
		} else if (message_type == 9) {
			//当前聊天与预定的不是同一个
			if ($scope.lastXsm != $scope.targetId) {
				saveExtraHistory(msg,message_type);
			}
			var temp = data;
			//temp.from_user_id = '0000';
			temp.to_user_id = $scope.lastXsm;
			//存消息
			ContactService.chatDatas(temp,function(response){
				////console.log(response);
			});
		} else {
			ContactService.chatDatas(data,function(response){
				////console.log(response);
			});
		}
	}

	//去录音
	$scope.toVioce = function () {
		$scope.isVoice = true;
		$scope.canMore = true;
	}

	//发送文字消息
	$scope.sendMsg = function() {
		var sentTime = new Date().getTime();
		var data = {
			conversationType: $scope.conversationType,
			targetId: $scope.targetId,
			text: $scope.send.newMessage,
			extra: $scope.serviceItem.com_service_id + '+' + sentTime
		};
		var msg = {
			messageDirection : 'SEND',
			conversationType : $scope.conversationType,
			targetId : $scope.targetId,
			objectName: 'RC:TxtMsg',
			sentTime : sentTime
		};
		msg.content = {
			text: $scope.send.newMessage,
			extra: $scope.serviceItem.com_service_id + '+' + sentTime
		};
		$scope.send.newMessage = "";
		$scope.isMore = false;
		appendNewMsg(msg);
		RongCloudLibPlugin.sendTextMessage(data,function(ret, err) {
			if (ret) {
				//console.log(ret);
				if (ret.status == "prepare") {
					//融云准备发送
				}
				if (ret.status == "success") {
					msg.messageId = ret.result.message.messageId
					svaeHistoryMsgs(msg);
					////console.log(JSON.stringify(ret));
					//alert("success");
					// 后续加入发送成功后修改显示样式
				}
			}
			if (err) {
				////console.log("sendTextMessage error: " + JSON.stringify(err));
					errGone(err);
			}
		});
	}

	//发送语音消息
	var sendVoiceMessage = function(src,dur){

		var sentTime = new Date().getTime();
		var msg = {
			messageDirection : 'SEND',
			conversationType : $scope.conversationType,
			targetId : $scope.targetId.toString(),
			objectName: 'RC:VcMsg',
			sentTime : sentTime
		};
		msg.content = {
			voicePath: src,
			duration: dur,
			extra: $scope.serviceItem.com_service_id + '+' + sentTime
		};
		$scope.isMore = false;
		appendNewMsg(msg);
		var data = {
		conversationType: $scope.conversationType,
		targetId: $scope.targetId.toString(),
		voicePath: src,
		duration: Number(dur),
		extra: $scope.serviceItem.com_service_id + '+' + sentTime
		};
		//融云发送语音消息
		RongCloudLibPlugin.sendVoiceMessage(data,function(ret, err) {
				if (ret) {
					if (ret.status == "prepare") {
						//准备ing
					}
					if (ret.status == "success") {
						msg.messageId = ret.result.message.messageId
						svaeHistoryMsgs(msg);
						// alert("success");
						// 后续加入发送成功后修改显示样式
					}
				}
				if (err) {
					errGone(err);
				}
			}
		);
	}


	//开始录音
	var mediaRec;
	function start() {
		var src= "";
		var timestamp = new Date().getTime();
		if(isIOS){
			path = cordova.file.documentsDirectory;
			src = path + "cordovaIMVoice" + timestamp + ".wav";
			src = src.replace('file://', '');
		}
		else{
			path = cordova.file.externalApplicationStorageDirectory;
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

	//播放录音
	$scope.isPlaying = false;
	$scope.play = function(voiFile,duration,thisSendTime,voiFile_server) {
		if ($scope.isPlaying && $scope.thisSendTime == thisSendTime) {
			//点击正在播放这一条，停止播放
			$scope.isPlaying = false;
			mediaRec.stop();
			mediaRec.release();
			return true;
		}
		if ($scope.isPlaying && $scope.thisSendTime != thisSendTime) {
			//点击未播放的一条，停止播放正在播放
			mediaRec.stop();
			mediaRec.release();
		}
		$scope.thisSendTime = thisSendTime;
		$scope.isPlaying = true;
		mediaRec = $cordovaMedia.newMedia(voiFile,
			// 成功操作
			function (success) {
				//console.log(success);
			},
			// 失败操作
			/* 媒体状态：
			Media.MEDIA_NONE = 0;
			Media.MEDIA_STARTING = 1;
			Media.MEDIA_RUNNING = 2;
			Media.MEDIA_PAUSED = 3;
			Media.MEDIA_STOPPED = 4;
			*/
			function (error) {
				if (error && voiFile_server) {
					//没有找到资源，尝试播放服务器录音文件
					$scope.play($scope.chat_stuff_path + voiFile_server,duration,thisSendTime);
					return true;
				} else {
					//console.log(error);
					$scope.isPlaying = false;
					//$scope.toast("-_-播放失败",'short','center');
				}
			},function(status){
				//console.log(status);
			}
		);
		//IOS only options
		var options = {
			playAudioWhenScreenIsLocked : false,
			numberOfLoops: 1
		};
		mediaRec.play(options);
		$timeout(
			function() {
				$scope.isPlaying = false;
		},duration * 1000);
	};

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
				if ($scope.recording) {
					recordTimeout = 2;
					$scope.stopRecord();
				}
		},(reordTimeLimit - 0 -1) * 1000);
	}

	//开始录音
	$scope.startRecord = function () {
		$scope.isRecoding(true);
		recordTimer();
		//实例化录音类
		start();
		//开始录音
		mediaRec.startRecord();
		dateStart = new Date();
		return false;
	}

	//停止录音
	$scope.stopRecord = function () {
		$scope.isRecoding(false);
		//阻止超时之后 on-release事件
		if (--recordTimeout == 0) {
			return false;
		}
		$timeout.cancel(timer);
		//console.log($scope.isRecording);
		if (mediaRec) {
			//结束录音
			mediaRec.stopRecord();
			dateEnd = new Date();
			//释放系统底层的音频播放资源
			mediaRec.release();
			var durTemp = (dateEnd.getTime() - dateStart.getTime())/1000;
			if(durTemp < 0.5){
				$scope.toast("录音时间过短!",'short','bottom');
				return false;
			}
			sendVoiceMessage(getNewMediaURL(mediaRec.src),Math.ceil(durTemp));
		}
	}

	//拍照
	$scope.takePhoto = function(){
		getPhoto(Camera.PictureSourceType.CAMERA);
		return false;
	}

	//调起拍照接口，存图
	var getPhoto = function(sourceType) {
		var options = {
			quality: 80,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: sourceType,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 480,
			targetHeight: 800,
			saveToPhotoAlbum: true,
			allowEdit:true,
			cropwindiw:0 //0正方形 1长方形 2 无限制
		};

		$cordovaCamera.getPicture(options).then(function(imageURI) {
			// ////console.log($stateParams.conversationType + '--' + imageURI);
			var picPath = imageURI;
			var sentTime = new Date().getTime();
			////console.log("getPicture:" + picPath);
			if(isIOS){
				picPath = imageURI.replace('file://','');
			}
			if(isAndroid){
				picPath = imageURI;
			}
			var data = {
				conversationType: $scope.conversationType,
				targetId: $scope.targetId,
				imagePath: picPath,
				extra: $scope.serviceItem.com_service_id + '+' + sentTime
			};
			var msg = {
				messageDirection : 'SEND',
				conversationType : $scope.conversationType,
				targetId : $scope.targetId.toString(),
				objectName: 'RC:ImgMsg',
				sentTime : sentTime
			};
			msg.content = {
				imageUrl: picPath,
				extra: $scope.serviceItem.com_service_id + '+' + sentTime
			};
			$scope.isMore = false;
			appendNewMsg(msg);
			$scope.sendImageMessage(msg,data);
		}, function(err) {
			console.log(err);
		});
	};

	//直接发图
	$scope.sendPicture = function(){
		var options = {
			quality: 80,
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
			maximumImagesCount: 5,
			width: 480,
			height: 800
		};
		$cordovaImagePicker.getPictures(options).then(function (results) {
			var tempLen = results.length;
			for (var i = 0; i < tempLen; i++) {
				var sentTime = new Date().getTime();
				var picPath = results[i];
				////console.log("getPicture:" + picPath);
				if(isIOS){
					picPath = picPath.replace('file://','');
				}
				if(isAndroid){
					picPath = picPath;
				}
				var data = {
					conversationType: $scope.conversationType,
					targetId: $scope.targetId,
					imagePath: picPath,
					extra: $scope.serviceItem.com_service_id + '+' + sentTime
				};
				var msg = {
					messageDirection : 'SEND',
					conversationType : $scope.conversationType,
					targetId : $scope.targetId.toString(),
					objectName: 'RC:ImgMsg',
					sentTime : sentTime
				};
				msg.content = {
					imageUrl: picPath,
					extra: $scope.serviceItem.com_service_id + '+' + sentTime
				};
				$scope.isMore = false;
				appendNewMsg(msg);
				$scope.sendImageMessage(msg,data);
			}
		}, function(error) {
			console.log(error);
		});
	}

	//发图
	$scope.sendImageMessage = function(msg,data) {
		RongCloudLibPlugin.sendImageMessage(data,function (ret, err) {
			//JSON.stringify(ret);
			if (ret) {
				if (ret.status == "prepare") {
				}
				if (ret.status == "success") {
					msg.messageId = ret.result.message.messageId
					svaeHistoryMsgs(msg);
					// 后续加入发送成功后修改显示样式
				}
			}
			if (err) {
				errGone(err);
			}
		});
	}

	//发送自定义消息--个人名片--公司详情--产品等
	$scope.sendCustomMsg = function(type,data,target){
		var sentTime = new Date().getTime();
		var extra = $scope.serviceItem.com_service_id + '+' + sentTime;
		var targetId = target ? target : $scope.targetId.toString();
		var msg = {
			messageDirection : 'SEND',
			conversationType : $scope.conversationType,
			targetId : targetId,
			objectName: 'RC:CmdNtf',
			sentTime : sentTime,
		};
		msg.content = {};
		msg.content = {
			name : type,
			data : data,
			extra: extra
		};
		$scope.isMore = false;
		appendNewMsg(msg);
		data.extra = extra;
		var temp = {
			conversationType: $scope.conversationType,
			targetId: targetId,
			name: type,
			data: JSON.stringify(data)
		};
		RongCloudLibPlugin.sendCommandNotificationMessage(temp, function (ret, err) {
				if (err) {
					errGone(err);
					return false;
				}
				if (ret.status == 'prepare'){
					//console.log(ret);
				}else if (ret.status == 'success'){
					msg.messageId = ret.result.message.messageId;
					//清除产品信息
					$localStorage.setObject(KEY_PRODUCT_DI,"");
					//清除预约信息
					$localStorage.setObject(KEY_XSM_ORDER,"");
					if ( type=='xtxx' && target) {
						return true;
					}
					svaeHistoryMsgs(msg);
				}else if (ret.status == 'error'){
					console.log(ret);
				}
			}
		);
	}

	$scope.timeString = function(timestamp){
		console.time('timer');
		timestamp = Number(timestamp);
		var time = new Date();
		var timestampNow = new Date().getTime();
		var timeObj = new Date(timestamp);
		var MsgYear = timeObj.getFullYear();
		var MsgMonth = timeObj.getMonth() - 0 + 1;
		var MsgDate = timeObj.getDate();

		var NowYear = time.getFullYear();
		var NowMonth = time.getMonth() - 0 + 1;
		var NowDate = time.getDate();
		var timePassby = parseInt((timestampNow - timestamp)/(1000*60));//从发送消息已经过去**分钟
		//console.log(timeObj.getDate() == new Date(timestampNow).getDate());
		if (timePassby <= 2){
			//2min以内
			return "刚刚";
		} else if(timePassby <= 10){
			//10min以内
			return timePassby + "分钟前";
		} else if(MsgDate == NowDate){
			//同一天
			if (timeObj.getMinutes() <10) {
				return timeObj.getHours() + ':0' + timeObj.getMinutes();
			}
			return timeObj.getHours() + ':' + timeObj.getMinutes();
		} else if (MsgMonth == NowMonth && MsgYear == NowYear){
			//同一月
			if (timeObj.getMinutes() <10) {
				return MsgMonth + '月' + MsgDate + '日 ' + timeObj.getHours() + ':0' + timeObj.getMinutes();
			}
			return MsgMonth + '月' + MsgDate + '日 ' + timeObj.getHours() + ':' + timeObj.getMinutes();
		} else {
			if (timeObj.getMinutes() <10) {
				return MsgYear + '年' +MsgMonth + '月' + MsgDate + '日 ' + timeObj.getHours() + ':0' + timeObj.getMinutes();
			}
			return MsgYear + '年' +MsgMonth + '月' + MsgDate + '日 ' + timeObj.getHours() + ':' + timeObj.getMinutes();
		}
		console.timeEnd('timer');
	}

	//实际执行更新的操作
	$scope.doUpdate = function(){
		if (updateArray[0]) {
			updating = true;
			var item = updateArray[0];
			sendCount ++ ;
			var message_type =  $scope.switchType(item);
			var send_time = item.content.extra.split('+')[1];
			var data = {
				"to_user_id" : $scope.userId,
				"from_user_id" : $scope.targetId,
				"send_time" : send_time,
				"read_time" : new Date().getTime(),
				"read_return_status" : JSON.stringify(item),
				"message_content_received" : item.content.text || item.content.voicePath || item.content.imageUrl,
				"message_type" : message_type,
				"accesstoken" : accesstoken
			};
			ContactService.updateHistory(data,function(response){
				if (response.statuscode == CODE_SUCCESS) {
					sendCount = 0;
					updating = false;
					updateArray.splice(0,1);
					if (updateArray[0]) {
						$scope.doUpdate();
					}
					//console.log("保存已读信息成功");
				}else if (response.statuscode == '-3' && sendCount < 2) {
					updating = false;
					//console.log("第" + sendCount + "次尝试保存已读信息失败");
					//该条消息数据还在上传中
					$timeout(
						function () {
							$scope.doUpdate();
					},readTimeout);
				} else if (response.statuscode == '-3' && sendCount > 2) {
					updating = false;
					//放弃第一条
					updateArray.splice(0,1);
					sendCount = 0;
					$scope.doUpdate();
				}
				//console.log(response);
			});
		}
	}

	//更新自家服务器上的历史消息---加入队列
	$scope.updateHistory = function(item){
		if (item && updating) {
			updateArray.push(item);
		} else if(item) {
			updateArray.push(item);
			sendCount = 0;
			$scope.doUpdate();
		}
	}

	//其他空间与服务咨询
	$scope.otherService = function(){
		var msg = {};
		msg.senderUserId = $scope.targetId;
		msg.messageDirection = 'RECEIVE';
		msg.sentTime = new Date().getTime();
		msg.objectName = 'RC:TxtMsg';
		msg.content = {};
		msg.content.text = "有什么话可以直接对我说哟~";
		msg = isTimeShow(msg);
		$scope.arrMsgs.push(msg);
		$scope.goto();
	}

	//拼接小师妹问候字段
	$scope.xsmGreet = function(){
		var msg = {};
		msg.senderUserId = $scope.targetId;
		msg.messageDirection = 'RECEIVE';
		msg.sentTime = new Date().getTime();
		msg.objectName = 'RC:TxtMsg';
		msg.content = {};
		var outer;
		var html = "<span>欢迎使用快捷表单，请选择您需要的服务</span><br><ul class='chat-service-menu'><li><a ui-sref='ordervisit'>预约入场</a></li><li><a ng-click='overtimeregist()'>加班登记</a></li><li><a ng-click='suggestioncomplain()'>意见与投诉</a></li><li><a ng-click='otherService()'>其他空间与服务咨询</a></li></ul>";
		// var node = $compile(html)($rootScope);
		// outer = node[0].outerHTML + node[1].outerHTML + node[2].outerHTML;
		msg.content.text = $sce.trustAsHtml(html);
		msg = isTimeShow(msg);
		$scope.arrMsgs.push(msg);
		$scope.goto();
	}

	$scope.overtimeregist = function(){
		if($rootScope.isGuest){
			$state.go('login');
		}else{
			$state.go('overtimeregist');
		}
	}
	$scope.suggestioncomplain = function(){
		if($rootScope.isGuest){
			$state.go('login');
		}else{
			$state.go('suggestioncomplain');
		}
	}

	//遍历localstorage数据，取得本会话中的消息
	$scope.compareList = function(){
		$scope.checkUnsend();
		var receivedUreadMsg = $localStorage.getObject(KEY_UNREAD_MSG);
		var len2 = receivedUreadMsg.length;
		if (len2) {
			for ( var j = 0 ;j< len2 ; j++){
				if ( j == len2 -1 && $scope.is_xsm) {
					//拼接小师妹问候字段
					$scope.xsmGreet();
				}
				//收到消息，来源id、服务id（extra）一致
				if (receivedUreadMsg[j].objectName == "RC:CmdNtf") {
					receivedUreadMsg[j].content.data = typeof(receivedUreadMsg[j].content.data) == 'object' ?  receivedUreadMsg[j].content.data : JSON.parse(receivedUreadMsg[j].content.data);
					receivedUreadMsg[j].content.extra = receivedUreadMsg[j].content.data.extra;
					receivedUreadMsg[j].extra = receivedUreadMsg[j].content.extra;
				}
				if( $scope.targetId == receivedUreadMsg[j].senderUserId){
					var msg = receivedUreadMsg[j];
					msg = isTimeShow(msg);
					if(msg.content.text && (typeof(msg.content.text) == 'string')) {
						msg.content.text = $sce.trustAsHtml(msg.content.text);
					}
					$scope.arrMsgs.push(msg);
					$scope.goto();
					$scope.updateHistory(receivedUreadMsg[j]);
					receivedUreadMsg.splice(j,1);
					len2 --;
					j = j - 1;
					$localStorage.setObject(KEY_UNREAD_MSG,receivedUreadMsg);
				}
			}
		} else {
			if ($scope.is_xsm) {
				//拼接小师妹问候字段
				$scope.xsmGreet();
			}
		}
	}

	$scope.switchType = function(msg){
		switch (msg.objectName) {
		case 'RC:TxtMsg':
			return '1';
		case 'RC:VcMsg':
			return '3';
		case 'RC:ImgMsg':
			return '2';
		case 'RC:CmdNtf':
			switch (msg.content.name) {
				case 'grmp':
					return '4';
				case 'gsxx':
					return '5';
				case 'cpxq':
					return '6';
				case 'dianzan':
					return '7';
				case 'liuyan':
					return '8';
				case 'xtxx':
					return '9';
				case 'yhgx':
					return '10';
				default:
					return '0';
			}
		default:
			return '0';
		}
	}

	//假装录一下音 让用户授权录音---安卓6.0以下
	var quanxianInit = function(){
		start();
		if (mediaRec) {
			mediaRec.startRecord();
			mediaRec.stopRecord();
			mediaRec.release();
		}
	}

	//去发语音
	$scope.toVoice = function () {
		$scope.isVoice = true;
		$scope.canMore = true;
		cordova.plugins.Keyboard.close();
	}

	//点击加号
	$scope.More = function () {
		$scope.isMore = !$scope.isMore;
		$scope.isContent = false;
		cordova.plugins.Keyboard.close();
	}

	//返回按钮
	$scope.back = function(){
		if ($ionicHistory.backView()) {
			$ionicHistory.goBack();
		} else {
			$state.go('tab.contact');
		}
	}

	$scope.showPic = function(i){
		$scope.isrc = i;
		$scope.isImageShow = true;
	}

	$scope.isRecoding = function (param) {
		$scope.recording = param;
		if (param) {
			angular.element(document.querySelector('#recordWrap')).css("display","block");
		} else {
			angular.element(document.querySelector('#recordWrap')).css("display","none");
		}
	}

	//判断传入的对象是否为空对象--为空则返回false
	var hasProp = function (obj) {
		var flag = false;
		if (typeof obj === "object" && !(obj instanceof Array)){
			for (var prop in obj){
				flag = true;
				break;
			}
		}
		return flag;
	}


	//检查是否有未发送的产品信息
	$scope.checkUnsend = function () {
		var product_di = $localStorage.getObject(KEY_PRODUCT_DI);
		var xsm_order = $localStorage.getObject(KEY_XSM_ORDER);
		if (product_di.com_service_id) {
			//更新头部产品信息
			$scope.serviceItem = product_di;
			//角色转换
			$scope.user_role = 'A';
			$scope.paramsData = $localStorage.getObject(KEY_THIS_SESSION);
			$scope.paramsData.user_role= 'A';
			$scope.paramsData.com_service_id = product_di.com_service_id;
			$scope.paramsData.com_service_thumb = product_di.com_service_thumb;
			$scope.paramsData.com_service_name = product_di.com_service_name;
			//发送产品详情
			var data = {
				id : product_di.com_service_id,
				thumb : pathTemp.route_path + pathTemp.service_thumb_path + product_di.com_service_thumb[0],
				title : product_di.com_service_name.length < 13 ? product_di.com_service_name : product_di.com_service_name.substring(0,12) + "...",
				content : product_di.com_service_des ? (product_di.com_service_des.length < 13 ? product_di.com_service_des : (product_di.com_service_des.substring(0,12) + "..."))  : "暂无描述",
				com_name : product_di.com_name
			};
			$scope.sendCustomMsg('cpxq',data);
			$timeout(
				function () {
					$scope.serviceItem = {};
					$scope.serviceItem = product_di;
				},100);
			$localStorage.setObject(KEY_THIS_SESSION,$scope.paramsData);
		}
		if (hasProp(xsm_order)) {
			if ( xsm_order.store_id instanceof Array || !xsm_order.store_id) {
				xsm_order.store_id = "-1";
			}
			var data1 = xsm_order;
			var data2 = {
				'accesstoken' : accesstoken,
				'store_id' : xsm_order.store_id
			};
			rongCloudService.getServiceId(data2, function(response){
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.lastXsm = response.data[0].user_id;//最后一条预约对应的小师妹id
					if ($scope.lastXsm == $scope.targetId){
						$scope.sendCustomMsg('xtxx',data1);//发给小师妹
					} else {
						$scope.sendCustomMsg('xtxx',data1);//发给刚当前聊天的小师妹
						$scope.sendCustomMsg('xtxx',data1,$scope.lastXsm);//发给预约、登记岛的小师妹
					}
				}
			});
		}
	}

	//读消息
	var readMsg = function () {
		//来自系统消息
		if ($scope.targetId == '0000'){
			$scope.isSystem = true;
			var data = {
				accesstoken: accesstoken
			};
			ContactService.readSysMsg(data,function(response){
				//
			});
		} else {
		//普通消息
			var data = {
				accesstoken: accesstoken,
				from_user_id: $scope.targetId
			};
			ContactService.readMsg(data,function(response){
				//
			});
		}
	}

	//数据准备
	$scope.dataPrepare = function(){
		//接收路由传来的数据
		if($state.params.data && $state.params.data.hasOwnProperty("chat_user_id")){
			$localStorage.setObject(KEY_THIS_SESSION,$state.params.data);
			$scope.targetId = $state.params.data.chat_user_id;
			$scope.face = $state.params.data.user_face || $state.params.data.chat_user_face;
			$rootScope.chat_user_name = $state.params.data.chat_user_name;
			$scope.serviceItem.com_service_id = $state.params.data.service_id;
			$scope.user_role = $state.params.data.user_role;
			$scope.is_xsm = $state.params.data.is_xsm ? $state.params.data.is_xsm : false;
			$scope.from = $state.params.data.from ? $state.params.data.from : "";
			//服务详情
			getServiceDetail();
			//历史消息
			$scope.getChatHistory();
		} else {
			//从localstorage取数据
			$scope.paramsData = $localStorage.getObject(KEY_THIS_SESSION);
			$scope.targetId = $scope.paramsData.chat_user_id;
			$scope.face = $scope.paramsData.user_face || $scope.paramsData.chat_user_face;
			$rootScope.chat_user_name = $scope.paramsData.chat_user_name;
			$scope.serviceItem.com_service_id = $scope.paramsData.service_id;
			$scope.user_role = $scope.paramsData.user_role;
			$scope.is_xsm = $scope.paramsData.is_xsm ? $scope.paramsData.is_xsm : false;
			$scope.from = $scope.paramsData.from ? $scope.paramsData.from : "";
			//服务详情
			getServiceDetail();
			//历史消息
			$scope.getChatHistory();
		}
		//清除未读系统消息
		readMsg();
	}
	$scope.dataPrepare();

	//处理融云发来的即时消息
	var unread = function (event,data) {
		if ($state.current.name == 'chat') {
			// console.log('chat');
			if( $scope.targetId == data.msg.senderUserId){
				var msg = data.msg;
				var index = data.index;
				if (msg.objectName == "RC:CmdNtf") {
					msg.content.data = typeof(msg.content.data) == 'object' ? msg.content.data : JSON.parse(msg.content.data);
					msg.content.extra = msg.content.data.extra;
					msg.extra = msg.content.extra;
					if (msg.content.name=='cpxq') {
						$scope.user_role = 'B';
						$scope.serviceItem.com_service_id = msg.content.data.extra.split('+')[0];
						getServiceDetail();
					}
				}
				if(msg.content.text && (typeof(msg.content.text) == 'string')) {
					msg.content.text = $sce.trustAsHtml(msg.content.text);
				}
				$scope.updateHistory(msg);
				msg = isTimeShow(msg);
				$timeout(function(){
					$scope.arrMsgs.push(msg);
				},100);
				$scope.goto();
				var temp = $localStorage.getObject(KEY_UNREAD_MSG);
				temp.splice(index,1);
				$localStorage.setObject(KEY_UNREAD_MSG,temp);
			} else {
				// console.log('xuan2');
			}
		}
	}

	$rootScope.$on("newMsg",unread);

	//进入时
	$scope.$on('$ionicView.beforeEnter', function(){
		updating = false;
		$scope.inChat = true;
		//检查融云链接
		if (window.cordova && window.cordova.plugins) {
			$rootScope.connectionCheck();
		}
		$scope.isRecoding(false);
		//console.log('before');
	});

	//离开时停止播放音乐，释放资源
	$scope.$on('$ionicView.beforeLeave', function(){
		$scope.inChat = false;
		if (mediaRec) {
			mediaRec.stop();
			mediaRec.release();
		}
		unread = function () {
			return false;
		}
	});

	//清除消息通知,检查融云链接，关闭键盘
	var notificationClear = function () {
		if (window.cordova && window.cordova.plugins) {
			$rootScope.connectionCheck();
			$cordovaLocalNotification.clearAll();
			cordova.plugins.Keyboard.close();
		}
	}
	notificationClear();

	//input foused event
	$scope.foucus = function(){
		$scope.isMore = false;
	}

	//input blur event
	$scope.blur = function(){
		$scope.isMore = false;
	}

	window.addEventListener('native.keyboardshow', keyboardShowHandler);

	function keyboardShowHandler(e){
		if($state.current.name == "chat"){
			document.getElementById("chat-msg-input").focus();
		}
	}

	window.addEventListener('native.keyboardhide', keyboardHideHandler);

	function keyboardHideHandler(e){
		if($state.current.name == "chat"){
			document.getElementById("chat-msg-input").blur();
		}
	}


}]);
