/**
 * 发布类型列表控制器
 */
app.controller('DeliverProductCtrl',
	['$scope', '$rootScope', '$localStorage', '$ionicHistory','$state', '$CommonFactory', 'TransferPostDataService', 'CommunityService',
	function ($scope, $rootScope, $localStorage, $ionicHistory, $state, $CommonFactory, TransferPostDataService, CommunityService) {
		//返回方法 返回到需求列表
		$scope.myGoBack = function() {
			$state.go('tab.communitydynamic');
			TransferPostDataService.setDeliveredProduct(null);
			$scope.deliveredProduct = null;
		};
		var accesstoken = $rootScope.getAccessToken();
		var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		var imgPath = commonPath.route_path;

		//从共享数据服务中获取保存的投递商品页面数据
		$scope.deliveredProduct = TransferPostDataService.getDeliveredProduct();
		console.log($scope.deliveredProduct);
		if (!$scope.deliveredProduct) {
			$scope.deliveredProduct = {};
			//$scope.deliveredProduct.product = {};
		}
		if (!$scope.deliveredProduct.com_needs_id && $state.params.com_needs_id == null) {
			$CommonFactory.showConfirm(function(){
				$state.go('tab.communitydynamic');
			},'请选择一个需求进行投递');
		} else {
			$scope.deliveredProduct.com_needs_id = $state.params.com_needs_id;
		}

		//投递事件
		$scope.deliverProduct = function() {
			if (!$scope.deliveredProduct.product) {
				$CommonFactory.showAlert('请选择一个产品投递');
				return;
			}

			var data = {
				"accesstoken" : accesstoken,
				"com_needs_id" : $state.params.com_needs_id,
				"feedback_des" : $scope.deliveredProduct.comment,
				"feedback_service_id" : $scope.deliveredProduct.product.com_service_id

			};
			$CommonFactory.showLoading();
			CommunityService.deliverProduct(data, function(res) {
				$CommonFactory.hideLoading();
				if (res.statuscode == CODE_SUCCESS) {
					$state.go('tab.communitydynamic',{refresh:'demand'});
					TransferPostDataService.setDeliveredProduct(null);
					$scope.deliveredProduct = null;
				}
			});
		};
		//选择产品事件
		$scope.goSelectProduct = function() {
			TransferPostDataService.setDeliveredProduct($scope.deliveredProduct);
			$state.go('deliverproductlist');
		};
}]);
