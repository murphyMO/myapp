//进入企业-需求列表
app.controller('CompanyNeedListCtrl',
	['$scope', '$window', '$rootScope', '$timeout', '$stateParams', '$localStorage', '$state', 'CompanySummaryService',
		function ($scope, $window, $rootScope, $timeout, $stateParams, $localStorage, $state, CompanySummaryService) {

			$scope.accesstoken = $rootScope.getAccessToken();
			var current_user = $rootScope.getCurrentUser();
			//$scope.services = [];
			var com_id = $stateParams.com_id;
			$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
			var com_id = $stateParams.com_id;
			$scope.path = $localStorage.getObject(KEY_COMMON_PATH);
			//$scope.userPath = $localStorage.getObject(KEY_COMMON_PATH).photo_path ;
			//$scope.messagePath = $localStorage.getObject(KEY_COMMON_PATH).article_photo_path ;

			var timeout = null; //搜索延迟
			$scope.currentPage = 1; //第1页开始
			$scope.itemsPerPage = 10; //每页10条
			$scope.itemTotal = 0; //总条数
			$scope.isEmptyData = false; //控制加载更多
			$scope.isOverLoad = false; //控制没有数据的时候显示
			$scope.items = [];

			//搜索
			$scope.needSearch = {
			"keyword" : ""
			}
			$scope.$watch("needSearch",function(newVal,oldVal){
				if (newVal != oldVal) {
					if (timeout) {
						$timeout.cancel(timeout);
					};
					timeout = $timeout(function(){
						$scope.isEmptyData = false;
						$scope.isOverLoad = false;
						$scope.currentPage = 1; //当前第一页
						$scope.items = [];
						$scope.getCompanyNeedList();
					},500)
				};
			},true)

			$scope.getCompanyNeedList = function(){
				var data = {
					'accesstoken':$scope.accesstoken,
					'type': "1",
					'com_id': com_id,
					"article_type_id" : 1,
					"currentPage": $scope.currentPage,
					"itemsPerPage": $scope.itemsPerPage,
					"keyword": $scope.needSearch.keyword,
				};
				CompanySummaryService. getComNeed(data,function(response){
					console.log(response);
					//$scope.items = response.data;
					// 请求失败或者没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = true;
						$scope.isOverLoad = true;
						return;
					}
					for (var i = 0, len = response.data.length; i < len; i++) {
						$scope.items.push(response.data[i]);
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



/*			$scope.showPic = function(i){
				$("#showPic").modal("show");
				$scope.isrc=$scope.messagePath+ i;
			}*/

			/*//引文详情
			$scope.materialDetail = function(item) {
				$state.go("app.materialDetail", {material_id: item.com_article_material_id});
			}*/

			//下拉刷新
			$scope.demandDoRefresh = function(){
				$scope.isEmptyData = false;
				$scope.isOverLoad = false;
				$scope.currentPage = 1; //当前第一页
				$scope.items = [];
				$scope.getCompanyNeedList();
				$scope.$broadcast('scroll.refreshComplete');
			}


			//页面返回按钮
			$scope.myBack = function(){

				$state.go('commsg',({com_id:com_id}));

			}


		}]);