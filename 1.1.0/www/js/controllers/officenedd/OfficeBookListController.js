/**
 * 入驻通知
 */
app.controller('OfficeBookListCtrl',
	['$scope', '$state', '$rootScope','$ionicHistory','OfficeBookService','$CommonFactory',
		function ($scope, $state, $rootScope,$ionicHistory,OfficeBookService,$CommonFactory) {
			// $scope.accesstoken = $rootScope.getAccessToken();
			// $scope.user = $rootScope.getCurrentUser();
			$scope.type = $state.params.type;
			switch($scope.type){
				case 1:
				// $state.go("entryNotice");
				$scope.checkinstatus = '0';
				break;
				case 2:
				// $state.go("entryLst");
				$scope.checkinstatus = '3';
				break;
				case 3:
				// $state.go("checkoutReg");
				break;
			}

		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.items = [];
		$scope.CheckOutRegListData = [];
		$scope.currentPage = 1; //第1页开始
		$scope.itemsPerPage = 10; //每页10条
		$scope.isRun = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
		$scope.isEmptyData = true; //控制加载更多是否显示
		$scope.isOverLoad = false;
		/**
		 * 下拉刷新
		 */
		$scope.doRefresh = function(){
			if ($scope.type == '1' || $scope.type == '2') {
				$scope.isEmptyData = false;
				$scope.isOverLoad = false;
				$scope.items = [];
				$scope.currentPage = 1;
				$scope.getOfficeBookList();
				$scope.$broadcast('scroll.refreshComplete');
			}
			else if ($scope.type == '3') {
				$scope.isEmptyData = false;
				$scope.isOverLoad = false;
				$scope.CheckOutRegListData = [];
				$scope.currentPage = 1;
				$scope.getCheckOutRegListData();
				$scope.$broadcast('scroll.refreshComplete');
			}

		}


		/**
		 * 加载更多
		 */
		$scope.loadMore = function(){
			if ($scope.type == '1' || $scope.type == '2') {
				$scope.getOfficeBookList();
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
			else if ($scope.type == '3') {
				$scope.getCheckOutRegListData();
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}
			
		};

		//列表
		$scope.getOfficeBookList = function(){
			if (!$scope.isRun) {
				$scope.isRun = true;
				var data = {
					"accesstoken" : $scope.accesstoken,
					"currentPage" : $scope.currentPage,
					"itemsPerPage" : $scope.itemsPerPage,
					"checkinstatus" : $scope.checkinstatus
				};
				$CommonFactory.showLoading();
				OfficeBookService.getOfficeBookList(data,function(response){
					$CommonFactory.hideLoading();
					$scope.isRun = false;
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = false;
						$scope.isOverLoad = true;
						return;
					}
					$scope.items = $scope.items.concat(response.data);
					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.page_info;
					if ($scope.currentPage * $scope.itemsPerPage >= $scope.itemTotal) {
						$scope.isEmptyData = false;
					} else {
						$scope.currentPage++;
						$scope.isEmptyData = true;
						$scope.isOverLoad = false;
					}
				})
			}
		};
		$scope.goEntryNotice = function(id){
			$state.go("entryNotice",{id:id});
		}
		$scope.goEntryLst = function(id){
			$state.go("entryLst",{id:id});
		}

		//获取离店等级列表
		// $scope.getCheckOutRegListData = function(){
		// 	var data = {
		// 		'accesstoken': $scope.accesstoken,
		// 	}
		// 	OfficeBookService.getCheckOutRegListData(data,function(res){
		// 		if(res.statuscode == 1){
		// 			$scope.CheckOutRegListData = res.data;
		// 		}
		// 	})
		// }
		$scope.getCheckOutRegListData = function(){
			if (!$scope.isRun) {
				$scope.isRun = true;
				var data = {
					"accesstoken" : $scope.accesstoken
				};
				$CommonFactory.showLoading();
				OfficeBookService.getCheckOutRegListData(data,function(res){
					$CommonFactory.hideLoading();
					$scope.isRun = false;
					//没有数据
					if (res.statuscode != CODE_SUCCESS || res.data.length == 0) {
						$scope.isEmptyData = false;
						$scope.isOverLoad = true;
						return;
					}
					$scope.CheckOutRegListData = $scope.CheckOutRegListData.concat(res.data);
					//判断总数，防止无线滚动加载
					$scope.itemTotal = res.page_info;
					if ($scope.currentPage * $scope.itemsPerPage >= $scope.itemTotal) {
						$scope.isEmptyData = false;
					} else {
						$scope.currentPage++;
						$scope.isEmptyData = true;
						$scope.isOverLoad = false;
					}
				})
			}
		};
		$scope.back = function(){
			$ionicHistory.goBack();
		}
	}]);
