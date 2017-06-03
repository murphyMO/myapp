/**
 * 联系列表控制器
 */
app.controller('ContactListCtrl',
	['$scope', '$window', '$rootScope','$state','ContactService','$localStorage','$cordovaLocalNotification','$ionicModal','$timeout','$ionicHistory','$ionicListDelegate','$ionicSlideBoxDelegate',
		function ($scope, $window, $rootScope,$state,ContactService,$localStorage,$cordovaLocalNotification,$ionicModal,$timeout,$ionicHistory,$ionicListDelegate,$ionicSlideBoxDelegate) {
		$scope.nowPage = 0;


		$scope.boxChanged = function(i){
					$scope.nowPage = i;
					// $localStorage.set("communityPage",i);
				}

		$scope.clickAll = function(){
			$ionicSlideBoxDelegate.slide(0)
		}

		$scope.clickTopic = function(){
			$ionicSlideBoxDelegate.slide(1)
		}
















		var accesstoken = $rootScope.getAccessToken();
		var pathTemp = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.route_path = pathTemp.route_path;
		$scope.path = pathTemp.photo_path ;
		$scope.article_photo_path = pathTemp.article_photo_path ;

		$rootScope.msgCount = 0;
		$scope.hasMenu = false;
		$scope.obj = {};

		var user = $rootScope.getCurrentUser();//当前用户id
		if (user && user.id) {
			//console.log(user);
			$scope.userId = user.id;
		} else {
			//console.log($rootScope.getCurrentUser());
			// $state.go("login");
		}

		//处理名字等超长
		$scope.nameString = function (item) {
			item = item + "";
			if (item.length > 30) {
				return item.substring(0,29) + "...";
			}
			return item
		}

		//跳转到聊天
		$scope.toChat = function(li){
			$state.go('chat',{data: li});
		}


		$scope.contactcommentlist = function(){
			if($rootScope.isGuest){
				$state.go('login');
			}else{
				$state.go('contactcommentlist');
			}
		}

		$scope.contactlikelist = function(){
			if($rootScope.isGuest){
				$state.go('login');
			}else{
				$state.go('contactlikelist');
			}
		}

		//联系会话列表
		var getContactList = function(){
			$scope.contacts = {};
			var data = {
				accesstoken : accesstoken
			};
			ContactService.contactList(data, function(response){
				//console.log(response);
				if (response.statuscode != CODE_SUCCESS) {
					return;
				}
				$localStorage.setObject(KEY_CONTACT_LIST, $scope.lists);
				$scope.contacts.lists = response.data;
			});
		}
		getContactList();

		//点赞列表
		var getLikeDatas = function () {
			var data = {
				accesstoken : accesstoken,
				id : $rootScope.getCurrentUser().id
			};
			ContactService.likeDatas(data, function(response){
				if (response.statuscode != CODE_SUCCESS) {
					return;
				}
				$scope.obj.likes = response.data.length;
				$scope.obj.likeLength = response.unread_cnt;
			});
		}
		getLikeDatas();



		//留言列表
		var getMessageDatas = function(){
			var data = {
				accesstoken : accesstoken,
				id : $rootScope.getCurrentUser().id
			};
			ContactService.messageDatas(data, function(response){
				if (response.statuscode != CODE_SUCCESS) {
					return;
				}
				$scope.obj.messageDatas = response.data.length;
				$scope.obj.messageLength = response.unread_cnt;
			});
		}
		getMessageDatas();

		//标记一条会话为已读
		$scope.readItem = function(event,index){
			event.stopPropagation();
			var from_user_id = $scope.contacts.lists[index].chat_user_id;
			$ionicListDelegate.closeOptionButtons();
			var data = {
				accesstoken: accesstoken,
				from_user_id: from_user_id
			};
			ContactService.readMsg(data,function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.contacts.lists[index].unread_cnt = 0;
					var temp = $localStorage.getObject(KEY_UNREAD_MSG);
					var len = temp.length;
					if (len) {
						for (var i = 0 ; i < len ; i ++) {
							if (temp[i].senderUserId == from_user_id){
								temp.splice(i,1);
							}
						}
					}
					$localStorage.setObject(KEY_UNREAD_MSG,temp);
				}
			});
		}

		//删除一条会话
		$scope.deletItem = function(event,index){
			event.stopPropagation();
			var data = {
				accesstoken : accesstoken,
				chat_user_id : $scope.contacts.lists[index].chat_user_id
			};
			ContactService.deletSession(data,function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.contacts.lists.splice(index,1);
				}
			});
		}

		//遍历数组获取其status为num的
		var readArry = function (array,num) {
			var len = array.length;
			for (var i = 0; i < len ; i++){
				if (array[i].chat_user_id == num) {
					return i;
				}
			}
			return '-1';
		}

		//时间格式化
		var timeUpdate = function(time) {
			var date = new Date(time);
			var month,day,hours,min,second;
			month =(date.getMonth() - 0 + 1);
			if (date.getMonth() < 9) {
				month = "0" + (date.getMonth() - 0 + 1);
			}
			day = date.getDate();
			if (date.getDate() < 10) {
				day = "0" + date.getDate();
			}
			hours = date.getHours();
			if (date.getHours() < 10) {
				hours = "0" + date.getHours();
			}
			min = date.getMinutes();
			if (date.getMinutes() < 10) {
				min = "0" + date.getMinutes();
			}
			second = date.getSeconds();
			if (date.getSeconds() < 10) {
				second = "0" + date.getSeconds();
			}
			return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + min + ":" + second;
		}

		//将第某位置数据条换到第一位，并更改对应时间
		var changLists = function(array,index) {
			array[index].unread_cnt ++;
			var temp = array.splice(index,1);
			temp = temp[0];
			temp.last_update_time = timeUpdate(temp.last_update_time);
			if (array[0].chat_user_id == '0000') {
				//系统消息
				array.splice(1,0,temp);
			} else {
				array.splice(0,0,temp);
			}
			return array;
		}

		//刷新聊天未读数据
		var refreshUnread = function (event,data) {
			$timeout(
				function(){
					getContactList();
				}
				,100);
		}

		//刷新点赞数
		var refreshDianzan = function (event,data) {
			if ($state.current.name == 'tab.contact') {
				getLikeDatas();
			}
		}

		//刷新留言数
		var refreshLiuyan = function (event,data) {
			if ($state.current.name == 'tab.contact') {
				getMessageDatas();
			}
		}

		//监听广播
		$rootScope.$on("newMsg",refreshUnread);
		$rootScope.$on("newDianZan",refreshDianzan);
		$rootScope.$on("newLiuyan",refreshLiuyan);

		//离开时
		$scope.$on('$ionicView.beforeLeave', function(){
			refreshUnread = function () {
				return false;
			}
		});

		

		$scope.goBack = function(){
			$ionicHistory.goBack();
		}
}]);
