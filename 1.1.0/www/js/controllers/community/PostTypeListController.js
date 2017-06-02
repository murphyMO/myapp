/**
 * 发布类型列表控制器
 */
app.controller('PostTypeListCtrl',
	['$scope', '$state', '$ionicHistory',
	function ($scope, $state, $ionicHistory) {
		$scope.myGoBack = function() {
			$state.go('tab.community');
		};
	}
]);