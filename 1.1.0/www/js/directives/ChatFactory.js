/**
 * 聊天 方法类
 */
angular.module('chatFactory',[])
.service('chatFactory', function($localStorage,$rootScope,$CommonFactory,$cordovaLocalNotification,$state,$timeout) {
	var service = {
		initRong : function(appKey,token) {

			//初始化
			RongCloudLibPlugin.init({
					appKey: appKey
				},
				function (ret, err) {
					if (ret) {
						//console.log('init:' + JSON.stringify(ret));
					}
					if (err) {
						//$.toast(err.code, "forbidden");
						//console.log('init error:' + JSON.stringify(err));
					}
				}
			);

			//连接状态监听
			var timer;
			RongCloudLibPlugin.setConnectionStatusListener(
				function(ret, err) {
					if (ret.result.connectionStatus) {
						console.log(JSON.stringify(ret));
						switch (ret.result.connectionStatus) {
							case 'KICKED':
								$localStorage.removeAll();
								$CommonFactory.showToast("您的帐号已在其他端登录","long","center",
									function() {
										$rootScope.rongYunLogout();
										$state.go('login');
								});
								break;
							case 'DISCONNECTED':
								$rootScope.connectionCheck();
								break;
							case 'NETWORK_UNAVAILABLE':
								$CommonFactory.hideLoading();
								$CommonFactory.showToast('网络不好，小师妹在路上了~',"short","bottom");
								break;
							case 'CONNECTED':
								$timeout.cancel(timer);
								$CommonFactory.hideLoading();
								if ($rootScope.showLoadingWithAlert) {
									//断网重连之后 重新加载页面
									//location.reload();
								}
								break;
							default :
								break;
						}
					}
					if (err) {
					}
				}
			);

			//建立连接
			RongCloudLibPlugin.connect({
					token: token
				},
				function(ret, err) {
					if (ret) {
						//console.log('connect:' + JSON.stringify(ret));
						//myUtil.setUserId(ret.result.userId);
						// $state.go('tab.friends', {
						// 	userId: ret.result.userId
						// }, {
						// 	reload: true
						// });
					}
					if (err) {
						//未初始化
						if(err.result.code == -10000){
							//重新初始化融云
							$rootScope.rongCloudInit();
						}
						//token错误
						if(err.result.code == -31004){
							//重新初始化融云
							$rootScope.rongCloudInit();
						}
					}
				}
			);

			//消息类型转换
			var switchType = function(msg){
				switch (msg.objectName) {
				case 'RC:TxtMsg':
					return '文字';
				case 'RC:VcMsg':
					return '语音';
				case 'RC:ImgMsg':
					return '图片';
				case 'RC:CmdNtf':
					switch (msg.content.name) {
						case 'grmp':
							return '个人名片';
						case 'gsxx':
							return '公司信息';
						case 'cpxq':
							return '产品详情';
						case 'dianzan':
							return '点赞';
						case 'liuyan':
							return '留言';
						case 'xtxx':
							return '系统消息';
						case 'yhgx':
							return '用户信息更新';
						default:
							return '消息';
					}
				default:
					return '消息';
				}
			}

			//消息类型转换
			var switchTypeNumber = function(msg){
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

			//发送消息通知
			var notification = function (data) {
				var typeNumber = switchTypeNumber(data.msg);
				var type = switchType(data.msg);
				if (typeNumber != 7 && typeNumber != 8 && typeNumber != 0 && typeNumber != 10) {
					$rootScope.$broadcast("newMsg", data);
				} else if(typeNumber == 7){
					//点赞
					$rootScope.$broadcast("newDianZan", data);
				} else if(typeNumber == 8){
					//留言
					$rootScope.$broadcast("newLiuyan", data);
				} else if(typeNumber == 10){
					//用户信息更新
					$rootScope.$broadcast("userInfoUpdate", data);
				}
				var temp = $localStorage.getObject(KEY_THIS_SESSION);
				if ((!$rootScope.appPause && $state.current.name=="chat" && temp.chat_user_id == data.msg.targetId) || (!$rootScope.appPause && $state.current.name=="tab.contact")) {
					return true;
				} else if(typeNumber != 10) {
					var alarmTime = new Date();
					$cordovaLocalNotification.schedule({
						id: data.msg.sentTime,
						at: alarmTime,
						title: "侠客岛里",
						text: "您有一条新消息"
					}).then(function(){
					});
				}
			}

			//监听收到消息
			RongCloudLibPlugin.setOnReceiveMessageListener(
				function(ret, err) {
					if (ret) {
						console.log('收到消息:' + JSON.stringify(ret));
						$rootScope.msgCount ++ ;//tab中显示的未读消息数加一
						var arrMsgs = new Array();
						var temp = $localStorage.getObject(KEY_UNREAD_MSG);
						arrMsgs = Array.isArray(temp) ? temp : [];
						var index = arrMsgs.length ? arrMsgs.length : 0;
						arrMsgs.push(ret.result.message);
						var data = {
							msg : ret.result.message,
							index : index,
							id : ret.result.message.sentTime + ret.result.message.senderUserId
						};
						var typeNumber = switchTypeNumber(data.msg);
						if (typeNumber != 7 && typeNumber != 8 && typeNumber != 10) {
							$localStorage.setObject(KEY_UNREAD_MSG,arrMsgs);
						}
						notification(data);
					}
					if (err) {
						if(err.result.code == -10000){
							//重新初始化融云
							$rootScope.rongCloudInit();
						}
					}
				}
			);
		},

		//检查是否链接了融云
		connectionCheck : function(){
			RongCloudLibPlugin.getConnectionStatus(function (ret, err) {
				if(ret && ret.result.connectionStatus=="CONNECTED"){
					return true;
				}
				return false;
				//$rootScope.rongCloudInit();
			});
		},

		// 断开融云链接，且不再接收 Push
		rongCloudLogout : function(){
			RongCloudLibPlugin.logout(function (ret, err) {

			});
		},

		// 断开，且接收 Push
		disconnect :function(){
			RongCloudLibPlugin.disconnect({isReceivePush: true},
				function(ret, err){
					console.log(ret);
			}); 
		} ,

		// 发送自定义类型的消息
		sendCustomMsg : function(targetId,type,data,serviceId){
			var extra = serviceId ? serviceId : 0;//默认没有服务
			var sentTime = new Date().getTime();
			extra = extra + '+' + sentTime;
			data.extra = extra;
			var temp = {
				conversationType: 'PRIVATE',
				targetId: targetId.toString(),
				name: type,
				data: JSON.stringify(data)
			};
			RongCloudLibPlugin.sendCommandNotificationMessage(temp, function (ret, err) {
				if (err) {
					console.log(err);
				}
				if (ret.status == 'prepare'){
					//console.log(ret);
				}else if (ret.status == 'success'){

				}else if (ret.status == 'error'){
					console.log(ret);
				}
			});
		},
	};
	return service;

});