/*
 * 欢迎页控制器
 */
app.controller('WelcomeController',
	['$scope', '$window', '$rootScope', "$state","$ionicSlideBoxDelegate",
		function ($scope, $window, $rootScope, $state,$ionicSlideBoxDelegate) {
		var accesstoken = $rootScope.getAccessToken();
		$scope.myActiveSlide = 0;
		$scope.test = function(i){
			$scope.thisPage = $ionicSlideBoxDelegate.currentIndex()
			console.log($scope.thisPage)
		}


	}]);
