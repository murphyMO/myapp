/**
 * 会议室预定控制器
 */
app.controller('BoardReservationCtrl',
	['$scope', '$rootScope', '$state', 'CustomerServiceService', '$localStorage', '$filter', '$ionicHistory', '$CommonFactory',
		function ($scope, $rootScope, $state, CustomerServiceService, $localStorage, $filter, $ionicHistory, $CommonFactory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.boardroom = {};
		$rootScope.muiltIsland = false;//单选岛

		//从localStorage取默认分岛
		if ($localStorage.getObject(KEY_CITY_SELECT)) {
			var temp = $localStorage.getObject(KEY_CITY_SELECT);
			$scope.boardroom.store_id = temp.city_id;
			$scope.boardroom.store_name = temp.city_name;
		}

		if ($localStorage.getObject("Info")) {
			var temp = $localStorage.getObject("Info");
			for (key in temp) {
				$scope.boardroom[key] = temp[key];
			}
			//之前在入驻咨询选过多岛 并且没有提交表单
			if (temp.store_id instanceof Array) {
				//从localStorage取默认分岛
				if ($localStorage.getObject(KEY_CITY_SELECT)) {
					var temp = $localStorage.getObject(KEY_CITY_SELECT);
					$scope.boardroom.store_id = temp.city_id;
					$scope.boardroom.store_name = temp.city_name;
				} else {
					$scope.boardroom.store_id = "";
					$scope.boardroom.store_name = "";
				}
			}
		}

		//屏蔽全国
		if ($scope.boardroom.store_id == "-1") {
			$scope.boardroom.store_id = "";
			$scope.boardroom.store_name = "";
		}

		//选择意向分岛
		$scope.willingisland = function (){
			$localStorage.setObject("Info", $scope.boardroom);
			$state.go("willingisland");
		}

		//保存会议室预定信息
		$scope.saveboardroomMsg = function() {
			
			//console.log($scope.boardroom.store_name);
			if (!$scope.boardroom.people_number) {
				$CommonFactory.showAlert("请输入预定人数！");
				return;
			}
			if($scope.boardroom.people_number){
				if (!(/^[1-9]\d*$/.test($scope.boardroom.people_number))) {
				$CommonFactory.showAlert("预定人数请输入整数！");
				return;
				}
			}
			if(!$scope.boardroom.appointment_time){
				$CommonFactory.showAlert("请选择预定日期！");
				return;
			}
			if (!$scope.boardroom.start_time) {
				$CommonFactory.showAlert('请选择开始时间！');
				return;
			}
			if (!$scope.boardroom.end_time) {
				$CommonFactory.showAlert('请选择结束时间！');
				return;
			}
			if(!$scope.boardroom.store_name){
				$CommonFactory.showAlert("请选择意向分岛！");
				return;
			}
			if ($scope.boardroom.appointment_time) {
				appointment_time = $scope.boardroom.appointment_time.replace(/-/g,"");
				var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
				if(appointment_time < nowDate){
					$CommonFactory.showAlert("预定日期不能早于今天！");
					return;
				}
			}
			if($scope.boardroom.start_time && $scope.boardroom.end_time){
				start_date = $scope.boardroom.start_time.replace(/:/g,"");
				end_time = $scope.boardroom.end_time.replace(/:/g,"");
				if((start_date > end_time)||(start_date == end_time)){
					$CommonFactory.showAlert("结束时间应晚于开始时间！");
					return;
				}
			}
			if(!$scope.boardroom.store_name){
				$scope.boardroom.store_id = " ";
			}
				var data = {
					'accesstoken' : $scope.accesstoken,
					'type' : 1,
					'people_number' : $scope.boardroom.people_number,
					'appointment_time' : $scope.boardroom.appointment_time,
					'start_time' : $scope.boardroom.start_time,
					'end_time' : $scope.boardroom.end_time,
					'store_id' : $scope.boardroom.store_id
				}
				CustomerServiceService.CustomerService(data,function(res){
					if (res.statuscode == 1) {
						$scope.boardroom.type = '1';
						$localStorage.setObject(KEY_XSM_ORDER, $scope.boardroom);
						console.log($scope.boardroom.start_time);
						$scope.boardroom={};
						$CommonFactory.showAlert("您的问题已经提交，请等待小师妹确认。灰常着急的话请联系15928844214", "提示", "确定")
						$localStorage.removeItem("Info");
						$state.go("chat");
					}
				})
		}

		//日期插件调用
		$scope.showDate = function () {
			$CommonFactory.showDatePicker(function(date){
				$scope.boardroom.appointment_time = date;
			});
		}
		
		//时间插件调用
		/*$scope.showTime = function () {
			if(!$scope.boardroom.start_time){
				$CommonFactory.showTimePicker(function(time){
					$scope.boardroom.start_time = time;
				});
			}else{
				$CommonFactory.showTimePicker(function(time){
					$scope.boardroom.end_time = time;
				});
			}
			
		}*/

		$scope.showBegin = function () {
			$CommonFactory.showTimePicker(function(time){
					$scope.boardroom.start_time = time;
				},60,"","00");
		}
		$scope.showEnd = function () {
			$CommonFactory.showTimePicker(function(time){
					$scope.boardroom.end_time = time;
				},60,"","00");
		}


		//返回
		$scope.back = function (){
			$ionicHistory.goBack();
		}

}]);