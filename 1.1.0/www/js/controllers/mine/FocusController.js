app.controller('FocusCtrl',
	['$scope', '$state', '$rootScope', '$stateParams','$timeout', '$interval', '$CommonFactory', '$localStorage','$ionicLoading','$ionicModal','MineService',
	function ($scope, $state, $rootScope,$stateParams, $timeout, $interval, $CommonFactory, $localStorage, $ionicLoading,$ionicModal,MineService) {
		$scope.user = $rootScope.getCurrentUser();
		$scope.user_id = $scope.user.objectId;
		$scope.getFocus = function(){
			$scope.focus = [];
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			MineService.focus(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.focusData = [];
					$scope.focus = response.data;
					for(i in $scope.focus){
						$scope.focusData.push($scope.focus[i].target_id);
					}
					$scope.focusLen = response.data.length;
				}else{
					$scope.focusLen = 0;
				}
			});
		}
	$scope.getFocus();

	$scope.goBack = function(){
			window.history.back();
		}

}]);