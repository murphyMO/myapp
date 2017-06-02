/**
 * 社区控制器
 */
app.controller('BusinessAllPostsSlideController',
	['$scope', '$rootScope', '$ionicSlideBoxDelegate','$localStorage', '$state', '$CommonFactory',
	function ($scope, $rootScope, $ionicSlideBoxDelegate,$localStorage, $state, $CommonFactory) {
		//默认发布modal hide
		$scope.post = {modalShow:false};

		$scope.currentUser = $rootScope.getCurrentUser();

		//当前岛
		$scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
		if (!$scope.currentCity.city_name) {
			$scope.currentCity = {
				city_id: -1,
				city_name: "全国"
			}

		}
		//全国时为-1
		$scope.currentStoreId = $scope.currentCity.city_id;

		//设置apptitle
		if ($scope.currentStoreId == -1) {
			//全国
			$scope.appTitle = "全国";
		} else {
			//单岛
			$scope.appTitle = $scope.currentCity.city_name;
		}

		$scope.pages = $localStorage.SearchPage;

		// if ($localStorage.get("communityPage")) {
		// 	$scope.nowPage = $localStorage.get("communityPage");
		// 	$localStorage.set("communityPage",0)
		// } else {
			if(!$scope.pages){
				$scope.nowPage = 0
			} else if ($scope.pages==2){
				$scope.nowPage = 2
			} else if ($scope.pages==3){
				$scope.nowPage = 3
			} else if ($scope.pages==1){
				$scope.nowPage = 1
			}
		// }

		$scope.boxChanged = function(i) {
			$scope.nowPage = i;
			$localStorage.SearchPage = i;
		}

		// $scope.clickService = function() {
		// 	$ionicSlideBoxDelegate.slide(1);
		// }
		// $scope.clickDynamic = function() {
		// 	$ionicSlideBoxDelegate.slide(2);
		// }
		$scope.clickActivity = function() {
			$ionicSlideBoxDelegate.slide(1);
		}
		$scope.clickRecommend = function() {
			$ionicSlideBoxDelegate.slide(0);
		}
		// 返回
		$scope.back = function() {
			// window.history.back();
			$state.go("tab.business");
		};
		//选择发布类型
		$scope.selectPostType = function() {
			//检查权限
			if ($scope.currentUser.user_type == 1) {
				var message = "发布是会员专享权益哦，请尽快成为会员吧！如有疑问，请咨询小师妹400-900-9088";
				$CommonFactory.showConfirm($scope.goToMemauthority, message);
				return true;
			}
			$scope.post.modalShow = !$scope.post.modalShow;
			//$scope.post.modalShow 初始化为false但是ios进来会闪一下，故直接display none,需要显示再来操作display---xuan
			/*if ($scope.post.modalShow) {
				angular.element(document.querySelector('.post-modal-flag')).removeClass("display-none");
			} else {
				angular.element(document.querySelector('.post-modal-flag')).addClass("display-none");
			}*/

		};
		//隐藏发布类型选择modal
		$scope.hidePostModal = function() {
			$scope.post.modalShow = false;
			//angular.element(document.querySelector('.post-modal-flag')).addClass("display-none");
		};
		//发布活动事件
		$scope.postActivity = function() {
			if($rootScope.isGuest){
				$state.go('login');
				}else{
			$state.go('postactivity');
			}
		};
		//游客模式
		// $scope.commend = function(){
		// 		if($rootScope.isGuest){
		// 			$state.go('login');
		// 		}else{
		// 			// $state.go("activityitem({id:item.party_id,from:'businessallposts',page:'0'})");
		// 			$state.go("activityitem",{id:party_id,from:'businessallposts',page:'0'});
		// 		}
		// 	}
		// $scope.activity = function(){
		// 		if($rootScope.isGuest){
		// 			$state.go('login');
		// 		}else{
		// 			// $state.go("activityitem({id:item.party_id,from:'businessallposts',page:'0'})");
		// 			$state.go("activityitem",{id:party_id,from:'businessallposts',page:'0'});
		// 		}
		// 	}

		//发布需求事件
		$scope.postNeed = function() {
			$state.go('postneed');
		};

		//发布需求事件
		$scope.postService = function() {
			$state.go('postservice');
		};

		//跳转到会员购买页面
		$scope.goToMemauthority = function() {
			$state.go('memauthority');
		};
		// 跳转返回
		$scope.ComBack = function(){
		$state.go('tab.business',{refresh:'tab.business'});
		}

	}
]);
