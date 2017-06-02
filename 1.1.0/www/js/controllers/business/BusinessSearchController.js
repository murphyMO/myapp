/**
 * 搜索控制器
 */
app.controller('BusinessSearchCtrl',
	['$scope', '$rootScope', '$state', 'BusinessService', '$localStorage', '$ionicSlideBoxDelegate', '$timeout',
	function ($scope, $rootScope, $state, BusinessService, $localStorage, $ionicSlideBoxDelegate, $timeout) {
		$scope.accesstoken = $rootScope.getAccessToken();
		//默认搜索类型选项列表隐藏
		$scope.searchBodyShow = false;
		//设置默认搜索类型
		$scope.search = {"search_type_id":4,"search_type_text":"活动"};
		//设置搜索类型
		$scope.searchType = [
			{"search_type_id":1,"search_type_text":"服务"},
			// {"search_type_id":2,"search_type_text":"企业"},
			// {"search_type_id":3,"search_type_text":"需求"},
			{"search_type_id":4,"search_type_text":"活动"},
		];
		$scope.searchTypeText = '';

		$scope.goSearchList = function (keyword) {
			if ($scope.search.search_type_id == 1) {
				$localStorage.SearchListKeyword = keyword;
				$localStorage.SearchPage = 1;
				$state.go("businessallposts");
			} else if ($scope.search.search_type_id == 3){
				$localStorage.SearchNeedKeyword = keyword;
				$localStorage.SearchPage = 2;
				$state.go("businessallposts");
			} else if ($scope.search.search_type_id == 4){
				// var data = {
				// 	"keyword" : keyword,
				// 	"search_type" : $scope.search_type_id
				// };
				$localStorage.SearchActivityKeyword = keyword;
				$localStorage.SearchPage = 1;
				// $state.go("businessallposts",{data : data});
				$state.go("businessallposts");
			}
			$scope.getSearchHistory();
		};

		// 获取最近搜索
		$scope.getSearchHistory = function () {
			var data = {
				accesstoken: $scope.accesstoken,
				keyword: $scope.filterOptions,
			};
			BusinessService.searchHistory(data, function (response) {
				$scope.history = response.data;
			});
		};
		$scope.getSearchHistory();

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
		//判断设备是IOS还是Android
		if (ionic.Platform.isIOS()) {
			$scope.device = "ios";
		}
		if (ionic.Platform.isAndroid()) {
			$scope.device = "android";
		}

	}
]);
