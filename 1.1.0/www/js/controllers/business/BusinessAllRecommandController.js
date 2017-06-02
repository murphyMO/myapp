/**
 * 商务推荐控制钱
 */
app.controller('BusinessAllRecommandController',
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

			/*//设置搜索方式
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
			};*/

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
			//活动图片
			$scope.activityPath = $scope.commonPath.route_path + $scope.commonPath.party_path;


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

			//获取推荐列表
			$scope.getRecommendList = function() {
				var data = {
					accesstoken : $scope.accesstoken,
					latitude : latitude,
					longitude : longitude,
					store_id : $scope.currentStoreId != -1 ? $scope.currentStoreId : null,
				};
				$CommonFactory.showLoading();
				BusinessService.getRecommendDatas(data, function(res) {
					if(res.statuscode == CODE_SUCCESS) {
						var resData = res.data;
						//组装活动
						if (resData.party && resData.party.length > 0) {
							for (var i = 0; i < resData.party.length; i++) {
								var temp = {};
								temp.party_id = resData.party[i].party_id;
								temp.thumb = resData.party[i].party_thumb.length > 0 ? resData.party[i].party_thumb[0] : '';
								temp.title = resData.party[i].title;
								// temp.distance = (Math.round(resData.party[i].distance)/1000).toFixed(2) + 'km';
								temp.distance = $rootScope.handleDistance(resData.party[i].distance);
								temp.content = resData.party[i].content;
								var start_time_length_arr = resData.party[i].start_time.split(':');
								temp.start_time = start_time_length_arr.length > 0 ? start_time_length_arr[0] + ':' + start_time_length_arr[1] : '';
								temp.store_name = resData.party[i].store_name;
								temp.cre_time = $rootScope.showTime(resData.party[i].cre_time);
								temp.address = resData.party[i].address;

								if ((new Date(resData.party[i].start_time.replace(/\-/g, "/")).getTime() < Date.now()) && (new Date(resData.party[i].end_time.replace(/\-/g, "/")).getTime() > Date.now())) {
									temp.status_text = "进行中";
								}
								if (new Date(resData.party[i].start_time.replace(/\-/g, "/")).getTime() > Date.now()) {
									temp.status_text = "未开始";
									temp.color = "xkd-activity-not-start";
								}
								if (new Date(resData.party[i].end_time.replace(/\-/g, "/")).getTime() < Date.now()) {
									temp.status_text = "已结束";
									temp.color = "xkd-activity-end";
								}
								$scope.activityList.push(temp);
								
							}
						}
						//组装需求
						if (resData.need && resData.need.length > 0) {
							for (var i = 0; i < resData.need.length; i++) {
								var temp = {};
								temp.com_needs_name = resData.need[i].com_needs_name;
								temp.com_name = resData.need[i].com_name;
								temp.content = handleContent(resData.need[i].com_needs_des);
								temp.com_logo = resData.need[i].com_logo_path;
								temp.cre_time = $rootScope.showTime(resData.need[i].cre_time);
								temp.com_needs_id = resData.need[i].com_needs_id;
								$scope.needList.push(temp);
								
							}
						}
						//组装服务
						if (resData.service && resData.service.length > 0) {
							for (var i = 0; i < resData.service.length; i++) {
								var temp = {};
								var tempObj = resData.service[i];
								temp.com_service_name = tempObj.com_service_name;
								temp.com_name = tempObj.com_name;
								temp.store_name = tempObj.store_name;
								temp.thumb = tempObj.com_service_thumb.length > 0 ? tempObj.com_service_thumb[0] : '';
								temp.content = handleContent(tempObj.com_service_des);
								temp.cre_time = $rootScope.showTime(tempObj.cre_time);
								temp.com_service_id = tempObj.com_service_id;
								$scope.serviceList.push(temp);
							}
						}
						$CommonFactory.hideLoading();
					} else {
						$CommonFactory.hideLoading();
						$scope.noNeed = true;
						$scope.noActivity = true;
						$scope.noService = true;
					}

					$scope.$broadcast('scroll.refreshComplete');
				});
			};

			$scope.getRecommendList();
			//下拉刷新
			$scope.recommendDoRefresh = function() {
				$scope.activityList = [];
				$scope.needList = [];
				$scope.serviceList = [];
				$scope.getRecommendList();
			}

			function handleContent(text) {
				if (text.length > 120) {
					text = text.substr(0, 117) + '...';
				}
				return text;
			}

			//产品详情
			$scope.toBusinessProduct = function(serviceObj) {
				var data = {
					com_service_id: serviceObj.service.com_service_id,
					from: serviceObj.from,
					page: serviceObj.page
				};
				$state.go('businessProduct',data);
			};
			//推荐需求
			$scope.toBusinessNeeds = function(needObj) {
				var data = {
					com_needs_id: needObj.com_needs_id,
					from: needObj.from,
					page: needObj.page
				};
				$state.go('businessNeedsDetail',data);
			};			
			/*//生成侧边栏数据
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
			}*/
		}
]);
