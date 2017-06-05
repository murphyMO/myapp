app.controller('ChangePassCtrl',
	['$scope', '$ionicHistory','$cordovaToast','$cordovaInAppBrowser',
	function ($scope, $ionicHistory,$cordovaToast,$cordovaInAppBrowser) {

		$scope.user = $rootScope.getCurrentUser();

		//条款
		$scope.tiaokuan = function(){
			$state.go('tiaokuan');
		}

		$scope.change = function(){
			if (!$scope.passWord) {
				$CommonFactory.showAlert("请填写原密码！");
				return;
			}
			if (!$scope.passWord2) {
				$CommonFactory.showAlert("请填写新密码！");
				return;
			}
			if (!$scope.passWord3) {
				$CommonFactory.showAlert("请再次填写新密码！");
				return;
			}
			if ($scope.passWord3!=$scope.passWord2) {
				$CommonFactory.showAlert("两次密码输入不一致！");
				return;
			}
			var data = {
				'objectId': $scope.user.objectId,
				'password': $scope.passWord2
			}

		}

		$scope.myBack = function(){
			$ionicHistory.goBack();
		}
}]);