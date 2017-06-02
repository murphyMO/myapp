/**
 * 会议室详情控制器
 */
app.controller('ConferenceRoomDetailController',
	['$scope', '$rootScope', '$state','$stateParams', '$localStorage', '$ionicHistory',
	function ($scope, $rootScope, $state,$stateParams, $localStorage, $ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.user = $rootScope.getCurrentUser();
		$scope.from = $state.params.hasOwnProperty("from") ? $state.params.from : "";
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.item = $localStorage.getObject("conference_item")

		$scope.buy = function(i){
			$localStorage.setObject("conference_item",i)
			$state.go("conferenceRoomBook")
		}
		//跳转返回
		$scope.topBack = function(){
			if($scope.from){
				$state.go($scope.from);
				return;
			}

			$ionicHistory.goBack();
//			window.history.back();
		}
	}
]);
