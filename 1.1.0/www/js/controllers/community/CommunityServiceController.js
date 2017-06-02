/**
 * 社区--服务控制器
 */
app.controller('CommunityServiceCtrl',
	['$scope','$rootScope','$state','$localStorage', 'BusinessService','$ionicScrollDelegate',
	function ($scope,$rootScope,$state,$localStorage, BusinessService,$ionicScrollDelegate) {
		$scope.currentPage = 1;
		$scope.itemsPerPage = 5; //每页10条
		var accesstoken = $rootScope.getAccessToken();
		$scope.serviceTwoTypeList = [];
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//当前岛
		$scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
		$scope.currentStoreId = $scope.currentCity.city_id;
		$scope.serviceList = [];
		//服务缩略图地址
		$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;

		/**
		 * 企业服务下面的所有二级分类--目前写死
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
				}
			});
		};
 
		$scope.getServiceTwoTypeDatas();

		//获取服务列表
		$scope.getServiceDatas = function(){
			var data = {
				accesstoken: accesstoken,
				currentPage: $scope.currentPage,
				itemsPerPage: $scope.itemsPerPage,
				store_id: $scope.currentStoreId,
				home_recommend : true
			}
			BusinessService.serviceDatas(data, function(response){
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.isEmptyData = false;
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
				if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
					$scope.isEmptyData = true;
				} else {
					$scope.currentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			});
		};
		
		//活动向右滑
		$scope.serviceOnSwipeLeft = function(){
			$state.go("tab.communitydynamic");
		}
		//跳转到服务列表
		$scope.toServiceListPageForCommunity = function(type) {
			var data = {
				type_id : type.id,
			};
			$state.go('businessServiceList', data);
		}
		
		//产品详情
		$scope.toBusinessProduct = function(service) {
			var data = {
				com_service_id: service.com_service_id
			};
			$state.go('businessProduct',data);
		}
		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};

	}
]);