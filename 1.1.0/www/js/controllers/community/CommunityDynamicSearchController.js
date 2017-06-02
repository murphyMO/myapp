/**
 * 搜索控制器
 */
app.controller('CommunityDynamicSearchCtrl',
	['$scope', 'CommunityService','$localStorage','$state',
	function ($scope, CommunityService,$localStorage,$state) {
		var accesstoken = $localStorage.get("accesstoken");
		//此事件对应的是pager-click属性，当显示图片是有对应数量的小圆点，这是小圆点的点击事件
		$scope.pageClick = function(index){
			console.log(index);
			//alert(index);
			//$scope.model.activeIndex = 2;
		};
		

		$scope.dynamicSendSerch = function(){
			$localStorage.set("dynamicSearchKey",$scope.dynamicSerchInput)
			$state.go("tab.communitydynamic");
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
//		
//		$scope.serviceList = [];
//		
//		$scope.getChatList = function(){
//			var data = {
//				'accesstoken': ''
//			}
//			BusinessService.getServiceList(data,function(response){
//				if(response.statuscode == 1){
//					for (var i = 0, len = response.data.length; i < len; i++) {
//						$scope.serviceList.push(response.data[i]);
//					}
//				}
//			});
//		};
//		
//		$scope.getChatList();
//		
//		//下拉刷新
//		$scope.doRefresh = function() {
//			$http.get('/new-items')
//			.success(function(newItems) {
//				$scope.items = newItems;
//			 })
//			 .finally(function() {
//			   // 停止广播ion-refresher
//			   $scope.$broadcast('scroll.refreshComplete');
//			 });
//		  };
//
//		$scope.remove = function(chat) {
//			console.log("删除成功");
//		};
//
//		//底部加载更多
//		$scope.$on('stateChangeSuccess', function() {
//			$scope.getChatList();
//		});
	}
]);