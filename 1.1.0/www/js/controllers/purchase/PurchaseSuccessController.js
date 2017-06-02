/*订购成功*/
/**
 * 预订会议室控制器
 */
app.controller('PurchaseSuccessCtrl',
	['$scope', '$rootScope', '$stateParams',
	function ($scope, $rootScope,$stateParams) {
		$scope.accesstoken = $rootScope.getAccessToken();
		console.log($stateParams)
		$scope.order = $stateParams.data.order;
		$scope.user = $rootScope.getCurrentUser();
		console.log($scope.order,$scope.user);
	}
]);
