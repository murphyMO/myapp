/**
 * 我的订单-控制器
 */
app.controller('MineOrdersCtrl',
	['$scope', '$window','MineOrdersService', '$rootScope', '$state', '$stateParams','$ionicHistory',
		function ($scope, $window, MineOrdersService, $rootScope, $state, $stateParams,$ionicHistory) {
			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.SellOrder = {};
			$scope.BuyOrder = {};
			var detail_id = $stateParams.detail_id;
			//获取甲方订单列表
			$scope.getSellOrdersList = function(){
				var data = {
				"accesstoken" : $scope.accesstoken,
				"list_type":"reservationMine"
				}
				MineOrdersService.getOrdersList(data,function(response){
					if (response.statuscode == CODE_SUCCESS) {
					$scope.SellOrder = response.data;
					}
				})
			}
			$scope.getSellOrdersList();
			//获取乙方订单列表
			$scope.getBuyOrdersList = function(){
				var data = {
				"accesstoken" : $scope.accesstoken,
				"list_type":"mineReservation"
				}
				MineOrdersService.getOrdersList(data,function(response){
					if (response.statuscode == CODE_SUCCESS) {
					$scope.BuyOrder = response.data;
					}
				})
			}
			$scope.getBuyOrdersList();
			$scope.goToDetail = function(service_reservation_id){
				$state.go('ordersdetail',({detail_id:service_reservation_id}));
			}

			$scope.goBack = function(){
				$ionicHistory.goBack();
			}
}]);