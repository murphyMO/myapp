/**
 * 企业搜索列表控制器
 */
app.controller('CompanySearchListCtrl',
	['$scope', '$rootScope', '$state','$stateParams', 'BusinessService', '$localStorage', '$timeout', '$CommonFactory','$ionicScrollDelegate',
	function ($scope, $rootScope, $state,$stateParams, BusinessService, $localStorage, $timeout, $CommonFactory,$ionicScrollDelegate) {

		$scope.accesstoken = $rootScope.getAccessToken();
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//企业logo地址
		$scope.logoPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;
		//第一页
		$scope.currentPage = 1;
		//每页10条
		$scope.itemsPerPage = 10;
		var hasMore = true;
		$scope.itemTotal = 0;
		$scope.isEmptyData = false; //控制加载更多
		$scope.isOverLoad = false; //控制没有数据的时候显示
		$scope.companyList = [];
		$scope.filterOptions = ""; //搜索参数
		if ($state.params.data && $state.params.data.keyword) {
			$scope.filterOptions = $state.params.data.keyword;
		}
		var timeout = null; //搜索延迟

		//获取企业列表
		$scope.getCompanyDatas = function(){
			if (hasMore) {
				var data = {
					accesstoken : $scope.accesstoken,
					currentPage : $scope.currentPage,
					itemsPerPage : $scope.itemsPerPage,
					keyword : $scope.filterOptions
				}
				$CommonFactory.showLoading();
				BusinessService.getCompanyDatas(data, function(response){
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
						$scope.companyList.push(tmpData[i]);
					}
					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.page_info;
					if ($scope.currentPage * $scope.itemsPerPage >= $scope.itemTotal) {
						$scope.isEmptyData = true;
						hasMore =false;
					} else {
						$scope.currentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						hasMore =true;
					}
				});
			}
		};

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};

		//下拉刷新
		$scope.demandDoRefresh = function(){
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.currentPage = 1; //当前第一页
			$scope.companyList = [];
			hasMore = true;
			$scope.getCompanyDatas();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}

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
					$scope.companyList = [];
					hasMore = true;
					$scope.getCompanyDatas();
					hasMore = false;
				}, 500);
			}
		}, true);
		//跳转返回
		$scope.jump=function(){
			$scope.filterOptions = '';
		}
		//跳转到企业界面
		$scope.toCompanyPage = function(item) {
			var data = {
				com_id : item.com_id,
				from : "companysearchlist",
				data : {"keyword" : $scope.filterOptions}
			};
			$state.go('commsg', data);
		}
	}
]);
