/**
 * 意见与投诉控制器
 */
app.controller('SugComplainCtrl',
	['$scope', '$rootScope', '$state', 'CustomerServiceService', '$localStorage', '$CommonFactory', 'UserService', '$ionicHistory',
		function ($scope, $rootScope, $state, CustomerServiceService, $localStorage, $CommonFactory, UserService, $ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.sugComplain = {};
		$rootScope.muiltIsland = false;//单选岛

		//从localStorage取默认分岛
		if ($localStorage.getObject(KEY_CITY_SELECT)) {
			var temp = $localStorage.getObject(KEY_CITY_SELECT);
			$scope.sugComplain.store_id = temp.city_id;
			$scope.sugComplain.store_name = temp.city_name;
		}

		//获取当前用户信息，填入数据
		var user = $rootScope.getCurrentUser();
		if(user.user_account){
			$scope.sugComplain.phone_number = user.user_account;
			$scope.sugComplain.user_name = user.name;
		} else {
			var data = {
				'accesstoken': $scope.accesstoken,
			};
			UserService.userMine(data, function (response2) {
				if (response2.statuscode == CODE_SUCCESS) {
					user.user_account = response2.data.userInfo.user_account || response2.data.userInfo.phone;
					$rootScope.setCurrentUser(user);
					$scope.sugComplain.phone_number = user.user_account;
					$scope.sugComplain.user_name = user.name;
				}
			});
		}

		if ($localStorage.getObject("Info")) {
			var temp = $localStorage.getObject("Info");
			for (key in temp) {
				$scope.sugComplain[key] = temp[key];
			}
			//之前在入驻咨询选过多岛 并且没有提交表单
			if (temp.store_id instanceof Array) {
				//从localStorage取默认分岛
				if ($localStorage.getObject(KEY_CITY_SELECT)) {
					var temp = $localStorage.getObject(KEY_CITY_SELECT);
					$scope.sugComplain.store_id = temp.city_id;
					$scope.sugComplain.store_name = temp.city_name;
				} else {
					$scope.sugComplain.store_id = "";
					$scope.sugComplain.store_name = "";
				}
			}
		}

		//屏蔽全国
		if ($scope.sugComplain.store_id == "-1") {
			$scope.sugComplain.store_id = "";
			$scope.sugComplain.store_name = "";
		}

		//选择意向分岛
		$scope.willingisland = function (){
			//将选择的对象存储到本地中
			$localStorage.setObject("Info", $scope.sugComplain);
			//console.log($scope.sugComplain);
			$state.go("willingisland");
		}
		//保存意见与投诉信息
		$scope.savesugComplainMsg = function() {

			if (!$scope.sugComplain.content) {
				$CommonFactory.showAlert("请输入您的意见或投诉！");
				return;
			}
			if(!$scope.sugComplain.user_name){
				$CommonFactory.showAlert("请输入姓名！");
				return;
			}
			if (!$scope.sugComplain.phone_number) {
				$CommonFactory.showAlert('请输入联系电话！');
				return;
			}
			if ($scope.sugComplain.phone_number) {
				if (!(/^1[3|4|5|7|8]\d{9}$/.test($scope.sugComplain.phone_number))) {
				$CommonFactory.showAlert("手机号码有误！");
				return;
				}
			}
			if(!$scope.sugComplain.store_name){
				$scope.sugComplain.store_id = "";
			}
			var data = {
				'accesstoken' : $scope.accesstoken,
				'type' : 4,
				'content' : $scope.sugComplain.content,
				'user_name' : $scope.sugComplain.user_name,
				'phone_number' : $scope.sugComplain.phone_number,
				'store_id' : $scope.sugComplain.store_id
			}
			CustomerServiceService.CustomerService(data,function(res){
				if (res.statuscode == CODE_SUCCESS) {
					$scope.sugComplain.type = '4';
					$localStorage.setObject(KEY_XSM_ORDER, $scope.sugComplain);
					$scope.sugComplain={};
					$CommonFactory.showAlert("您的问题已经提交，请等待小师妹确认。灰常着急的话请联系15928844214", "提示", "确定")
					$localStorage.removeItem("Info");
					$state.go("chat");
					}
				})
		}

		//返回
		$scope.back = function (){
			$ionicHistory.goBack();
		}

}]);