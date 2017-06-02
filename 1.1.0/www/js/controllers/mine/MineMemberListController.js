/**
 * 会员购买列表-控制器
 */
app.controller('MineMemberListCtrl',
	['$scope', '$rootScope', 'MineOrdersService', '$state',
	function ($scope, $rootScope, MineOrdersService, $state) {
		$scope.userObj = $rootScope.getCurrentUser();
		$scope.accesstoken = $rootScope.getAccessToken();

		$scope.items = [];
		$scope.currentPage = 1; //第1页开始
		$scope.itemsPerPage = 10; //每页10条
		var hasMore =true;
		$scope.isEmptyData = false;

		$scope.show = false;

		//下拉刷新
		$scope.activityDoRefresh = function(){
			$scope.isEmptyData = false;
			$scope.items = [];
			$scope.currentPage = 1;
			hasMore = true;
			$scope.getMemberList();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}

		//会员购买列表
		$scope.getMemberList = function(){
			if (hasMore) {
				var data = {
				"accesstoken" : $scope.accesstoken,
				"currentPage" : $scope.currentPage,
				"itemsPerPage" : $scope.itemsPerPage,
				//'store_id': $scope.storeId,
				//'room_type':$scope.room_type,
				'status': $scope.status
			};
			MineOrdersService.memberList(data,function(response){
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.isEmptyData = true;
					return;
				}
				if(response.statuscode == CODE_SUCCESS){
					for (var i = 0, len = response.data.length; i < len; i++) {
						$scope.items.push(response.data[i]);
					/*fake data for test,update later*/
					}
				}
				//判断总数，防止无线滚动加载
				$scope.itemTotal = response.page_info;
				if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
					$scope.isEmptyData = true;
					hasMore = false;
				} else {
					$scope.currentPage+=1;
					$scope.$broadcast('scroll.infiniteScrollComplete');
					hasMore = true;
				}
			})
			}
		};
		$scope.getMemberList();

		//跳转返回
		$scope.myBack = function(){
			window.history.back();
		}
}]);

