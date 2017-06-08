/**
 * 商务控制器
 */
app.controller('BusinessCtrl',
	['$scope', '$rootScope', '$state', 'BusinessService', '$localStorage', '$ionicSlideBoxDelegate', '$window', '$timeout','$ionicScrollDelegate','$ionicPlatform','$CommonFactory', '$ionicModal', '$location','IntelligooService','$ionicPopup','$stateParams','$cordovaToast','$sce',
	function ($scope, $rootScope, $state, BusinessService, $localStorage, $ionicSlideBoxDelegate, $window, $timeout,$ionicScrollDelegate,$ionicPlatform,$CommonFactory, $ionicModal, $location,IntelligooService,$ionicPopup,$stateParams,$cordovaToast,$sce) {
	
		$scope.nowPage = 1;

		$scope.boxChanged = function(i){
			$scope.nowPage = i;
			$localStorage.set("communityPage",i);
		}
		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};
		$scope.clickAll = function(){
			$ionicSlideBoxDelegate.slide(0)
		}

		$scope.clickTopic = function(){
			$ionicSlideBoxDelegate.slide(1)
		}

		


	


		//刷新页面
		$scope.pageReload = function () {
			$state.reload();
		}


	}
]);
