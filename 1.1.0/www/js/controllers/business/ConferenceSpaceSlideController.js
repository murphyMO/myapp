/**
 * 社区控制器
 */
app.controller('ConferenceSpaceSlideController',
	['$scope', '$state','$ionicScrollDelegate','$ionicSlideBoxDelegate','$localStorage', '$CommonFactory',
	function ($scope, $state,$ionicScrollDelegate,$ionicSlideBoxDelegate,$localStorage) {


		if ($localStorage.get("ConferenceSpacePage")) {
			$scope.nowPage = $localStorage.get("ConferenceSpacePage");
		}
		else{
			$scope.nowPage = 0
		}

		$scope.boxChanged = function(i){
			$scope.nowPage = i;
			$localStorage.set("ConferenceSpacePage",i);
		}

		$scope.clickConference = function() {
			$ionicSlideBoxDelegate.slide(0);
		}
		$scope.clickSpace = function() {
			$ionicSlideBoxDelegate.slide(1);
		}
		$scope.scrollTop = function() {
			console.log($ionicScrollDelegate)
			$ionicScrollDelegate.scrollTop(1000);
		};

		// 返回
		$scope.topBack = function() {
			// window.history.back();
			$state.go("tab.business");
		};
	}
]);