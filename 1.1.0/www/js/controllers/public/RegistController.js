/**
 * 注册控制器
 */
app.controller('RegistCtrl',
	['$scope', '$rootScope', '$state', '$timeout','$interval', 'CommonService', '$CommonFactory', '$localStorage', 'UserService','$ionicLoading',
	function($scope, $rootScope, $state, $timeout, $interval, CommonService, $CommonFactory, $localStorage, UserService, $ionicLoading) {
	$scope.user = {};
	$scope.isPhoneValid = true;
	$scope.isTimeout = false;//发送短信的计时器，默认未过时
	$scope.waitTime = 60;
	$scope.smsConfirmed = false;
	var timer1;
	var timer2;

	//条款
	$scope.tiaokuan = function(){
		$state.go('tiaokuan');
	}

	// 注册
	$scope.regist = function() {
		if (!$scope.user.userName) {
			$CommonFactory.showAlert("请填写用户名！");
			return;
		}
		if (!$scope.user.passWord) {
			$CommonFactory.showAlert("请填写密码！");
			return;
		}
		var data = {
			username : $scope.user.userName,
			password : $scope.user.passWord
		};
		$CommonFactory.showLoading();
		CommonService.register(data, function(response){
			$CommonFactory.hideLoading();
			if (response.statuscode == CODE_SUCCESS) {
				$ionicLoading.show({
					animation: 'fade-in',
					template: '<span class="positive">注册成功<i class="ion-checkmark"></i> </span>'
				});
				$timeout(function() {
					$ionicLoading.hide(); // 0.1秒后关闭弹窗
					$state.go('tab.business')					 
				}, 200);			
			} else {
				$CommonFactory.showAlert(response.message);
			}
		});
	};
}]);
