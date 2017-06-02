/**
 * 预约入场控制器
 */
app.controller('OrderVisitCtrl',
	['$scope', '$rootScope', '$state', 'CustomerServiceService', '$localStorage', '$CommonFactory', 'UserService', '$ionicHistory',
		function ($scope, $rootScope, $state, CustomerServiceService, $localStorage, $CommonFactory, UserService, $ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.order = {};
		$rootScope.muiltIsland = false;//多选岛

		//从localStorage取默认分岛
		if ($localStorage.getObject(KEY_CITY_SELECT)) {
			var temp = $localStorage.getObject(KEY_CITY_SELECT);
			$scope.order.store_id = temp.city_id;
			$scope.order.store_name = temp.city_name;
		}

		//获取当前用户信息，填入数据
		var user = $rootScope.getCurrentUser();
		if(user.user_account){
			$scope.order.phone_number = user.user_account;
			$scope.order.user_name = user.name;
		} else {
			var data = {
				'accesstoken': $scope.accesstoken,
			};
			UserService.userMine(data, function (response2) {
				if (response2.statuscode == CODE_SUCCESS) {
					user.user_account = response2.data.userInfo.user_account || response2.data.userInfo.phone;
					$rootScope.setCurrentUser(user);
					$scope.order.phone_number = user.user_account;
					$scope.order.user_name = user.name;
				}
			});
		}

		if($rootScope.isGuest){
			$scope.order.phone_number = '';
			$scope.order.user_name = '';
				}

		if ($localStorage.getObject("Info")) {
			var temp = $localStorage.getObject("Info");
			for (key in temp) {
				$scope.order[key] = temp[key];
			}
		}

		//屏蔽全国
		if ($scope.order.store_id == "-1") {
			$scope.order.store_id = "";
			$scope.order.store_name = "";
		}

		//选择意向分岛
		$scope.willingisland = function (){
			$localStorage.setObject("Info", $scope.order);
			$state.go("willingisland");
		}

		//保存入驻咨询信息
		$scope.saveorderMsg = function() {
			if(!$scope.order.appointment_time){
				$CommonFactory.showAlert("请选择预定日期！");
				return;
			}
			if (!$scope.order.user_name) {
				$CommonFactory.showAlert("请输入您的姓名！");
				return;
			}
			if(!$scope.order.phone_number) {
				$CommonFactory.showAlert("请输入您的联系电话！");
				return;
			}
			if ($scope.order.phone_number) {
				if (!(/^1[3|4|5|7|8]\d{9}$/.test($scope.order.phone_number))) {
				$CommonFactory.showAlert("手机号码有误！");
				return;
				}
			}
			if (!$scope.order.store_name) {
				$CommonFactory.showAlert("请选择意向分岛！");
				return;
			}
			var data = {
				'accesstoken' : $scope.accesstoken,
				'type' : 5,
				'name' : $scope.order.user_name,
				'phone' : $scope.order.phone_number,
				'store_id' : $scope.order.store_id,
				'date' : $scope.order.appointment_time
			}
			CustomerServiceService.CustomerService(data,function(res){
				if (res.statuscode == CODE_SUCCESS) {
					$scope.order.type = '5';
					$localStorage.setObject(KEY_XSM_ORDER, $scope.order);
					$scope.order={};
					//console.log("asdjhashdj");
					$CommonFactory.showAlert("您的问题已经提交，请等待小师妹确认。灰常着急的话请联系15928844214", "提示", "确定")
					$localStorage.removeItem("Info");
					$state.go("chat");
				}
			})
		}

		//日期插件调用
		$scope.showDate = function () {
			$CommonFactory.showDatePicker(function(date){
				$scope.order.appointment_time = date;
			});
		}

		//返回
		$scope.back = function (){
			$ionicHistory.goBack();
		}

}]);
