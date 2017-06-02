/**
 * 服务控制器
 */
app.controller('ServiceCtrl',
	['$scope', 'ServiceService',
	function ($scope, ServiceService) {
		$scope.serviceList = [];
		
		$scope.getChatList = function(){
			var data = {
				'accesstoken': ''
			}
			ServiceService.getServiceList(data,function(response){
				if(response.statuscode == 1){
					$scope.serviceList = response.data;
				}
			});
		};
		
		$scope.getChatList();
		
		//下拉刷新
		$scope.doRefresh = function() {
			$http.get('/new-items')
			.success(function(newItems) {
				$scope.items = newItems;
			 })
			 .finally(function() {
			   // 停止广播ion-refresher
			   $scope.$broadcast('scroll.refreshComplete');
			 });
		  };

		$scope.remove = function(chat) {
			console.log("删除成功");
		};

	}
]);