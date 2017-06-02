/**
 * 公用方法
 */
angular.module('$CommonFactory',[])
.factory('$CommonFactory', 
	['$window', '$ionicLoading', '$ionicPopup', 'ionicDatePicker', 'ionicTimePicker','$rootScope','$cordovaToast',
	function($window, $ionicLoading, $ionicPopup, ionicDatePicker, ionicTimePicker,$rootScope,$cordovaToast) {
		return {
		//显示加载动画
		showLoading: function() {
			$ionicLoading.show({
				//content: 'Loading',
				animation: 'fade-in',
				showBackdrop: true,
//				maxWidth: 200,
//				showDelay: 0,
				// template: ' <ion-spinner icon="lines" class="spinner-calm"></ion-spinner>',
				template: '<img src="img/updateanima.gif" width="30">'
			});
		},
		//隐藏加载动画
		hideLoading: function() {
			$ionicLoading.hide();
		},
		//带文字的提示动画
		showLoadingWithAlert: function(text){
			$rootScope.showLoadingWithAlert = true;
			$ionicLoading.show({
				animation: 'fade-in',
				showBackdrop: true,
				template: '<span>' + text +'</span><br><ion-spinner icon="lines" class="spinner-calm"></ion-spinner>'
			});
			// $cordovaToast.show("小师妹上线中...", "short", "bottom")
			// 	.then(function(success) {
			// 		if (typeof callback === 'function') {
			// 			callback();
			// 		}
			// 	}, function (error) {
			// 	// error
			// });
		},
		 /**
		  * 显示alert提示对话框
		  * message: 提示消息
		  * title：提示标题，默认为提示
		  * text: 提示按钮文字， 默认为确认
		  */
		showAlert: function(message, title, text) {
			title = title ? title : '提示';
			text = text ? text : '确定';
			$ionicPopup.alert({
				title: title,
				template: message + "<br/><a href='tel:4009009088'>若遇疑问，请拨打400-900-9088</a>",
				cssClass: 'custom-popup',
				buttons: [{
					text: text,
					type: 'button-calm'
				}]
			});
		},
		/**
		*基础显示确认对话框
		*callback: 点击确定的回调函数
		*message: 提示消息
		*title: 提示标题，默认为提示
		*okText: 提示按钮文字， 默认为确认
		*/
		showBaseConfirm: function (callback,message,title,okText) {
			title = title ? title : '提示';
			okText = okText ? okText : '确定';

			$ionicPopup.alert({
				title: title,
				template: message + "<br/><a href='tel:4009009088'>若遇疑问，请拨打400-900-9088</a>",
				cssClass: 'custom-popup',
				buttons: [{
					text: okText,
					type: 'button-calm'
				}]
			}).then(function(){
				//点击确认事件
				if (typeof callback == 'function') {
					//调用回调函数
					callback();
				}
			
			})
		},
		 /**
		  * callback : 点击确定的回调函数
		  * 显示alert提示对话框
		  * message: 提示消息
		  * title：提示标题，默认为提示
		  * okText: 提示按钮文字， 默认为确认
		  * cancelText：默认为取消
		  */
		showConfirm: function(callback, message, title, okText, cancelText) {
			title = title ? title : '提示';
			okText = okText ? okText : '确定';
			cancelText = cancelText ? cancelText : '取消';
			
			var confirmPopup = $ionicPopup.confirm({
				title: title,
				template: message,
				cssClass: 'custom-popup',
				cancelText: cancelText, // String (默认: 'Cancel')。一个取消按钮的文字。
				cancelType: 'button-default', // String (默认: 'button-default')。取消按钮的类型。
				okText: okText, // String (默认: 'OK')。OK按钮的文字。
				okType: 'button-calm', // String (默认: 'button-positive')。OK按钮的类型
//				buttons: [{
//					text: cancelText,
//					type: 'button-default',
//					onTap: function(e) {
//						console.log(11);
//					// 当点击时，e.preventDefault() 会阻止弹窗关闭。
//					//e.preventDefault();
//					}
//				}, {
//					text: okText,
//					type: 'button-positive',
//					onTap: function(e) {
//						console.log(22);
//					// 返回的值会导致处理给定的值。
//					//return scope.data.response;
//					}
//				}]
			});
			//点击按钮处理事件
			confirmPopup.then(function(res) {
				if(res) {
					//确定事件
					// console.log('You are sure');
					if (typeof callback === 'function') {
						callback();
					}
				} else {
					//取消事件
					// console.log('You are not sure');
				}
			});
		},
		//弹出自定义对话框
		showCustomPopup: function(callback, $scopeTem, template, title, okText, cancelText) {
			title = title ? title : '提示';
			okText = okText ? okText : '确定';
			cancelText = cancelText ? cancelText : '取消';
			console.log($scopeTem);
			var CustomPopup = $ionicPopup.confirm({
				title: title,
				template: template,
				cssClass: 'custom-popup',
				scope: $scopeTem,
				cancelText: cancelText,
				cancelType: 'button-default',
				okText: okText,
				okType: 'button-calm',
			});
			//点击按钮处理事件
			CustomPopup.then(function(res) {
				if(res) {
					//确定事件
					// console.log('You are sure');
					if (typeof callback === 'function') {
						callback();
					}
				} else {
					//取消事件
					// console.log('You are not sure');
				}
			});
		},
		//日期组件
		showDatePicker: function(callbackDate){
			//日期初始化配置
			var datePickerObj = {
				inputDate: new Date(),
				setLabel: '确定',
				todayLabel: '今天',
				closeLabel: '关闭',
				mondayFirst: false,
				weeksList: ["日", "一", "二", "三", "四", "五", "六"],
				monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
				templateType: 'popup',
				from: new Date(1916, 8, 1),
				to: new Date(2020, 8, 1),
				showTodayButton: true,
				dateFormat: 'yyyy-MM-dd',
				closeOnSelect: false,
				disableWeekdays: [],
				callback: function (val) {
					var now = new Date(val);
					var selectedDate = now.getFullYear() + "-" + ((now.getMonth()+1)<10?("0"+(now.getMonth()+1)):(now.getMonth()+1)) + "-" + (now.getDate()<10? ("0"+now.getDate()):now.getDate());
					callbackDate(selectedDate);
				}
			};
			ionicDatePicker.openDatePicker(datePickerObj);
		},
		/**
		 * 时间组件
		 * step: 按照几分钟递增，默认1分钟
		 */
		showTimePicker: function(callbackTime, step, startHours, startMinutes){
			//默认1分钟
			step = step ? step : 1;
			startHours = startHours ? startHours : (new Date()).getHours() - 0 + 1;
			startMinutes = startMinutes ? startMinutes : (new Date()).getMinutes();
			var inputTime = startHours * 60 * 60 + startMinutes * 60;
			var timePickerObj = {
				inputTime: inputTime,
				format: 24, //24小时制
				step: step, //按照分钟选择
				setLabel: '确定',
				closeLabel: '关闭',
				callback: function(val) {
					var selectedTime = new Date(val * 1000);
					var time = (selectedTime.getUTCHours()<10 ? ("0"+selectedTime.getUTCHours()):selectedTime.getUTCHours()) + ":" + (selectedTime.getUTCMinutes()<10?("0"+selectedTime.getUTCMinutes()):selectedTime.getUTCMinutes());
					callbackTime(time);
				}
			};
			ionicTimePicker.openTimePicker(timePickerObj);
		},
		/**
		 * 显示原生的toast
		 * message 要显示的消息
		 * duration 显示时长 long  short(2s左右)
		 * position 显示位置 'top', 'center', 'bottom'
		 * callback 显示成功的回调函数
		 */
		showToast: function (message, duration, position,callback){
			$cordovaToast.show(message, duration, position)
				.then(function(success) {
					if (typeof callback === 'function') {
						callback();
					}
				}, function (error) {
				// error
			});
		},
		showNotification : function (time){
			var alarmTime = time ?  time : new Date();
			$cordovaLocalNotification.schedule({
				id: alarmTime,
				at: alarmTime,
				title: "test for pause",
				text: "paused"
			}).then(function(){
				//console.log("Local Notification has been set!");
			});
		},
		/**
		 * 模仿微信发布信息时间显示格式
		 *
		 * */
				
		
		showWeiboTime : function (nowtime,atime){
			var nowTime=nowtime.split(' ');//["2016-10-11","13:08:33"]
			var A1=nowTime[0].split('-');//["2016", "10", "11"]
			var B1=nowTime[1].split(':');//["13", "08", "33"]
			var unit = ["小时","分钟","秒钟"];
	 	//var atime="2016-10-11 00:00:00";//response.data[i].article_cre_time;
			var applyTime=atime.split(' ');//获得的时间，格式同nowTime
			var A=applyTime[0].split('-');//获得的年月日，格式同A1
			var B=applyTime[1].split(':');//获得的时分秒，格式同B1
	
			var sb=[];
			var byTime = [60*60*1000,60*1000,1000];  
			if(String(A)==String(A1)){
			    var ct =(B1[0]-B[0])*60*60*1000+(B1[1]-B[1])*60*1000+(B1[2]-B[2])*1000;
			    for(var i=0;i<byTime.length;i++){  
					if(ct<byTime[i]){  
						continue;  
					}  
					var temp = Math.floor(ct/byTime[i]);  
					ct = ct%byTime[i];  
					if(temp>0){  
						sb.push(temp+unit[i]);  
					}
					if(sb.length>=1){
						break;  
					}
				}
				var time=sb.join("")+"前";  
			} else {
				for (var i=0;i<=3;i++) {
					if(A[i]<A1[i]) {
						if(A[0]==A1[0]){//年相同
							if(A[1]==A1[1]){//年月相同
								if(parseInt(A[2])==A1[2]-1){
									time='昨天'+' '+B[0]+':'+B[1];
								}else{
									time=A[1]+'-'+A[2];
								}
							}else{//年相同 月不同
								time=A[1]+'-'+A[2];}
						}else{//年不同
							time=applyTime[0];
						}
					}
				}
			}
			return time;
		}
	
		
	}
}]);