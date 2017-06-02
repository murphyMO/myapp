app.controller('ToScoreCtrl',
	['$scope', '$ionicHistory','$cordovaToast','$cordovaInAppBrowser',
	function ($scope, $ionicHistory,$cordovaToast,$cordovaInAppBrowser) {

		$scope.clickBad = function(){
			$cordovaToast.show("暂未开放，尽请期待", "long", "center")
		}

		$scope.toStore = function(){
			var options = {
				location: 'no',
				clearcache: 'yes',
				toolbar: 'yes'
			};
			$cordovaInAppBrowser.open("https://itunes.apple.com/cn/app/xia-ke-dao-li/id1131508365?mt=8", '_system', options)
		}


		$scope.myBack = function(){
			$ionicHistory.goBack();
		}
}]);