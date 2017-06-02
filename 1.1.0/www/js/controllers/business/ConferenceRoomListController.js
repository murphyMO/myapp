/**
 * 预订会议室控制器
 */
app.controller('ConferenceRoomListController',
	['$scope', '$rootScope', '$state','$stateParams', '$localStorage','BusinessService','$ionicScrollDelegate','$CommonFactory',
	function ($scope, $rootScope, $state,$stateParams, $localStorage,BusinessService,$ionicScrollDelegate, $CommonFactory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		var user = $rootScope.getCurrentUser();
		$scope.user_id = user.id;

		//第一页
		$scope.currentPage = 1;
		//每页10条
		$scope.itemsPerPage = 5;
//		var hasMore = true;
		$scope.isEmptyData = true;
		$scope.isRun = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行

//		$scope.isOverLoad = false;
		$scope.items = [];

		$scope.selectedCity = "全国";
		$scope.selectedCityId = '';
		$scope.selectedStore = "所有岛";
		$scope.selectedStoreId = '';
		$scope.priceIndex = 0;//0-没有价格筛选，1-升序价格，2-降序价格
		$scope.sortstatus = "";

		$scope.sortkey = "distance";
		$scope.sortstatus = "ASC";
		$scope.currentStoreId = $state.params.store_id;


		//获取城市、省份列表数据
		$scope.citys = $localStorage.getObject(KEY_ALL_CITY);
		//获取所有岛
		$scope.stores = $localStorage.getObject(KEY_ALL_STORE);
		$scope.stores2 = $scope.stores;

		//点击全部城市
		$scope.selectCity = function(city,index){
			$scope.allCity = false;
			// 选择的城市跟之前没有变化，没有必要发起请求
			if (city.city_name == $scope.selectedCity) {
				return;
			}
			else{
				// 判断是否为全国，如果是，那么岛筛选应该包含全国的岛
				if (!city.city_official_code) {
					$scope.stores2 = $scope.stores;
				}
				// 如果不是，那么选择城市后，只需要列出本市的所有岛
				else{
					$scope.stores2 = [];
					$scope.stores2.push({
						store_name: '所有岛',
						store_id: '',
						city_id:''
					})
					for(var i = 0, len = $scope.stores.length; i < len; i++){
						if ($scope.stores[i].city_id == city.city_official_code) {
							$scope.stores2.push($scope.stores[i]);
						}
					}
				}
			}

			$scope.storeIndex = 0;
			$scope.selectedStore = '所有岛';
			$scope.currentStoreId = null;
			$scope.isEmptyData = false;
			$scope.priceIndex = 0;
			$scope.cityIndex = index;
			$scope.selectedCity = city.city_name;
			$scope.selectedCityId = city.city_official_code;
			
			//初始化分页数据
			$scope.currentPage = 1;
			$scope.items = [];
			$scope.getConferenceList();
		}

		//点击所有岛
		$scope.selectStore = function(store,index){
			$scope.isEmptyData = false;
			$scope.priceIndex = 0;
			$scope.storeIndex = index;
			$scope.selectedStore = store.store_name;
			$scope.currentStoreId = store.store_id;
			$scope.allStore = false;
			console.log($scope.allStore)
			//初始化分页数据
			$scope.currentPage = 1;
			$scope.items = [];
			$scope.getConferenceList();
		}

		//点击选择价格筛选
		$scope.priceSelect = function() {
			$scope.allCity = false;
			$scope.allStore = false;
			if ($scope.priceIndex == 0) {
				$scope.priceIndex = 1;
				$scope.sortstatus = "ASC";
				$scope.sortkey = "unit_price";
			} else if ($scope.priceIndex == 1){
				$scope.priceIndex = 2;
				$scope.sortstatus = "DESC";
				$scope.sortkey = "unit_price";
			} else {
				$scope.priceIndex = 0;
				$scope.sortstatus = "";
				$scope.sortkey = "distance";
				$scope.sortstatus = "ASC";
			}
			//初始化分页数据
//			hasMore = true;
			$scope.currentPage = 1;
			$scope.items = [];
			$scope.getConferenceList();
//			hasMore = false;
		}

		/**
		 * 加载更多
		 */
		$scope.loadMore = function(){
			$scope.getConferenceList();
		};

		/**
		 * 会议室列表
		 */
		$scope.getConferenceList = function(){
			if (!$scope.isRun) {
				$scope.isRun = true;

				var data = {
					accesstoken : $scope.accesstoken,
					room_type : 1,
					status : 0,
					currentPage : $scope.currentPage,
					itemsPerPage : $scope.itemsPerPage,
					lat : $rootScope.locationInfo.latitude,
					lon : $rootScope.locationInfo.longitude,
					sortkey : $scope.sortkey,
					sortstatus : $scope.sortstatus,
					city_official_code : $scope.selectedCityId,
					storeId : $scope.currentStoreId == -1 ? null : $scope.currentStoreId
					// store_id : $scope.selectedStoreId
				};
				BusinessService.getConferenceList(data,function(response){
					$scope.isRun = false;
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = false;
						return;
					}
					for(var i = 0;i < response.data.length;i++){
						if (response.data[i].distance != null) {
							if (response.data[i].distance > 1000) {
								response.data[i].distance = response.data[i].distance/1000;
								response.data[i].distance = response.data[i].distance.toFixed(2) + "km";
							}
							else{
								response.data[i].distance = parseInt(response.data[i].distance) + "m";
							}
						}
						response.data[i].url = [];
						for(var k = 0;k < response.data[i].room_photo.length;k++){
							response.data[i].url.push($scope.commonPath.route_path + $scope.commonPath.meeting_room_path + response.data[i].room_photo[k]);
						}
						$scope.items.push(response.data[i])
					}
					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.page_info;
					if ($scope.currentPage * $scope.itemsPerPage >= $scope.itemTotal) {
						$scope.isEmptyData = false;
					} else {
						$scope.currentPage++;
						$scope.isEmptyData = true;
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}
				});
			}
		};

		$scope.buy = function(i){
			if($rootScope.isGuest){
				$state.go("login");
				// $CommonFactory.showAlert("大侠您好，该功能需登录查看");
			}else{
			$localStorage.setObject("conference_item",i)
			$state.go("conferenceRoomBook")
			}
		}

		$scope.conferenceDetail = function(i,from){
			if($rootScope.isGuest){
				$state.go("login");
				// $CommonFactory.showAlert("大侠您好，该功能需登录查看");
			}else{
			$localStorage.setObject("conference_item",i);
			$state.go("conferenceRoomDetail",{'from': from});
			}
		}

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};
		//跳转返回
		$scope.topBack = function(){
			$state.go('tab.business');
		}
	}
]);
