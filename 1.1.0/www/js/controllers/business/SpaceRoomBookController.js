/**
 * 预订会议室控制器
 */
app.controller('SpaceRoomBookController',
	['$scope', '$rootScope', '$state','$stateParams', '$localStorage','$CommonFactory','BusinessService','$timeout','$ionicModal',
	function ($scope, $rootScope, $state,$stateParams, $localStorage,$CommonFactory,BusinessService,$timeout,$ionicModal) {
		$scope.accesstoken = $rootScope.getAccessToken();
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.item = $localStorage.getObject("space_item");
		$scope.user_type = $localStorage.getObject("currentUser").user_type;
		$scope.user = $rootScope.getCurrentUser();
		$scope.times = [];
		$scope.startTimes = [];
		$scope.endTimes = [];
		var timeout = null; //搜索延迟
		$scope.userCheckAry = [];
		$scope.userCheckTimes = 0;
		$scope.total = 0;
		$scope.spaceroom = {};
		$scope.spaceroom.people_number = $scope.item.attendee_amount
		$scope.selectOrderTypeResult = "";
		$scope.orderTypeAry = [
			{
				name : "个人预订",
				is_personal : 1,
				checked : false
			},
			{
				name : "企业预订",
				is_personal : 0,
				checked : false
			}
		];

		$scope.parent_type = 0;
		if ($state.params.from == "mineorderdetail") {
			$scope.parent_type = 1;
		}

		$scope.nowTime=new Date()
		var y=$scope.nowTime.getFullYear()
		var m=$scope.nowTime.getMonth()+1
		if (m < 10) {
			m = "0" + m;
		}
		var r=$scope.nowTime.getDate()
		if (r < 10) {
			r = "0" + r;
		}
		var h = $scope.nowTime.getHours();
		if (h < 10) {
			h = "0" + h;
		}
		var min = $scope.nowTime.getMinutes();
		if (min < 10) {
			min = "0" + min;
		}
		var sec = $scope.nowTime.getSeconds();
		$scope.date = y + "-" + m + "-" + r;
		$scope.timer = y + "-" + m + "-" + r +' '+ h + ":" + min;

		// $scope.getOneDayTime = function(){
		// 	$scope.times = [];
		// 	$scope.startTimes = [];
		// 	$scope.endTimes = [];
		// 	for(var i = -1,j = 0;i < 23;i++){
		// 		$scope.startTime = i + 1;
		// 		$scope.endTime = j + i + 2;

		// 		if ($scope.startTime < 10) {
		// 			$scope.startTime ='0' + $scope.startTime;
		// 		}
		// 		if ($scope.endTime < 10) {
		// 			$scope.endTime ='0' + $scope.endTime;
		// 		}
		// 		$scope.startTimes.push($scope.startTime)
		// 		$scope.endTimes.push($scope.endTime)
		// 		$scope.startTime = $scope.startTime + ":00";
		// 		$scope.endTime = $scope.endTime + ":00";

		// 		$scope.times.push({time:$scope.startTime + '-'+ $scope.endTime,disabled:false,checked:false});
		// 	}
		// }
		// $scope.getOneDayTime();

		$scope.getDisabledSpace = function(){
			var data = {
				accesstoken : $scope.accesstoken,
				date : $scope.date,
				id : $scope.item.meeting_room_id
			}
			BusinessService.getDisabledConference(data,function(response){
				if (response.statuscode == 1) {
					if (response.data.length != 0) {
						$scope.disabledTime = response.data.reserved_time;
						$scope.openTime = response.data.office_hours;//后台返回的营业时间
						$scope.openStartTime = $scope.openTime[0];//开门时间
						$scope.openEndTime = $scope.openTime[1];//关门时间
						$scope.times = [];//页面显示的时间段
						$scope.startTimes = [];
						$scope.endTimes = [];
						for(var i = 0,j = 1;i < $scope.openEndTime - $scope.openStartTime + 1;i++){
							$scope.startTime = i + $scope.openStartTime;
							$scope.endTime = j + i + $scope.openStartTime;

							if ($scope.startTime < 10) {
								$scope.startTime ='0' + $scope.startTime;
							}
							if ($scope.endTime < 10) {
								$scope.endTime ='0' + $scope.endTime;
							}
							$scope.startTimes.push($scope.startTime);
							$scope.endTimes.push($scope.endTime);
							$scope.startTime = $scope.startTime + ":00";
							$scope.endTime = $scope.endTime + ":00";

							$scope.times.push({time:$scope.startTime + '-'+ $scope.endTime,disabled:false,checked:false,timeOut:false});
						}
						for(var a = 0;a < $scope.startTimes.length;a++){
							for(var b = 0;b < $scope.disabledTime.length;b++){
								if ($scope.disabledTime[b] == $scope.startTimes[a]) {
									$scope.times[a].disabled = true;
								}
							}
						}
						$scope.checkNowTime();
					}
				}
			})
		}
		$scope.getDisabledSpace();

		$scope.checkNowTime = function(){
			for(var i = 0;i < $scope.startTimes.length;i++){
				if ($scope.timer >= $scope.date + " " + $scope.startTimes[i] + ":" +"30") {
					$scope.times[i].timeOut = true;
				}
			}
		}



		$scope.$watch("date",function(newVal,oldVal){
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				}
				$scope.getDisabledSpace();
				$scope.checkNowTime()
			}
		},true)

		$scope.$watch("times",function(newVal,oldVal){
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				}
				$scope.userCheckAry = []
				for(var i = 0;i < $scope.times.length;i++){
					if ($scope.times[i].checked == true) {
						$scope.userCheckAry.push(i + $scope.openStartTime);//客户选择时间段的数组
					}
				}
				$scope.userCheckTimes = $scope.userCheckAry.length;//客户选择时间段数组的长度，用于计算价格
				//预订小于四小时按四小时计算
				if ($scope.user.user_type <= '1') {
					//非会员计算总价
					if ($scope.parent_type == 1) {//判断是否是延时订单
						$scope.total = $scope.item.fourHoursAfterPrice *10000 * $scope.userCheckTimes/10000;
					}
					else{
						if ($scope.userCheckTimes <= 4) {
							$scope.total = $scope.item.fourHoursAgoPrice *10000 * 4/10000 + 300;
						}
						//预订大于四小时
						else if ($scope.userCheckTimes > 4) {
							$scope.total = $scope.item.fourHoursAgoPrice * 10000 * 4/10000 + $scope.item.fourHoursAfterPrice * 10000 * ($scope.userCheckTimes - 4)/10000 + 300;
						}
					}
				}
				else{
					// 会员计算总价
					if ($scope.parent_type == 1) {//判断是否是延时订单
						$scope.total = $scope.item.fourHoursAfterPriceMember *10000 * $scope.userCheckTimes/10000;
					}
					else{
						if ($scope.userCheckTimes <= 4) {
							$scope.total = $scope.item.fourHoursAgoPriceMember *10000 * 4/10000 + 300;
						}
						//预订大于四小时
						else if ($scope.userCheckTimes > 4) {
							$scope.total = $scope.item.fourHoursAgoPriceMember * 10000 * 4/10000 + $scope.item.fourHoursAfterPriceMember * 10000 * ($scope.userCheckTimes - 4)/10000 + 300;
						}
					}
				}

			}
		},true)

		$scope.check = function(i,index){
			if (i.disabled == true) {
				$CommonFactory.showAlert("该时间段已被预约，请选择其他时间");
				return;
			}
			if (i.timeOut == true) {
				$CommonFactory.showAlert("该时间段已过期，请选择其他时间");
				return;
			}
			if (i.checked == true) {
				for(var a = index;a < $scope.times.length;a++){
					$scope.times[a].checked = false;
				}
				// i.checked = false;
				return;
			}
			//判断时间段是否连续
			if ($scope.userCheckAry && $scope.userCheckAry.length > 0) {
				var index_p = index + 1 + $scope.openStartTime;
				var index_m = index - 1 + $scope.openStartTime;
				if ($scope.userCheckAry.indexOf(index_p) != -1 || $scope.userCheckAry.indexOf(index_m) != -1){
					i.checked = true;
				}
				else {
					$CommonFactory.showAlert("只能选择连续的时间段")
					i.checked = false;
					return;
				}
			}
			i.checked = true;
		}

		$scope.create = function(){
			if(!$scope.spaceroom.people_number){
				$CommonFactory.showAlert("请填写预订人数");
				return;
			}
			else if ($scope.userCheckAry.length == 0) {
				$CommonFactory.showAlert("请选择预订时间段");
				return;
			}
			else if ($scope.selectOrderTypeResult == '') {
				$CommonFactory.showAlert("请选类型")
				return;
			}
			var data = {
				accesstoken : $scope.accesstoken,
				meeting_room_id : $scope.item.meeting_room_id,
				reserve_time : $scope.userCheckAry,
				reserve_date : $scope.date,
				comments : $scope.spaceroom.comments,
				attendee_amount : $scope.spaceroom.people_number,
				parent_type : $scope.parent_type,
				parent_order_id : $state.params.parent_order_id,
				is_personal : $scope.is_personal
			}
			BusinessService.create(data,function(response){
				if (response.statuscode == 1) {
					$state.go("confirmOrder",{data:{targetId:response.data.order_id}})
				}
				else{
					$CommonFactory.showAlert(response.message);
				}
			})
		}

		//日期插件调用
		$scope.showDate = function(){
				$CommonFactory.showDatePicker(function(date){
					if (date < y + "-" + m + "-" + r) {
						$CommonFactory.showAlert("预订日期不能小于今天");
						return
					}
					$scope.date = date;
				});
			}

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};

		// 触发一个按钮点击，或一些其他目标
		$ionicModal.fromTemplateUrl('templates/modal/select_order_type.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		$scope.selectOrderType = function() {
			$scope.modal.show();
		};
		$scope.closeModal = function() {
			$scope.modal.hide();
		};

		$scope.selectItem = function(item){
			$scope.closeModal();
			if (item.checked == false) {
				for(var i = 0;i < $scope.orderTypeAry.length;i++){
					$scope.orderTypeAry[i].checked = false;
				}
				item.checked = true;
				$scope.selectOrderTypeResult = item.name;
				$scope.is_personal = item.is_personal;
			}
		}

		//跳转返回
		$scope.topBack = function(){
			window.history.back();
		}
	}
]);
