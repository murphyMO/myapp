/**
 * 企业未支付列表-控制器
 */
app.controller('CouponListCtrl',
	['$scope', '$rootScope', '$state','$localStorage', '$CommonFactory', '$ionicModal',"CompanyBillService",
	function ($scope, $rootScope, $state,$localStorage, $CommonFactory,$ionicModal,CompanyBillService) {
		$scope.accesstoken = $rootScope.getAccessToken();

		$scope.items = [];
		$scope.currentPage = 1; //第1页开始
		$scope.itemsPerPage = 10; //每页10条
		$scope.isRun = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
		$scope.isEmptyData = true; //控制加载更多是否显示
		$scope.isOverLoad = false;
		
		$scope.$on('$ionicView.beforeEnter',function (){
			$scope.coupon = $localStorage.getObject('coupon');
			$scope.conference = $scope.coupon.conference;
			$scope.stadium = $scope.coupon.stadium;
		})
		/**
		 * 下拉刷新
		 */
		$scope.doRefresh = function(){
			$scope.isEmptyData = false;
			$scope.isOverLoad = false;
			$scope.items = [];
			$scope.currentPage = 1;
			$scope.getCompanyCouponList();
			$scope.$broadcast('scroll.refreshComplete');
		}

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			if (fromState.name == "tab.mine") {
				$scope.doRefresh();
			}
		});
		
		/**
		 * 加载更多
		 */
		$scope.loadMore = function(){
			$scope.getCompanyCouponList();
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};

		//优惠券列表
		$scope.getCompanyCouponList = function(){
			if (!$scope.isRun) {
				$scope.isRun = true;
				var data = {
					"accesstoken" : $scope.accesstoken,
					"currentPage" : $scope.currentPage,
					"itemsPerPage" : $scope.itemsPerPage
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


		$scope.goMonthBillList = function(item){
			console.log(item)
			$state.go("companyBillList",{data:{time:item.time}})
		}

		$scope.goBillDetail = function(item){
			console.log(item)
			$state.go("companyBillDetail",{order_id:item.order_id})
		}

		//跳转返回
		$scope.myBack = function(){
			$state.go("tab.mine",{thisItem:1});
		}
	}
]);