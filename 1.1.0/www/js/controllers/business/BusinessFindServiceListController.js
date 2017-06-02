/**
 * 服务分类二级控制器 
 */
app.controller('BusinessServiceListCtrl',
	['$scope', '$rootScope', '$localStorage', 'BusinessService', '$stateParams', '$timeout', '$state', '$ionicHistory',
	function ($scope, $rootScope, $localStorage, BusinessService, $stateParams, $timeout, $state, $ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.type_id = $stateParams.type_id;
		$scope.appTitle = $stateParams.name;
		
		$scope.cityStoreList = [];
//		
//		console.log($scope.type_id);
//		if($scope.type_id == "B"){
//			$scope.appTitle = "办公室";
//		}
//		if($scope.type_id == "C"){
//			$scope.appTitle = "场地";
//		}
//		if($scope.type_id == "D"){
//			$scope.appTitle = "会议室";
//		}
//		if($scope.type_id == "A"){
//			$scope.appTitle = "服务";
//		}

		if($scope.type_id == "A"){
			$scope.appTitle = "办公室列表";
		}
		//当前岛
		$scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
		$scope.currentStoreId = $scope.currentCity.city_id;
		// console.log($scope.type_id);
		// console.log($scope.currentStoreId);
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

		//有没有搜索结果
		$scope.noResult = false;
		
		var timeout = null; //搜索延迟
		//单个产品
		$scope.serviceType = {};
		
		// //单个产品大类
		// $scope.getServiceTypeDatasOne = function(){
		// 	var data = {
		// 		accesstoken: $scope.accesstoken,
		// 		id: $scope.type_id
		// 	};
		// 	BusinessService.serviceTypeDatasOne(data, function(response){
		// 		if (response.statuscode == CODE_SUCCESS) {
		// 			$scope.serviceType = response.data;
		// 		}
		// 	});
		// };
		
		// $scope.getServiceTypeDatasOne();
		
		//岛平方
		/*$scope.getStoreDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
			}
			BusinessService.storeDatas(data, function(response){
				
				if (response.statuscode == CODE_SUCCESS) {
					$scope.cityStoreList = response.data;
				}
			});
		};
		
		$scope.getStoreDatas();*/

		$scope.resultList = [{
			'title' : '标题',
			'content' : '内容',
			'thumb' : 'img/store4.jpg'
		}];
		
		//获取服务列表
		$scope.getServiceDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				currentPage: $scope.currentPage,
				itemsPerPage: $scope.itemsPerPage,
				store_id: $scope.currentStoreId,
				service_type: $scope.type_id,
				keyword: $scope.filterOptions
			}
			console.log(data)
			BusinessService.serviceDatas(data, function(response){
				console.log(response)
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.isEmptyData = false;
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
				} else {
					$scope.currentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			});
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
					$scope.getServiceDatas();
				}, 500);
			}
		}, true);
		
		
		//跳转列表
		$scope.toCountrylist = function(storeItem) {
			var paramsObj = {
				store_id : storeItem.store_id,
				type_id : $scope.type_id
			};
			
			$state.go("countrylist", paramsObj);
		}
		
		
		//返回
		$scope.topBack = function() {
			// ui-sref="businessFindServiceList({type_id:type_id})"
			
			//$state.go("businessService");
//			$state.go("tab.business");
			//$ionicHistory.goBack();
			window.history.back();
		}
	}
]);