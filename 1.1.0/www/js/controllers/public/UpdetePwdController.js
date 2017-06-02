/**
 * 找回密码控制器
 */
app.controller('UpdetePwdCtrl', 
	['$scope', '$rootScope', '$state', '$timeout','$interval', 'CommonService', '$CommonFactory', '$localStorage',
	function($scope, $rootScope, $state, $timeout, $interval, CommonService, $CommonFactory, $localStorage) {
	$scope.user = {};
	$scope.accesstoken = $rootScope.getAccessToken();


	// 密码重置
	$scope.updetePwd = function() {
		if (!$scope.user.oldPwd) {
			$CommonFactory.showAlert("请输入当前密码");
			return;
		}
		var pwdReg = /^(?![^A-Za-z]+$)(?![^0-9]+$)[\x21-x7e]{6,12}$/;
		if (!pwdReg.test($scope.user.pwd)) {
			$CommonFactory.showAlert('密码为6-12位字母、数字或符号组合，必须同时包含字母和数字');
			return;
		}
		if ($scope.user.pwd != $scope.user.confirmPwd) {
			$CommonFactory.showAlert("两次密码不一致");
			return;
		}
		var data = {
			accesstoken : $scope.accesstoken,
			old_pw : $scope.user.oldPwd,
			new_pw : $scope.user.pwd
		};
		$CommonFactory.showLoading();
		CommonService.updetePwd(data, function(response){
			$CommonFactory.hideLoading();
			if (response.statuscode == CODE_SUCCESS) {
				if (response.data == -3) {
					$CommonFactory.showAlert("当前密码不正确");
					return;
				}
				$scope.user = {};
				$localStorage.removeAll();
				$rootScope.rongYunLogout();
				$state.go('login');
			} else {
				$CommonFactory.showAlert(response.message);
			}
		});
	};

}]);