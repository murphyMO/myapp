/**
 * 加班登记控制器
 */
app.controller('OvertimeRegistCtrl',
	['$scope', '$rootScope', '$state', 'CustomerServiceService', '$localStorage', '$filter', '$CommonFactory', '$ionicHistory',
		function ($scope, $rootScope, $state, CustomerServiceService, $localStorage, $filter, $CommonFactory, $ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.overtime = {};

		//从localStorage取默认分岛
		if ($localStorage.getObject(KEY_CITY_SELECT)) {
			var temp = $localStorage.getObject(KEY_CITY_SELECT);
			$scope.overtime.store_id = temp.city_id;
			$scope.overtime.store_name = temp.city_name;
		}

		if ($localStorage.getObject("Info")) {
			var temp = $localStorage.getObject("Info");
			for (key in temp) {
				$scope.overtime[key] = temp[key];
			}
			//之前在入驻咨询选过多岛 并且没有提交表单
			if (temp.store_id instanceof Array) {
				//从localStorage取默认分岛
				if ($localStorage.getObject(KEY_CITY_SELECT)) {
					var temp = $localStorage.getObject(KEY_CITY_SELECT);
					$scope.overtime.store_id = temp.city_id;
					$scope.overtime.store_name = temp.city_name;
				} else {
					$scope.overtime.store_id = "";
					$scope.overtime.store_name = "";
				}
			}
		}

		//屏蔽全国
		if ($scope.overtime.store_id == "-1") {
			$scope.overtime.store_id = "";
			$scope.overtime.store_name = "";
		}

		//选择意向分岛
		$scope.willingisland = function (){
			$localStorage.setObject("Info", $scope.overtime);
			//console.log($scope.overtime);
			$rootScope.muiltIsland = false;//单选岛
			$state.go("willingisland");
		}

		//保存加班登记信息
		$scope.saveovertimeMsg = function() {

			if (!$scope.overtime.people_number) {
				$CommonFactory.showAlert("请输入人数！");
				return;
			}
			if($scope.overtime.people_number){
				if (!(/^[1-9]\d*$/.test($scope.overtime.people_number))) {
				$CommonFactory.showAlert("加班人数请输入整数！");
				return;
				}
			}
			if(!$scope.overtime.overtime_time){
				$CommonFactory.showAlert("请选择加班日期！");
				return;
			}
			if (!$scope.overtime.start_time) {
				$CommonFactory.showAlert('请选择开始时间！');
				return;
			}
			if (!$scope.overtime.end_time) {
				$CommonFactory.showAlert('请选择结束时间！');
				return;
			}
			if ($scope.overtime.overtime_time) {
				overtime_time = $scope.overtime.overtime_time.replace(/-/g,"");
				var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
				if(overtime_time < nowDate){
					$CommonFactory.showAlert("加班日期不能早于今天!");
					return;
				}
			}
			if($scope.overtime.start_time && $scope.overtime.end_time){
				start_date = $scope.overtime.start_time.replace(/:/g,"");
				end_time = $scope.overtime.end_time.replace(/:/g,"");
				if((start_date > end_time)||(start_date == end_time)){
					$CommonFactory.showAlert("结束时间应晚于开始时间");
					return;
				}
			}
			if(!$scope.overtime.store_name){
				$CommonFactory.showAlert("请选择意向分岛！");
				return;
			}
			var data = {
				'accesstoken' : $scope.accesstoken,
				'type' : 3,
				'people_number' : $scope.overtime.people_number,
				'overtime_time' : $scope.overtime.overtime_time,
				'start_time' : $scope.overtime.start_time,
				'end_time' : $scope.overtime.end_time,
				'store_id' : $scope.overtime.store_id,
				'overtime_staff' : $scope.overtime.overtime_staff
			};
			CustomerServiceService.CustomerService(data,function(res){
				if (res.statuscode == 1) {
					$scope.overtime.type = '3';
					$localStorage.setObject(KEY_XSM_ORDER, $scope.overtime);
					$scope.overtime={};
					//console.log("asdjhashdj");
					$CommonFactory.showAlert("您的问题已经提交，请等待小师妹确认。灰常着急的话请联系15928844214", "提示", "确定")
					$localStorage.removeItem("Info");
					$state.go("chat");
					}
				});
			}

		//日期插件调用
		$scope.showDate = function(){
			$CommonFactory.showDatePicker(function(date){
				$scope.overtime.overtime_time = date;
			});
		}

		//时间插件调用
		/*$scope.showTime = function () {
			if(!$scope.overtime.start_time){
				$CommonFactory.showTimePicker(function(time){
					$scope.overtime.start_time = time;
				});
			}else{
				$CommonFactory.showTimePicker(function(time){
					$scope.overtime.end_time = time;
				});
			}
			
		}*/

		$scope.showBegin = function () {
			$CommonFactory.showTimePicker(function(time){
					$scope.overtime.start_time = time;
				},60,"","00");
		}
		$scope.showEnd = function () {
			$CommonFactory.showTimePicker(function(time){
					$scope.overtime.end_time = time;
				},60,"","00");
		}

		//返回
		$scope.back = function (){
			$ionicHistory.goBack();
		}

}]);