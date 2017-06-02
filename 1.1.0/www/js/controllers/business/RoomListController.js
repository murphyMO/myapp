/**
 * 区分办公室/位----灵活办公----定制办公控制器
 */
app.controller('RoomListController',
	['$scope', '$rootScope', '$state', '$localStorage','BusinessService','$ionicScrollDelegate','$CommonFactory','rongCloudService','$ionicHistory',
	function ($scope, $rootScope, $state, $localStorage,BusinessService,$ionicScrollDelegate,$CommonFactory,rongCloudService,$ionicHistory) {
		var accesstoken = $rootScope.getAccessToken();
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//第一页
		$scope.currentPage = 1;
		//每页10条
		$scope.itemsPerPage = 10;
		$scope.selectedCity = "全国";
		var hasMore = true;
		$scope.items = [];
		$scope.thisRoute = $state.current.name;
		//当前岛
		$scope.currentStoreId = $state.params.store_id;
		//com_service_type,区分办公室/位----灵活办公----定制办公
		$rootScope.com_service_name = $state.params.com_service_name;
		var switchComServiceName = function(){
			switch ($rootScope.com_service_name) {
			case '办公室/位':
				return '89';
			case '灵活办公':
				return '200';
			case '定制办公':
				return '92';
			default:
				return '89';
			}
		}
		$scope.com_service_type = switchComServiceName();

		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//服务缩略图地址
		$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.service_thumb_path;
		//当前城市
		$scope.currentCity = '-1';
		$scope.isOverLoad = false;
		$scope.isEmptyData = false;

		//获取城市、省份列表数据
		$scope.citys = $localStorage.getObject(KEY_ALL_CITY);

		//点击全部城市
		$scope.selectCity = function(city,index){
			$scope.priceIndex = 0;
			$scope.cityIndex = index;
			$scope.selectedCity = city.city_name;
			$scope.selectedCityId = city.city_official_code;
			$scope.allCity = false;
			//初始化分页数据
			hasMore = true;
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.currentPage = 1;
			$scope.items = [];
			$scope.getOfficeRoomList();
			hasMore = false;
		}

		//点击选择价格筛选
		$scope.priceSelect = function() {
			$scope.allCity = false;
			if ($scope.priceIndex == 0) {
				$scope.priceIndex = 1;
			} else if ($scope.priceIndex == 1){
				$scope.priceIndex = 2;
			} else {
				$scope.priceIndex = 0;
			}
			//初始化分页数据
			hasMore = true;
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.currentPage = 1;
			$scope.items = [];
			$scope.getOfficeRoomList();
			hasMore = false;
		}

		//获取数据列表
		$scope.getOfficeRoomList = function(){
			$CommonFactory.showLoading();
			if (hasMore) {
				var data = {
					accesstoken: accesstoken,
					currentPage: $scope.currentPage,
					itemsPerPage: $scope.itemsPerPage,
					com_service_type: $scope.com_service_type,
					city_official_code : $scope.selectedCityId,
					unit_value : $scope.priceIndex,
					latitude : $rootScope.locationInfo.latitude,
					longitude : $rootScope.locationInfo.longitude,
					store_id : $scope.currentStoreId
				}
				BusinessService.serviceDatas(data, function(response){
					$CommonFactory.hideLoading();
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = true;
						$scope.isOverLoad = true;
						return;
					}
					//有数据
					var tmpData = response.data;
					for (var i = 0, len = tmpData.length; i < len; i++) {
						//缩略图取第一张
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
						$scope.items.push(tmpData[i]);
						//console.log(tmpData[i]);
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
			$CommonFactory.hideLoading();
		};

		$scope.toChat = function(item){
			if (!item.store_id) {
				item.store_id = '-1';
			}
			var data = {
				'accesstoken' : accesstoken,
				'store_id' : item.store_id
			};
			rongCloudService.getServiceId(data, function(response){
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					xsm_info = response.data[0];
					var data = {
						chat_user_id : xsm_info.user_id,
						chat_user_name : xsm_info.user_name,
						service_id : item.com_service_id,
						user_role : 'B',
						is_xsm:  false,
						from : $state.current.name
					};
					$state.go('chat',{data: data});
				}
			});
		}

		$rootScope.reloadPosition();

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};

		//跳转返回
		$scope.topBack = function(){
			$ionicHistory.goBack();
		}
	}
]);
