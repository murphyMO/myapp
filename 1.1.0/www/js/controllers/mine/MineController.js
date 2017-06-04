/**
 * 我的控制器
 */
app.controller('MineCtrl',
	['$scope', '$window', '$rootScope', '$localStorage', '$CommonFactory','$stateParams', 'MineService', '$timeout','$state','$ionicSlideBoxDelegate','$sce','$ionicModal',
	function ($scope, $window, $rootScope, $localStorage, $CommonFactory,$stateParams, MineService,$timeout, $state,$ionicSlideBoxDelegate,$sce,$ionicModal) {


		// 获取用户信息
		$scope.user = $rootScope.getCurrentUser();
		$scope.user_id = $scope.user.objectId;

		// 获取基本信息
		$scope.getInfo = function(){
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			//判断是否当前用户
			if(data.currentUserId == $scope.user_id){
				$scope.isCurrent = true;
			}else{
				$scope.isCurrent = false;
			}

			MineService.user(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$scope.userInfo = response.user;
					$scope.avatar = $scope.userInfo.avatar.url? $scope.userInfo.avatar.url : 'img/icon_emptyPeron.png';
				}
			});
		}
		$scope.getInfo();
		

		// 获取关注的人
		$scope.getFocus = function(){
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}

			MineService.focus(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.focusData = [];
					$scope.focus = response.data;
					for(i in $scope.focus){
						$scope.focusData.push($scope.focus[i].target_id);
					}
					$scope.focusLen = response.data.length;
				}else{
					$scope.focusLen = 0;
				}
			});
		}
		$scope.getFocus();

		// 获取粉丝
		$scope.getFollow = function(){
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			MineService.follow(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.follow = response.data;
					$scope.followLen = response.data.length;
				}else{
					$scope.followLen = 0;
				}
			});
		}
		$scope.getFollow();





		$scope.likeIsEmpty = false;
		$scope.topicIsEmpty = false;
		//获取当前用户喜欢的内容
		$scope.getMineLike = function(){ 
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			MineService.like(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.likes = response.data;
					$scope.likeIsEmpty = false;
				}else{
					$scope.likeIsEmpty = true;
				}
			});
		}
		$scope.getMineLike();

		// 收藏话题
		$scope.getMineTopic = function(){ 
			var data = {};
			if($stateParams.id){
				data.currentUserId = $stateParams.id;
			}else{
				data.currentUserId = $scope.user_id;
			}
			MineService.topic(data, function (response) {
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					$scope.topics = response.data;
					$scope.topicIsEmpty = false;
				}else{
					$scope.topicIsEmpty = true;
				}
			});
		}


		$scope.editInfo = function(){
			
		}

		$scope.goBack = function(){
			window.history.back();
		}



		if($stateParams.thisItem){
			$scope.thisItem = $stateParams.thisItem;
		}else{
			$scope.thisItem = 0;
		}
		
		

			$scope.goBalanceList = function(){
				$localStorage.set('unPay',$scope.unPayInfo.unpaid.unpaid_amount);
				$state.go("balanceList")
			}
			$scope.goCouponList = function(){
				$localStorage.setObject('coupon',$scope.unPayInfo.coupon);
				$state.go("couponList")
			}

			//滑动
			$scope.slideHasChanged = function(i){
				//$state.go('tab.mine',{thisItem:i});
				$localStorage.set("Page",i);
				$scope.thisItem = i;
			}
			$scope.clickLike = function(){
				$ionicSlideBoxDelegate.slide(0);
			}
			$scope.clickTopic = function(){
				$ionicSlideBoxDelegate.slide(1)
				$scope.getMineTopic();
		}
			$scope.clickInfo = function(){
				$ionicSlideBoxDelegate.slide(2)
			}


	}
]);
