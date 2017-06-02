/**
 * 搜索控制器
 */
app.controller('BusinessSearchListCtrl',
	['$scope', '$rootScope', '$state','$stateParams', 'BusinessService', '$localStorage', '$ionicSlideBoxDelegate', '$timeout','$ionicScrollDelegate',
	function ($scope, $rootScope, $state,$stateParams, BusinessService, $localStorage, $ionicSlideBoxDelegate, $timeout,$ionicScrollDelegate) {
//		$scope.accesstoken = $rootScope.getAccessToken();
//		//热门分类
//		$scope.getServiceTypeDatas = function(){
//			var data = {
//				accesstoken: $scope.accesstoken,
////				currentPage: 1,
////				itemsPerPage: 3,
//				store_id: $scope.currentStoreId
//			}
//			BusinessService.serviceTypeDatas(data, function(response){
//				if (response.statuscode == CODE_SUCCESS) {
//					$scope.serviceTypeList = response.data;
//				}
//			});
//		};
//
//		$scope.getServiceTypeDatas();

		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.com_service_type = $stateParams.com_service_type;
		$scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
		console.log($scope.currentCity)


		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//服务缩略图地址
		$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.service_thumb_path;
		//第一页
		$scope.currentPage = 1;
		var hasMore =true;
		//每页10条
		$scope.itemsPerPage = 10;
		$scope.itemTotal = 0;
		$scope.isEmptyData = false; //控制加载更多
		$scope.isOverLoad = false; //控制没有数据的时候显示
		$scope.serviceList = [];
		$scope.filterOptions = ""; //搜索参数
		$scope.filterOptions = $localStorage.SearchListKeyword;
		// if ($stateParams.data) {
		//   $timeout( function(){
		//	 $scope.filterOptions = $stateParams.data.searchcontent;
		//	 console.log($scope.filterOptions);
		//   });
		// }
		$localStorage.SearchListKeyword="";
		var timeout = null; //搜索延迟

		//获取服务列表
		$scope.getServiceDatas = function(){
			if (hasMore) {
				var data = {
					accesstoken: $scope.accesstoken,
					currentPage: $scope.currentPage,
					itemsPerPage: $scope.itemsPerPage,
					keyword: $scope.filterOptions,
					com_service_type:$scope.com_service_type,
					store_id : $scope.currentCity.city_id
				}
				BusinessService.serviceDatas(data, function(response){
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = true;
						$scope.isOverLoad = true;
						return;
					}
					//有数据
					var tmpData = response.data;
					for (var i = 0, len = tmpData.length; i < len; i++) {
						//缩略图去第一张
						tmpData[i].com_service_thumb_img = "";
						if (tmpData[i].com_service_thumb && tmpData[i].com_service_thumb.length > 0) {
							tmpData[i].com_service_thumb_img = tmpData[i].com_service_thumb[0];
						}
						//所属岛
						tmpData[i].range_last = "";
						if (tmpData[i].range && tmpData[i].range.length > 0) {
							if (tmpData[i].range[0].store) {
								tmpData[i].range_last = tmpData[i].range[0].store;
							} else if (tmpData[i].range[0].city) {
								tmpData[i].range_last = tmpData[i].range[0].city;
							} else if (tmpData[i].range[0].province) {
								tmpData[i].range_last = tmpData[i].range[0].province;
							}
						}
						$scope.serviceList.push(tmpData[i]);
					}
					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.page_info;
					if ($scope.currentPage * $scope.itemsPerPage >= $scope.itemTotal) {
						$scope.isEmptyData = true;
						hasMore = false;
					} else {
						$scope.currentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						hasMore = true;
					}
				});
			}
		};

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};

		//下拉刷新
		$scope.demandDoRefresh = function(){
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.currentPage = 1; //当前第一页
			$scope.serviceList = [];
			hasMore = true;
			$scope.getServiceDatas();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}

		//搜索过滤
		$scope.$watch('filterOptions', function (newVal, oldVal) {
			if (newVal !== oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				}
				timeout = $timeout(function() {
					$scope.isEmptyData = false;
					$scope.isOverLoad = false;
					$scope.currentPage = 1; //当前第一页
					$scope.serviceList = [];
					hasMore = true;
					$scope.getServiceDatas();
					hasMore = false;
				}, 500);
			}
		}, true);
	//跳转返回
	$scope.jump=function(){
		$scope.filterOptions = '';
	}
	
	//返回
	$scope.topBack = function() {
		$state.go('businessSearch');
	}
	
	}
]);
