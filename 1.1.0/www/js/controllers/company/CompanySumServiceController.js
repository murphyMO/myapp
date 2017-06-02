//进入企业-企业服务列表 CompanySumServiceCtrl
app.controller('CompanySumServiceCtrl',
	['$scope', '$window','$stateParams', '$rootScope', '$localStorage', '$timeout', 'CompanySummaryService','$state',
		function ($scope, $window,$stateParams, $rootScope, $localStorage, $timeout, CompanySummaryService,$state) {
			$scope.replay_show = false;
			var com_id = $stateParams.com_id;
			$scope.currentPage = 1; //第1页开始
			$scope.itemsPerPage = 10; //每页10条
			$scope.itemTotal = 0; //总条数
			$scope.services = [];
			var timeout = null; //搜索延迟
			$scope.serviceSearch = {
			"keyword" : ""
			}

			$scope.accesstoken = $rootScope.getAccessToken();
			var current_user = $rootScope.getCurrentUser();
			var com_id = $stateParams.com_id;


			$scope.path = $localStorage.getObject(KEY_COMMON_PATH);
			//$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
			//$scope.userPath = $localStorage.getObject(KEY_COMMON_PATH).photo_path ;
			//$scope.messagePath = $localStorage.getObject(KEY_COMMON_PATH).article_photo_path ;


			$scope.searchInfo = {
				"accesstoken" : $scope.accesstoken,
				"type" : "2",
				"keyword" : ''

			};

			$scope.myComSevDatas = function(){
				var data = {
					'accesstoken':$scope.accesstoken,
					'type': "2",
					"keyword": $scope.serviceSearch.keyword,
					"currentPage": $scope.currentPage,
					"itemsPerPage": $scope.itemsPerPage,
					'com_id': com_id
				};
				CompanySummaryService.getComService(data,function(response){
					//$scope.services = response.data;

					// 请求失败或者没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = true;
						$scope.isOverLoad = true;
						return;
					}
					for (var i = 0, len = response.data.length; i < len; i++) {
						$scope.services.push(response.data[i]);
					}

					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.page_info;
					if ($scope.currentPage * $scope.itemsPerPage >= $scope.itemTotal) {
						$scope.isEmptyData = true;
					} else {
						$scope.currentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}
				})

				/*CompanySummaryService.getComSer(data,function(response){
					console.log(response);
					$scope.items = response.data.data;
					// 请求失败或者没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.totalItems = 0; //总数置为0
						$('#wyxScrollLoading').html('暂无相关数据');
						return;
					}
					for (var i = 0, len = response.data.length; i < len; i++) {
						$scope.services.push(response.data[i]);
					}
					$scope.totalItems = response.page_info;// 分页总数
					$scope.currentPage++;
				});*/
			};

			/*$scope.showPic = function(i){
				$("#showPic").modal("show");
				$scope.isrc=$scope.messagePath+ i;
			}*/

			//下拉刷新
			$scope.demandDoRefresh = function(){
				$scope.isEmptyData = false;
				$scope.isOverLoad = false;
				$scope.currentPage = 1; //当前第一页
				$scope.services = [];
				$scope.myComSevDatas();
				$scope.$broadcast('scroll.refreshComplete');
			}

			//搜索
			$scope.$watch("serviceSearch",function(newVal,oldVal){
				if (newVal != oldVal) {
					if (timeout) {
						$timeout.cancel(timeout);
					};
					timeout = $timeout(function(){
						$scope.isEmptyData = false;
						$scope.isOverLoad = false;
						$scope.currentPage = 1; //当前第一页
						$scope.services=[];
						$scope.myComSevDatas();
					},500)
				};
			},true)


			/*//引文详情
			$scope.materialDetail = function(item) {
				$state.go("app.materialDetail", {material_id: item.com_article_material_id});
			}*/
			//页面返回按钮
			$scope.back = function(){
				$state.go('commsg',({com_id:com_id}));
			}
		}]);