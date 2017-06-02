//公司动态列表
app.controller('CompanyActiveListCtrl',
	['$scope', '$window', '$rootScope', '$timeout', '$stateParams', '$state', '$localStorage', 'CompanySummaryService',
		function ($scope, $window, $rootScope, $timeout, $stateParams, $state, $localStorage, CompanySummaryService) {

			var accesstoken = $rootScope.getAccessToken();
			var current_user = $rootScope.getCurrentUser();
			var com_id = $stateParams.com_id;
			//$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
			$scope.path = $localStorage.getObject(KEY_COMMON_PATH);

			var timeout = null;//搜索延迟
			$scope.currentPage = 1;//第一页
			$scope.itemsPerPage = 5;//每页5条
			// $scope.isEmptyData = false;//控制加载更多
			// $scope.isOverLoad = false;//控制没有数据的时候显示
			$scope.items = [];
			$scope.activeSearch = {
			"keyword" : ""
			}

			//获取企业动态列表
			$scope.getCompanyTrendsList = function(){
				var data = {
					"accesstoken" : accesstoken,
					"keyword": $scope.activeSearch.keyword,
					"type":'2',
					'com_id' : com_id,
					'currentPage': $scope.currentPage,
					'itemsPerPage': $scope.itemsPerPage
				}
				CompanySummaryService. getCompanyTrendsList(data,function(response){
					//$scope.items = response.data;
					// 请求失败或者没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = true;
						$scope.isOverLoad = true;
						return;
					}
					//有数据
					if(response.statuscode == CODE_SUCCESS){
						for(var i = 0,len = response.data.length; i< len; i++){
							$scope.items.push(response.data[i]);
						}
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

			/*$scope.showPic = function(i){
				$("#showPic").modal("show");
				$scope.isrc=$scope.attach_path+ i;
			}*/

			//页面返回按钮
			$scope.back = function(){
				$state.go('commsg',({com_id:com_id}));
			}

			//下拉刷新
			$scope.demandDoRefresh = function(){
				$scope.isEmptyData = false;
				$scope.isOverLoad = false;
				$scope.currentPage = 1; //当前第一页
				$scope.items = [];
				$scope.getCompanyTrendsList();
				$scope.$broadcast('scroll.refreshComplete');
			}
			if ($state.params.refresh == 'demand') {
			$scope.demandDoRefresh();
		}
			//搜索
			$scope.$watch("activeSearch",function(newVal,oldVal){
				if (newVal != oldVal) {
					if (timeout) {
						$timeout.cancel(timeout);
					};
					timeout = $timeout(function(){
						$scope.isEmptyData = false;
						$scope.isOverLoad = false;
						$scope.currentPage = 1; //当前第一页
						$scope.items = [];
						$scope.getCompanyTrendsList();
					},500)
				};
			},true)

		}]);


		document.addEventListener("backbutton", onBackKeyDown, false );
		function onBackKeyDown() {
			//匹配当前页面
			if ( $state.current.name == 'chat') {
				//返回事件
				$("#showPic").modal("hide");
				$scope.back();
			} else {
				//window.history.back();
			}
		}

		$scope.showPic = function(i){
			$("#showPic").modal("show");
			$scope.isrc=$scope.messagePath+ i;
		}