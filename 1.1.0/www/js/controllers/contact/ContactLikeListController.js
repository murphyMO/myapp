/**
 * 点赞控制器
 */
app.controller('ContactLikeListCtrl', 
	['$scope', '$rootScope', '$localStorage', '$state','ContactService', '$CommonFactory','$ionicHistory',
	function($scope, $rootScope, $localStorage, $state, ContactService, $CommonFactory,$ionicHistory) {
	var accesstoken = $rootScope.getAccessToken();
	
	$rootScope.appTitle = '点赞';
	$rootScope.appHeader = true; //头部为true显示
	$rootScope.appNav = false; //底部导航为true显示
	$rootScope.isShowBottom = false;
	var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
	$scope.path = commonPath.route_path + commonPath.photo_path;
	$scope.itemsPerPage = 999; //每页999条
	$scope.currentPage = 1;
	$scope.itemTotal = 0;
	$scope.isEmptyData = false;
	$scope.likeList = [];
	
	//点赞列表
	$scope.getLikeDatas = function(){
		var data = {
			accesstoken : accesstoken,
			currentPage : $scope.currentPage,
			itemsPerPage : $scope.itemsPerPage
		};
		ContactService.likeDatas(data, function(response){
			//没有数据
			if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
				$scope.isEmptyData = true;
				return;
			}
			//有数据
			var tmpData = response.data;
			for (var i = 0, len = tmpData.length; i < len; i++) {
				$scope.likeList.push(tmpData[i]);
			}
			//判断总数，防止无线滚动加载
			$scope.itemTotal = response.page_info;
			if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
				$scope.isEmptyData = true;
			} else {
				$scope.currentPage++;
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
		});
	};

	$scope.getLikeDatas();

	//点赞页面跳转到响应的产品/需求页面
	$scope.toItem = function(thisItem){
		//console.log(thisItem);
		switch (thisItem.type_id) {
			//1 文章 2 需求 3 活动 4 服务 
			case "1":
				$state.go('dynamicitem',{'id':thisItem.target_id,'from':'contactlikelist'});
				break;
			case "2":
				$state.go('demanditem',{'id':thisItem.target_id,'from':'contactlikelist'});
				break;
			case "3":
				$state.go('activityitem',{'id':thisItem.target_id,'from':'contactlikelist'});
				break;
			case "4":
				$state.go('businessProduct',{'com_service_id':thisItem.target_id,'from':'contactlikelist'});
				break;
		}
		$scope.updateLikeItemStatus(thisItem);
	};

	//页面返回事件
	$scope.myBack = function() {
		$state.go('tab.contact');
	}

	//更新已读
	$scope.updateLikeItemStatus = function(thisItem) {
		var data = {
			accesstoken : accesstoken,
			target_type : thisItem.target_type,
			target_id : thisItem.like_id
		};
		ContactService.updateLikeItemStatus(data);
	};

}]);