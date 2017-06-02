app.controller('AboutCtrl',
	['$scope', '$state', '$rootScope', '$timeout', '$interval', 'CommonService', '$CommonFactory', '$localStorage','$ionicLoading','$ionicModal','$ionicHistory',
	function ($scope, $state, $rootScope, $timeout, $interval, CommonService, $CommonFactory, $localStorage, $ionicLoading,$ionicModal,$ionicHistory) {
		$scope.goBack = function(){
			$ionicHistory.goBack();
		}

		$scope.logout = function(){
			data = {

			}
			CommonService.logout(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$localStorage.removeAll();
					$state.go('login');
				} else {
					$CommonFactory.showAlert("退出失败~");
				}
			});
		}
}]);