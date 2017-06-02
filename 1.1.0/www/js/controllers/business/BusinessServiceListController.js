/**
 * 服务分类二级控制器 
 */
app.controller('BusinessServiceListCtrl',
	['$scope', '$rootScope', '$localStorage', 'BusinessService', '$stateParams', '$timeout', '$state', '$ionicHistory',
	function ($scope, $rootScope, $localStorage, BusinessService, $stateParams, $timeout, $state, $ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.type_id = $stateParams.type_id;
//		$scope.type_id = $state.params.data.type_id;
		$scope.parent_type_id = $stateParams.type_id;
		
		//当前岛
		$scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
		$scope.currentStoreId = $scope.currentCity.city_id;
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//服务缩略图地址
		$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.service_thumb_path;
		
		//第一页
		$scope.currentPage = 1;
		//每页10条
		$scope.itemsPerPage = 10;
		$scope.itemTotal = 0;
		$scope.isEmptyData = false;
		$scope.isOverLoad = false; //控制没有数据的时候显示
		$scope.serviceList = [];
		$scope.filterOptions = ""; //搜索参数
		var hasMore = true;
		var timeout = null; //搜索延迟
		//单个产品
		$scope.serviceType = {};
		//二级分类
		//$scope.hasSecondCate = $state.params.data.hasSecondCate ? $state.params.data.hasSecondCate : false;
		$scope.hasSecondCate = false;
		$scope.serviceTypeList = [];
		
		//单个产品大类
		$scope.getServiceTypeDatasOne = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				id: $scope.type_id
			};
			BusinessService.serviceTypeDatasOne(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.serviceType = response.data;
				}
			});
		};
		
		$scope.getServiceTypeDatasOne();
		
		
		
		//服务分类
		$scope.getServiceTypeDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
//				currentPage: 1,
//				itemsPerPage: 3,
				store_id: $scope.currentStoreId,
				id: $scope.type_id
			}
			BusinessService.serviceTypeDatas(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.serviceTypeList = response.data;
				}
			});
		};
		
		$scope.getServiceTypeDatas();
		
		//获取服务列表
		$scope.getServiceDatas = function(){
			if (hasMore) {
				var data = {
					accesstoken: $scope.accesstoken,
					currentPage: $scope.currentPage,
					itemsPerPage: $scope.itemsPerPage,
					store_id: $scope.currentStoreId,
					com_service_type: $scope.type_id,
					keyword: $scope.filterOptions
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
		
//		//下拉刷新
//		$scope.demandDoRefresh = function(){
//			$scope.isEmptyData = false;
//			$scope.isOverLoad = false;
//			$scope.currentPage = 1; //当前第一页
//			$scope.serviceList = [];
//			$scope.getServiceDatas();
//			$scope.$broadcast('scroll.refreshComplete');
//		}

		//搜索过滤
		/*$scope.$watch('filterOptions', function (newVal, oldVal) {
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				}
				timeout = $timeout(function() {
					$scope.isEmptyData = false;
					$scope.isOverLoad = false;
					$scope.currentPage = 1; //当前第一页
					$scope.serviceList = [];
					$scope.getServiceDatas();
				}, 500);
			}
		}, true);*/
		
		$scope.$watch('filterOptions', function (newVal, oldVal) {
			if (timeout) {
				$timeout.cancel(timeout);
			}
			timeout = $timeout(function() {
				if (newVal != oldVal) {
					$scope.isEmptyData = false;
					$scope.isOverLoad = false;
					$scope.currentPage = 1; //当前第一页
					$scope.serviceList = [];
					hasMore = true;
					$scope.getServiceDatas();
					hasMore = false;
				}
			}, 500);
		}, true);
		
		//刷新服务列表
		$scope.refreshServiceListPage = function(type) {
//			$localStorage.set("parent_type_id", $scope.type_id);
			$scope.hasSecondCate = true;
			$scope.type_id = type.id;
			
			$scope.serviceType = {};
			$scope.serviceTypeList = [];
			
			$scope.getServiceTypeDatasOne();
			$scope.getServiceTypeDatas();
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.currentPage = 1; //当前第一页
			$scope.serviceList = [];
			$scope.getServiceDatas();
		}
		
		//返回
		$scope.topBack = function() {
			//$state.go("businessService");
//			$state.go("tab.community");
//			$state.go($state.params.from);
			if ($scope.hasSecondCate) {
				$scope.hasSecondCate = false;
				$scope.type_id = $scope.parent_type_id;
				
				$scope.serviceType = {};
				$scope.serviceTypeList = [];
				
				$scope.getServiceTypeDatasOne();
				$scope.getServiceTypeDatas();
				$scope.isEmptyData = false;
				$scope.isOverLoad = false;
				$scope.currentPage = 1; //当前第一页
				$scope.serviceList = [];
				hasMore = true;
				$scope.getServiceDatas();
			} else {
				$ionicHistory.goBack();
			}
//			
//			$localStorage.set("parent_type_id", "");
//			$scope.from = $state.params.data.from ? $state.params.data.from : "";
//			if($scope.from){
//				if ($state.params.data.from_param) {
//					$state.go($scope.from, {data: $state.params.data.from_param});
//				} else {
//					$state.go($scope.from);
//				}
//			} else {
//				$state.go("tab.community");
//			}
		}
		
		//产品详情
		$scope.toBusinessProduct = function(service) {
//			var data = {
//				com_service_id: service.com_service_id,
//				from : $state.current.name,
//				from_param: {
//					type_id : $scope.type_id,
//					from: $state.params.data.from,
//					hasSecondCate: $scope.hasSecondCate
//				}
//			};
//			$state.go('businessProduct',{data: data});
			
			var paramsObj = {
				com_service_id : service.com_service_id,
			};
			
			$state.go('businessProduct', paramsObj);
		}
		
	}
]);