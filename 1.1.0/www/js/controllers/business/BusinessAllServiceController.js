/**
 * 商务-所有服务控制器
 */
app.controller('BusinessAllServiceController',
	['$scope','$rootScope','$state','$timeout','$localStorage', 'BusinessService','$ionicScrollDelegate', '$ionicSlideBoxDelegate',
	function ($scope,$rootScope,$state,$timeout,$localStorage, BusinessService,$ionicScrollDelegate, $ionicSlideBoxDelegate) {
		$scope.currentPage = 1;
		$scope.itemsPerPage = 5; //每页10条
		$scope.isOverLoad = false;
		var timeout = null; //搜索延迟
		var hasMore =true;
		$scope.isEmptyData = false;
		var accesstoken = $rootScope.getAccessToken();
		$scope.serviceTwoTypeList = [];
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//当前岛
		$scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
		$scope.currentStoreId = $scope.currentCity.city_id;
		$scope.serviceList = [];
		//服务缩略图地址
		$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;

		//默认经纬度
		var latitude = 30.555211;//纬度
		var longitude = 104.07271;//经度

		//实际定位的位置
		if ($rootScope.locationInfo && !$rootScope.isEmptyObject($rootScope.locationInfo)) {
			if ($rootScope.locationInfo.latitude && $rootScope.locationInfo.longitude) {
				latitude = $rootScope.locationInfo.latitude;
				longitude = $rootScope.locationInfo.longitude;
			}
		}

		$scope.searchKeyword = $localStorage.SearchListKeyword;
		//搜索动态
		if(!$scope.searchKeyword){
			$scope.filterOptions=""
		}else{
			$scope.filterOptions= $scope.searchKeyword
		}
		
		// $scope.$watch("filterOptions",function(newVal,oldVal){
		// 	if (newVal != oldVal) {
		// 		if (timeout) {
		// 			$timeout.cancel(timeout);
		// 		}
		// 		timeout = $timeout(function(){
		// 			$scope.isEmptyData = false;
		// 			$scope.isOverLoad = false;
		// 			$scope.currentPage = 1;
		// 			$scope.serviceList = [];
		// 			hasMore = true;
		// 			$scope.getServiceDatas();
		// 			hasMore = false;
		// 		},500)
		// 	}
		// },true)


		/**
		 * 企业服务类型
		 */
		$scope.getServiceTwoTypeDatas = function(){
			var data = {
				accesstoken: accesstoken,
				store_id: -1,
				id: 36
			}
			BusinessService.serviceTypeDatas(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.serviceTwoTypeList = response.data;
					if ($scope.serviceTwoTypeList && $scope.serviceTwoTypeList.length > 0) {
						$scope.serviceTwoTypeList.unshift({
							'id':-1,
							'label' : '全部',
							'text' : '全部'
						});
					}
				}
			});
		};
 
		$scope.getServiceTwoTypeDatas();

		//获取服务列表
		$scope.getServiceDatas = function(){
			if (hasMore) {
				var data = {
					accesstoken: accesstoken,
					currentPage: $scope.currentPage,
					itemsPerPage: $scope.itemsPerPage,
					store_id: $scope.currentStoreId,
					keyword: $scope.filterOptions,
					latitude : latitude,
					longitude : longitude,
					// home_recommend : true,
					com_service_type : $scope.serviceType ? ($scope.serviceType.id == -1 ? null : $scope.serviceType.id) : null
				}
				BusinessService.serviceDatas(data, function(response){
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = true;
						$scope.isOverLoad = true;
						hasMore = false;
						return;
					}
					//有数据
					var tmpData = response.data;
					for (var i = 0, len = tmpData.length; i < len; i++) {
						//缩略图取第一张
						/*tmpData[i].com_service_thumb_img = "";
						if (tmpData[i].material_thumb && tmpData[i].material_thumb.length > 0) {
							tmpData[i].disImgUrl = $scope.commonPath.route_path + $scope.commonPath.material_thumb_path + tmpData[i].material_thumb;
						} else {
							if (tmpData[i].com_service_thumb && tmpData[i].com_service_thumb.length > 0) {
								tmpData[i].com_service_thumb_img = tmpData[i].com_service_thumb[0];
								tmpData[i].disImgUrl = $scope.commonPath.route_path + $scope.commonPath.service_path + tmpData[i].com_service_thumb_img;
							}
						}*/
						
						if (tmpData[i].com_service_thumb && tmpData[i].com_service_thumb.length > 0) {
							tmpData[i].com_service_thumb_img = tmpData[i].com_service_thumb[0];
							tmpData[i].disImgUrl = $scope.commonPath.route_path + $scope.commonPath.service_path + tmpData[i].com_service_thumb_img;
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
					// $scope.$broadcast('scroll.refreshComplete');
					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.page_info;
					if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
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

		$scope.getServiceDatas();
		
		//活动向右滑
		/*$scope.serviceOnSwipeLeft = function(){
			$state.go("tab.communitydynamic");
		}*/
		//跳转到服务列表
		$scope.toServiceListPageForCommunity = function(type) {
			var data = {
				type_id : type.id,
			};
			$state.go('businessServiceList', data);
		}
		
		//产品详情
		$scope.toBusinessProduct = function(serviceObj) {
			var data = {
				com_service_id: serviceObj.com_service_id
			};
			$state.go('businessProduct',data);
		};
		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};


		// 更新服务类型选择事件
		$scope.selectServiceType = function(index,type) {
			$scope.serviceType = type;
			$scope.serviceList = [];
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.currentPage = 1; //当前第几页
			hasMore = true;
			$scope.getServiceDatas();
			hasMore = false;
			if ($scope.serviceTwoTypeList && $scope.serviceTwoTypeList.length > 0) {
				for (var i = 0; i < $scope.serviceTwoTypeList.length; i++) {
					if (index != i) {
						$scope.serviceTwoTypeList[i].active = false;
					} else {
						$scope.serviceTwoTypeList[i].active = true;
					}
				}
			}
		};
		//搜索框关键字搜索
		$scope.searchClick = function(){
			$scope.serviceList = [];
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.currentPage = 1; //当前第几页
			hasMore = true;
			$scope.getServiceDatas();
			hasMore = false;
		}


		//下拉刷新
		$scope.serviceDoRefresh = function() {
			$scope.serviceList = [];
			$scope.currentPage = 1;
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			hasMore = true;
			$scope.getServiceDatas();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		};

		$scope.disableSwipeSlide = function() {
			$ionicSlideBoxDelegate.enableSlide(false);
		}
		$scope.enableSwipeSlide = function() {
			$ionicSlideBoxDelegate.enableSlide(true);
		}
	}
]);