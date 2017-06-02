app.controller('FansCtrl',
	['$scope', '$state', '$rootScope', '$stateParams','$timeout', '$interval', '$CommonFactory', '$localStorage','$ionicLoading','$ionicModal','MineService',
	function ($scope, $state, $rootScope,$stateParams, $timeout, $interval, $CommonFactory, $localStorage, $ionicLoading,$ionicModal,MineService) {
		
		$scope.user = $rootScope.getCurrentUser();
		$scope.user_id = $scope.user.objectId;
		// 获取粉丝
		$scope.getFollow = function(){
			$scope.follow = [];
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			MineService.follow(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.followData = [];
					$scope.follow = response.data;
					for(i in $scope.follow){
						$scope.followData.push($scope.follow[i].user_id);
					}
					$scope.followLen = response.data.length;
				}else{
					$scope.followLen = 0;
				}
			});
		}
		$scope.getFollow();

		$scope.goBack = function(){
			window.history.back();
		}

}]);