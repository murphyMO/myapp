/**
 * 全部订单列表-控制器
 */
app.controller('MineOrdersListCtrl',
	['$scope', '$rootScope', 'MineOrdersService', '$state','$localStorage', '$ionicHistory','$CommonFactory', 
	function ($scope, $rootScope, MineOrdersService, $state,$localStorage, $ionicHistory, $CommonFactory) {
		$scope.accesstoken = $rootScope.getAccessToken();

		$scope.items = [];
		$scope.currentPage = 1; //第1页开始
		$scope.itemsPerPage = 10; //每页10条
		$scope.isRun = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
		$scope.isEmptyData = true; //控制加载更多是否显示
		$scope.isOverLoad = false;
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

		$scope.goMineorderdetail = function(item,index){
			$localStorage.setObject('mineOrderListItem',item);
			$localStorage.setObject('keyIndex', index);
			$state.go("mineorderdetail",{order_id:item.order_id})

		}
		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (fromState.name == "mineorderdetail") {
				var key = $localStorage.getObject('keyIndex')
				$scope.items[key] = $localStorage.getObject('mineOrderListItem');
			}
			else if (fromState.name == "tab.mine" || fromState.name == "confirmOrder") {
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
					"is_mine" : 1,
					"sortkey" : "cre_time",
					"sortstatus" : "desc"
				};
				$CommonFactory.showLoading();
				MineOrdersService.mineList(data,function(response){
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
//		$scope.getMineList();

		//跳转返回
		$scope.myBack = function(){
			// if ($state.params.from && $state.params.from == 'confirmOrder') {
			// 	alert($state.params.from)
			// 	$state.go('tab.business');
			// } else {
			// 	window.history.back();
				$state.go('tab.mine');
			// }
			// $ionicHistory.goBack();
		}
	}
]);