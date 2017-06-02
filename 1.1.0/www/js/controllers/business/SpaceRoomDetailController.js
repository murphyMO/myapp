/**
 * 活动场地详情控制器
 */
app.controller('SpaceRoomDetailController',
	['$scope', '$rootScope', '$state','$stateParams', '$localStorage',
	function ($scope, $rootScope, $state,$stateParams, $localStorage) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.user = $rootScope.getCurrentUser();
		$scope.from = $state.params.hasOwnProperty("from") ? $state.params.from : "";
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.item = $localStorage.getObject("space_item")

		$scope.buy = function(i){
			$localStorage.setObject("space_item",i)
			$state.go("spaceRoomBook")
		}
		//跳转返回
		$scope.topBack = function(){
			if($scope.from){
				$state.go($scope.from);
				return;
			}
			window.history.back();
		}
	}
]);
