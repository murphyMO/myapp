/**
 * 我的话题
 * 2016/10/12
 */
app.controller('MyTopicCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicSlideBoxDelegate','$localStorage', '$state',
	function ($scope, $rootScope, $stateParams, $ionicSlideBoxDelegate,$localStorage, $state) {
		//切换功能
		$scope.current_slide = $stateParams.current_slide ? $stateParams.current_slide : 0;//初始设置
		$scope.clickWaitTopic = function() {
			$scope.current_slide = 0;
			$ionicSlideBoxDelegate.slide(0);
		};
		$scope.clickAgreeTopic = function() {
			$scope.current_slide = 1;
			$ionicSlideBoxDelegate.slide(1);
		};
		$scope.clickRejectTopic = function() {
			$scope.current_slide = 2;
			$ionicSlideBoxDelegate.slide(2);
		};
		$scope.changeTopicType = function(index) {
			$scope.current_slide = index;
			$ionicSlideBoxDelegate.slide(index);
		}
	}
]);
