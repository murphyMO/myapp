/**
 * 社区控制器
 */
app.controller('CommunityBoxCtrl',
	['$scope','$ionicSlideBoxDelegate','$localStorage',
	function ($scope,$ionicSlideBoxDelegate,$localStorage) {
		
		if ($localStorage.get("communityPage")) {
			$scope.nowPage = $localStorage.get("communityPage");
			$localStorage.set("communityPage",0)
		}
		else{
			$scope.nowPage = 0
		}

		$scope.boxChanged = function(i){
			$scope.nowPage = i;
		}
		$scope.clickService = function(){
			$ionicSlideBoxDelegate.slide(0)
		}
		$scope.clickDynamic = function(){
			$ionicSlideBoxDelegate.slide(1)
		}
		$scope.clickActivity = function(){
			$ionicSlideBoxDelegate.slide(2)
		}


	}
]);