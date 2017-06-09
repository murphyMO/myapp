/**
 * 社区-动态控制器
 */
app.controller('CommunityDynamicCtrl',
	['$scope', 'CommunityService','$rootScope','$state','$localStorage','$CommonFactory','$timeout','$ionicScrollDelegate','$cordovaToast','chatFactory','$ionicSlideBoxDelegate','$sce',
	function ($scope, CommunityService,$rootScope,$state,$localStorage,$CommonFactory,$timeout,$ionicScrollDelegate,$cordovaToast,chatFactory,$ionicSlideBoxDelegate,$sce) {
		$scope.user = $rootScope.getCurrentUser();
		$scope.user_id = $scope.user.objectId;
		$scope.nowPage = 0;


		//所有动态
		$scope.refreshAll = function(){
			var data = {

			}
			CommunityService.getAll(data,function(response){
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0){
					$scope.isEmptyAll = true;
				}else{
					$scope.allInfo = response.data;
					for(i in $scope.allInfo){
						if(!$scope.allInfo[i].cre_user.avatar){
							$scope.allInfo[i].cre_user.avatar = {};
							$scope.allInfo[i].cre_user.avatar.url='img/icon_emptyPeron.png';
						}
					}
					$scope.isEmptyAll = false;
					$scope.$broadcast('scroll.refreshComplete');
				}
			})
		}
		$scope.refreshAll()

		$scope.refreshMine = function(){
			var data = {
				'currentUserId': $scope.user_id
			}
			CommunityService.getMine(data,function(response){
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0){
					$scope.isEmptyMine = true;
				}else{
					$scope.mineInfo = response.data;
					for(i in $scope.mineInfo){
						if(!$scope.mineInfo[i].cre_user.avatar){
							$scope.mineInfo[i].cre_user.avatar = {};
							$scope.mineInfo[i].cre_user.avatar.url='img/icon_emptyPeron.png';
						}
					}
					$scope.isEmptyMine = false;
					$scope.$broadcast('scroll.refreshComplete');
				}
			})
		}




		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(0);
		};


		$scope.boxChanged = function(i){
			$scope.nowPage = i;
			// $localStorage.set("communityPage",i);
		}
		$scope.isFirstAll = true;
		$scope.isFirstMine = true;
		$scope.clickAll = function(){
			$ionicSlideBoxDelegate.slide(0);
			if($scope.isFirstAll){
				$scope.refreshAll();
			}
			$scope.isFirstAll = false;
		}

		$scope.clickTopic = function(){
			$ionicSlideBoxDelegate.slide(1);
			if($scope.isFirstMine){
				$scope.refreshMine();
			}
			$scope.isFirstMine = false;
		}

	}
]);
