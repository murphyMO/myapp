/**
 * 报名给我的控制器
 */
app.controller('ActivityForMeController',
	['$scope', '$window', '$resource','$stateParams','$state','CompanyServiceService', '$localStorage','$rootScope', '$timeout', '$CommonFactory', 'BusinessService',
	function ($scope, $window, $resource,$stateParams,$state,CompanyServiceService,$localStorage, $rootScope, $timeout, $CommonFactory, BusinessService) {

		$scope.enrollList = [];//报名人员列表
		$scope.hasMore = true;
		$scope.emptyData = false;
		var timeout = null; //搜索延迟
		var accesstoken = $rootScope.getAccessToken();

		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		/*console.log($scope.commonPath)*/
		
		$scope.currentPage = 1;
		$scope.itemsPerPage = 5;

		var loadAlready = false;

		$scope.article_target_id = $state.params.article_target_id;

		//下拉刷新
		$scope.doListRefresh = function(){
			$scope.enrollList = [];
			$scope.currentPage = 1;
			loadAlready = false;
			$scope.getActivityForMe();
			loadAlready = true;
			$scope.$broadcast('scroll.refreshComplete');
		}
		
				
		//获取数据
		$scope.getActivityForMe = function(){
			var data = {
				"accesstoken" : accesstoken,
				"party_id" : $scope.article_target_id,
				"currentPage" : $scope.currentPage,
				"itemsPerPage" : $scope.itemsPerPage,
			}

			if (!loadAlready) {
				$CommonFactory.showLoading();
				CompanyServiceService.getaActivityList(data,function(response){
					$CommonFactory.hideLoading();
					loadAlready = true;
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.emptyData = true;
						$scope.hasMore = false;
						return;
					}
					$scope.hasMore = true;
					if(response.statuscode == CODE_SUCCESS){
						for (var i = 0, len = response.data.length; i < len; i++) {
							$scope.enrollList.push(response.data[i]);
						}
					}
					//判断总数，防止无线滚动加载
					$scope.dynamicItemTotal = response.page_info;
					if ($scope.CurrentPage * $scope.itemsPerPage > $scope.ItemTotal) {
						$scope.hasMore = false;
					}
					else {
						$scope.dynamicCurrentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}
				})
			}
		};

		$scope.getActivityForMe();
}]);
