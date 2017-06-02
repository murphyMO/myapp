/**
 * 首页搜索产品会议室控制器
 */
app.controller('businessSearchResultController',
	['$scope', '$rootScope', '$state','$stateParams', '$localStorage','BusinessService','$ionicScrollDelegate',
	function ($scope, $rootScope, $state,$stateParams, $localStorage,BusinessService,$ionicScrollDelegate) {
		$scope.accesstoken = $rootScope.getAccessToken();
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		var user = $rootScope.getCurrentUser();
		$scope.user_id = user.id;

		//第一页
		$scope.currentPage = 1;
		//每页10条
		$scope.itemsPerPage = 5;
		$scope.isEmptyData = true;
		$scope.isRun = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
		
		$scope.items = [];
		
		$scope.selectedCity = "全国";
		$scope.selectedCityId = '';
		$scope.priceIndex = 0;//0-没有价格筛选，1-升序价格，2-降序价格
		$scope.sortstatus = "";

		$scope.sortkey = "distance";
		$scope.sortstatus = "ASC";
		$scope.currentStoreId = $state.params.store_id;

		
		//获取城市、省份列表数据
		$scope.citys = $localStorage.getObject(KEY_ALL_CITY);

		$scope.addrAry = [
			{
				name1:"高新一区",
				checked:false,
				children:[
					{
						name2:"高新一区一街",
						checked:false
					},
					{
						name2:"高新一区二街",
						checked:false
					},
					{
						name2:"高新一区三街",
						checked:false
					},
					{
						name2:"高新一区四街",
						checked:false
					},
					{
						name2:"高新一区五街",
						checked:false
					}
				]
			},
			{
				name1:"高新二区",
				checked:false,
				children:[
					{
						name2:"高新二区一街",
						checked:false
					},
					{
						name2:"高新二区二街",
						checked:false
					},
					{
						name2:"高新二区三街",
						checked:false
					},
					{
						name2:"高新二区四街",
						checked:false
					},
					{
						name2:"高新二区五街",
						checked:false
					}
				]
			},
			{
				name1:"高新三区",
				checked:false,
				children:[
					{
						name2:"高新三区一街",
						checked:false
					},
					{
						name2:"高新三区二街",
						checked:false
					},
					{
						name2:"高新三区三街",
						checked:false
					},
					{
						name2:"高新三区四街",
						checked:false
					},
					{
						name2:"高新三区五街",
						checked:false
					}
				]
			},
			{
				name1:"高新四区",
				checked:false,
				children:[
					{
						name2:"高新四区一街",
						checked:false
					},
					{
						name2:"高新四区二街",
						checked:false
					},
					{
						name2:"高新四区三街",
						checked:false
					},
					{
						name2:"高新四区四街",
						checked:false
					},
					{
						name2:"高新四区五街",
						checked:false
					}
				]
			},
			{
				name1:"高新五区",
				checked:false,
				children:[
					{
						name2:"高新五区一街",
						checked:false
					},
					{
						name2:"高新五区二街",
						checked:false
					},
					{
						name2:"高新五区三街",
						checked:false
					},
					{
						name2:"高新五区四街",
						checked:false
					},
					{
						name2:"高新五区五街",
						checked:false
					}
				]
			},
			{
				name1:"高新六区",
				checked:false,
				children:[
					{
						name2:"高新六区一街",
						checked:false
					},
					{
						name2:"高新六区二街",
						checked:false
					},
					{
						name2:"高新六区三街",
						checked:false
					},
					{
						name2:"高新六区四街",
						checked:false
					},
					{
						name2:"高新六区五街",
						checked:false
					}
				]
			}
		]
		$scope.showChildren = function(i){
			$scope.childrenItem = i;
		}
		$scope.showChildren(0);
		//点击全部城市
		$scope.selectCity = function(city,index){
			$scope.isEmptyData = false;
			$scope.priceIndex = 0;
			$scope.cityIndex = index;
			$scope.selectedCity = city.city_name;
			$scope.selectedCityId = city.city_official_code;
			$scope.allCity = false;
			//初始化分页数据
			$scope.currentPage = 1;
			$scope.items = [];
			$scope.getConferenceList();
		}

		//点击选择价格筛选
		$scope.priceSelect = function() {
			$scope.allCity = false;
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
			$scope.currentPage = 1;
			$scope.items = [];
			$scope.getConferenceList();
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
			$localStorage.setObject("conference_item",i)
			$state.go("conferenceRoomBook")
		}

		$scope.conferenceDetail = function(i,from){
			$localStorage.setObject("conference_item",i);
			$state.go("conferenceRoomDetail",{'from': from});
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
