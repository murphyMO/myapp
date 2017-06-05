app.controller('DownloadCtrl',
	['$scope', '$ionicHistory','$cordovaToast','$cordovaInAppBrowser',
	function ($scope, $ionicHistory,$cordovaToast,$cordovaInAppBrowser) {

		$scope.clickBad = function(){
			$cordovaToast.show("暂未开放，尽请期待", "long", "center")
		}

		$scope.myBack = function(){
			$ionicHistory.goBack();
		}
}]);