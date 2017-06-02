/**
 * 办公空间
 */
app.controller('MyOfficeZoneCtrl',
	['$scope', '$rootScope', "$state", '$CommonFactory', '$stateParams', '$localStorage','$cordovaToast',
	function ($scope, $rootScope, $state, $CommonFactory, $stateParams, $localStorag,$cordovaToast) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.user = $rootScope.getCurrentUser();

		$scope.expressform = function(){
				if($rootScope.isGuest){
					$state.go('login');
				}else{
					$state.go('expressform');
				}
			}
		$scope.maintenance = function(){
				if($rootScope.isGuest){
					$state.go('login');
				}else{
					$state.go('maintenance');
				}
			}
		$scope.cleaningappli = function(){
				if($rootScope.isGuest){
					$state.go('login');
				}else{
					$state.go('cleaningappli');
				}
			}
		$scope.personalservice = function(){
				if($rootScope.isGuest){
					$state.go('login');
				}else{
					$state.go('personalservice');
				}
			}

		// 办公手册
		$scope.goMessage = function(){
			$state.go("officeBook");
		}

		$scope.errMessage = function(){
			$cordovaToast.show("暂未开放，敬请期待", "long", "center");
		}

}]);
