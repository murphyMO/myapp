/**
 * 我的发布控制器
 */
app.controller('MineEnrollCtrl',
	['$scope', 'MineEnrollService','$rootScope','$state','$localStorage','$CommonFactory',
	function ($scope,MineEnrollService,$rootScope,$state,$localStorage,$CommonFactory) {
		$scope.re = {};
		$scope.activityList = [];//活动列表
		$scope.activityImgItems = [];
		$scope.activityCurrentPage = 1; //第1页开始
		var accesstoken = $localStorage.get("accesstoken");

		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		

		//活动列表
		$scope.getActivityList = function(){
			var data = {
				"accesstoken" : accesstoken,
				"currentPage" : $scope.activityCurrentPage,
				"itemsPerPage" : $scope.itemsPerPage,
				"listType":"mine"
			};
			MineEnrollService.getActivityList(data,function(response){
				//console.log(response);
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.activityIsEmptyData = true;
					$scope.activityIsOverLoad = true;
					return;
				}
				if(response.statuscode == CODE_SUCCESS){
					/*for (var i = 0, len = response.data.length; i < len; i++) {
						response.data[i].activityImgItems = [];
						for(var j = 0; j<response.data[i].party_thumb.length; j++){
							response.data[i].activityImgItems.push({"src": $scope.commonPath.route_path +$scope.commonPath.article_photo_path + response.data[i].party_thumb[j]});
						}
						$scope.activityList.push(response.data[i]);
					}*/
					$scope.activityList=response.data;
					console.log($scope.activityList);
				}
				//判断总数，防止无线滚动加载
				$scope.activityItemTotal = response.page_info;
				if ($scope.activityCurrentPage * $scope.itemsPerPage > $scope.activityItemTotal) {
					$scope.activityIsEmptyData = true;
				} else {
					$scope.activityCurrentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			})
		};
		$scope.getActivityList();
	}
]);