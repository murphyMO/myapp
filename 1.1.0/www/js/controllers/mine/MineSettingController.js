app.controller('MineSettingCtrl',
	['$scope', '$localStorage', '$CommonFactory', '$state','$rootScope','$ionicHistory', '$timeout',
	function ($scope, $localStorage, $CommonFactory, $state,$rootScope,$ionicHistory, $timeout) {

	// 退出-清空存储
	$scope.logout = function () {
		$CommonFactory.showConfirm(function(){
			$localStorage.removeAll();
			$rootScope.rongYunLogout();
			// destory all view caches
			$timeout(function() {
				$ionicHistory.clearHistory();
				$ionicHistory.clearCache();
			});
			$state.go('login');
			// $state.go('login');
		},"您确定要退出登录吗?");
	};
}]);