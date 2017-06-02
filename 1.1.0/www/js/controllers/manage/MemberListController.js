/**
 * 预订会议室控制器
 */
app.controller('MemberListCtrl',
	['$scope', '$rootScope','$ionicHistory','DeptService',
	function ($scope, $rootScope,$ionicHistory,DeptService) {
		$scope.accesstoken = $rootScope.getAccessToken();
		//路径对象
		$scope.user = $rootScope.getCurrentUser();

		//第一页
		$scope.currentPage = 1;
		//每页10条
		$scope.itemsPerPage = 5;
		$scope.isEmptyData = true;
		$scope.isRun = false;//模拟线程锁机制  防止多次请求 含义：是否正在请求。请注意，此处并非加入到了就绪队列，而是直接跳过不执行
		$scope.items = [];

		/**
		 * 加载更多
		 */
		$scope.loadMore = function(){
			$scope.getMemberList();
		};

		/**
		 * 会议室列表
		 */
		$scope.getMemberList = function(){
			if (!$scope.isRun) {
				$scope.isRun = true;
				var data = {
					accesstoken : $scope.accesstoken,
					// status : 0,
					currentPage : $scope.currentPage,
					itemsPerPage : $scope.itemsPerPage,
					com_id : $scope.user.com_id
				};
				DeptService.getMemberList(data,function(response){
					$scope.statistics = response;
					$scope.isRun = false;
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = false;
						return;
					}
					for(var i = 0;i < response.data.length;i++){
						switch (response.data[i].member_type){
							case "2":
								response.data[i].member_type_img="newappIcons-08.png";
								break;
							case "3":
								response.data[i].member_type_img="newappIcons-21.png";
								break;
							case "9":
								response.data[i].member_type_img="newappIcons-09.png";
								break;
						}
						$scope.items.push(response.data[i])
					}
					console.log($scope.items)
					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.total;
					if ($scope.currentPage * $scope.itemsPerPage >= $scope.itemTotal) {
						$scope.isEmptyData = false;
					} else {
						$scope.currentPage++;
						$scope.isEmptyData = true;
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}
				});
			}
		};


		//跳转返回
		$scope.topBack = function(){
			$ionicHistory.goBack();
		}
	}
]);
