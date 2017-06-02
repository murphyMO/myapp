/**
 * 我的话题之已审核话题
 * 2016/10/12
 */
app.controller('AgreeTopicCtrl', ['$scope','$window','$state','$stateParams','$localStorage', '$resource', 'MineTopicService','$CommonFactory','$rootScope', '$ionicSlideBoxDelegate','$ionicScrollDelegate',
	function ($scope,$window,$state,$stateParams,$localStorage,$resource, MineTopicService,$CommonFactory,$rootScope, $ionicSlideBoxDelegate,$ionicScrollDelegate) {
	
	//初始数据为空
	$scope.items = [];
	
	//请求参数
	//$scope.accesstoken = $rootScope.getAccessToken();
	var accesstoken = $localStorage.get("accesstoken");
	$scope.currentPage = 0; //第1页开始
	$scope.itemsPerPage = 1; //每页1条
	$scope.items = [];
	var hasMore = true; //默认还有数据
	var type = "mine"; //获取我的话题
	
	//获取数据
	$scope.getMineTopicList = function(){
		$scope.currentPage++;
		if (hasMore) {
				var data = {
				"accesstoken" : "3fb7b4bb59ba92cb4e734c89999ee62a",
				"type": type,
				'currentPage': $scope.currentPage,
				'itemsPerPage': $scope.itemsPerPage,
				'status': 1
			}
			MineTopicService.getMineTopicList(data, function(res){
				//判断是否无数据
				if (res.statuscode != CODE_SUCCESS || res.data.length == 0) {
					$scope.topicIsEmptyData = true;
					$scope.topicIsOverLoad = true;
					return;
				}
				if(res.statuscode == CODE_SUCCESS){
					//添加数据
					var tmpData = res.data;
					for (var i = 0, len = tmpData.length; i < len; i++) {
						$scope.items.push(tmpData[i]);
					}
				}
				//判断总数，防止无限滚动加载
				$scope.topicItemTotal = res.page_info;
				if ($scope.currentPage * $scope.itemsPerPage >= $scope.topicItemTotal) {
					$scope.topicIsOverLoad = true;
					hasMore = false;
				}else {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					hasMore = true;
				}
			});
		}
	};
	
	//下拉刷新页面
	$scope.doTopicRefresh = function(){
		$scope.items = [];
		$scope.topicIsEmptyData = false;
		$scope.currentPage = 0; 
		$scope.getMineTopicList();
		$scope.$broadcast('scroll.refreshComplete');
	};
	//回到顶部
	$scope.scrollTop = function() {
		$ionicScrollDelegate.scrollTop(1000);
	};	
}]);
