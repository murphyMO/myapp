app.controller('service_agreementCtrl',
	['$scope', '$ionicHistory',
	function ($scope, $ionicHistory) {
		$scope.myBack = function(){
			$ionicHistory.goBack();
		}
}]);