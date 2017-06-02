/**
 * 商务控制器
 */
app.controller('BusinessAllPostsController',
	['$scope', '$rootScope', '$state', 'BusinessService', '$localStorage', '$ionicSlideBoxDelegate', '$timeout','$ionicScrollDelegate','$ionicPlatform','$CommonFactory',
	function ($scope, $rootScope, $state, BusinessService, $localStorage, $ionicSlideBoxDelegate, $timeout,$ionicScrollDelegate,$ionicPlatform,$CommonFactory) {

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
			
			$scope.accesstoken = $rootScope.getAccessToken();

			//首页全国推荐
			$scope.currentPage = 1;
			$scope.itemsPerPage = 4;
			//当前岛
			$scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
			if (!$scope.currentCity.city_name) {
				$scope.currentCity = {
					city_id: -1,
					city_name: "全国"
				}
			}
			//全国时为-1
			$scope.currentStoreId = $scope.currentCity.city_id;
			//设置apptitle
			if ($scope.currentStoreId == -1) {
				//全国
				$scope.appTitle = "全国发布";
			} else {
				//单岛
				$scope.appTitle = $scope.currentCity.city_name+"发布";
			}

			//设置搜索方式
			//默认搜索类型选项列表隐藏
			$scope.searchBodyShow = false;
			//设置默认搜索类型
			$scope.search = {"search_type_id":1,"search_type_text":"产品"};
			//设置搜索类型
			$scope.searchType = [
				{"search_type_id":1,"search_type_text":"产品"},
				{"search_type_id":2,"search_type_text":"企业"}
			];
			$scope.searchTypeText = '';

			//点击搜索类型列表，设置搜索类型方法
			$scope.setSelectSearch = function(item) {
				//设置搜索类型
				$scope.search = item;
				//隐藏搜索类型选项列表
				$scope.searchBodyShow = false;
			};
			//搜索类型label点击事件，切换搜索body隐藏显示
			$scope.switchDisplaySearchTypeList = function() {
				//切换搜索类型选项列表显示、隐藏
				$scope.searchBodyShow = !$scope.searchBodyShow;
			};

			//路径对象
			$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
			//轮播地址
			$scope.bannerPath = $scope.commonPath.route_path + $scope.commonPath.banner_photo_path;
			//合作伙伴
			$scope.partnerPath = $scope.commonPath.route_path + $scope.commonPath.partner_logo_path;
			//推荐企业
			$scope.companyPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;
			//服务缩略图地址
			$scope.serviceThumbPath = $scope.commonPath.route_path + $scope.commonPath.service_thumb_path;
			//岛单张图片
			$scope.introductionPath = $scope.commonPath.route_path + $scope.commonPath.storeBnnner_path;
			//店长图片
			$scope.peoplePath = $scope.commonPath.route_path + $scope.commonPath.buinour_photo_path;


			$scope.back = function() {
				window.history.back();
			}

			$scope.bannerList = [];
			$scope.serviceTypeList = [];
			$scope.recomCompanyList = [];
			$scope.serviceList = [];
			$scope.activityList = [];
			$scope.needList = [];
			$rootScope.showMore = false;
			$rootScope.showMoreTwo = true;
			$scope.partnerList= [];
			$scope.recCompany = true;//判断是否有推荐企业

			// 搜索
			$scope.searchClick = function() {
				$state.go("businessSearch");
			}

			//生成侧边栏数据
			$scope.leftBarList = [{
				'id' : 1,
				'text' : '今日推荐',
				'current' : 'current'
			},{
				'id' : 2,
				'text' : '活动',
				'current' : ''
			},{
				'id' : 3,
				'text' : '需求',
				'current' : ''
			},{
				'id' : 4,
				'text' : '服务',
				'current' : ''
			}];
			$scope.itemType = 1;
			//处理侧边栏点击事件
			$scope.displaySelectItem = function(item) {
				for (var i = 0 ; i < $scope.leftBarList.length ; i++) {
					$scope.leftBarList[i].current = '';
				}
				item.current = 'current';
				$scope.itemType= item.id;
				//$CommonFactory.showLoading();
			}

			//下拉刷新
			$scope.doRefresh = function() {
				console.log(123);
			}
		}
]);
