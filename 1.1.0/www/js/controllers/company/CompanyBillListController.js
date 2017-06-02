/**
 * 全部账单列表-控制器
 */
app.controller('CompanyBillListCtrl',
	['$scope', '$rootScope', 'CompanyBillService', '$state','$localStorage', '$CommonFactory', 
	function ($scope, $rootScope, CompanyBillService, $state,$localStorage, $CommonFactory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		console.log($scope.accesstoken)
		$scope.items = [];
		$scope.currentPage = 1; //第1页开始
		$scope.itemsPerPage = 10; //每页10条
		$scope.isRun = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
		$scope.isEmptyData = true; //控制加载更多是否显示
		$scope.isOverLoad = false;
		$scope.dateTo = '';
		$scope.dateFrom = '';

		
		/**
		 * 下拉刷新
		 */
		$scope.doRefresh = function(){
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.items = [];
			$scope.currentPage = 1;
			$scope.getMineList();
			$scope.$broadcast('scroll.refreshComplete');
		}

		$scope.goCompanyBilldetail = function(item,index){
			$localStorage.setObject('companyBillListItem',item);
			$localStorage.setObject('keyIndex', index);
			$state.go("companyBillDetail",{order_id:item.order_id})

		}
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (fromState.name == "companybilldetail") {
				var key = $localStorage.getObject('keyIndex')
				$scope.items[key] = $localStorage.getObject('companyBillListItem');
			}
			else if (fromState.name == "tab.mine" || fromState.name == "confirmOrder" || fromState.name == "balanceList" || fromState.name == "tab.business") {
				$scope.accesstoken = $rootScope.getAccessToken();
				if (fromState.name == "balanceList") {
					$scope.yearMonth = $state.params.data.time
					if ($scope.yearMonth) {
						$scope.yearMonthAry = $scope.yearMonth.split("-")
						//根据月份获得天数
						$scope.dateTo =$scope.yearMonth +"-"+ new Date($scope.yearMonthAry[0], $scope.yearMonthAry[1], 0).getDate();
						$scope.dateFrom =$scope.yearMonth +"-"+ 1;
					}
				}
				else{
					$scope.dateTo = '';
					$scope.dateFrom = '';
				}
				$scope.doRefresh();
			}
		});
		
		/**
		 * 加载更多
		 */
		$scope.loadMore = function(){
			$scope.getMineList();
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};

		//订单列表
		$scope.getMineList = function(){
			if (!$scope.isRun) {
				$scope.isRun = true;
				var data = {
					"accesstoken" : $scope.accesstoken,
					"currentPage" : $scope.currentPage,
					"itemsPerPage" : $scope.itemsPerPage,
					"sortkey" : "cre_time",
					"sortstatus" : "desc",
					"date_from" : $scope.dateFrom,
					"date_to" : $scope.dateTo,
					"is_all" : 1
				};
				$CommonFactory.showLoading();
				CompanyBillService.mineList(data,function(response){
					$CommonFactory.hideLoading();
					$scope.isRun = false;

					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.list.length == 0) {
						$scope.isEmptyData = false;
						$scope.isOverLoad = true;
						return;
					}
					$scope.items = $scope.items.concat(response.data.list);
					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.data.page_info;
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
//		$scope.getMineList();

		//跳转返回
		$scope.myBack = function(){
			// if ($state.params.from && $state.params.from == 'confirmOrder') {
			// 	alert($state.params.from)
			// 	$state.go('tab.business');
			// } else {
			// 	window.history.back();
				$state.go("tab.mine",{thisItem:1});
			// }
		}
	}
]);