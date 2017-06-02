/**
 * 发布类型列表控制器
 */
app.controller('DeliverProductListCtrl',
	['$rootScope', '$scope', '$ionicHistory', '$localStorage', '$state', '$CommonFactory', 'TransferPostDataService', 'CommunityService',
	function ($rootScope, $scope, $ionicHistory, $localStorage, $state, $CommonFactory, TransferPostDataService, CommunityService) {

		$scope.itemsPerPage = 10; //每页10条
		$scope.currentPage = 1; 
		$scope.itemTotal = 0;
		$scope.isEmptyData = false;
		$scope.productList = [];

		var accesstoken = $rootScope.getAccessToken();
		//$scope.selectedMaterialId = $state.params.material_id;
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		console.log($scope.commonPath);
		var deliveredProduct = TransferPostDataService.getDeliveredProduct();
		console.log(deliveredProduct);
		if(!deliveredProduct){
			deliveredProduct = {};
		}
		var com_needs_id = deliveredProduct.com_needs_id;
		//页面返回事件
		$scope.myGoBack = function() {
			$state.go('deliverproduct',{com_needs_id:com_needs_id});
		};

		var user = $rootScope.getCurrentUser();
		console.log(user);
		//获取产品列表
		$scope.getProductList = function(){
			var data = {
				"accesstoken" : accesstoken,
				"com_id" : user.com_id,
				"currentPage" : $scope.currentPage,
				"itemsPerPage" : $scope.itemsPerPage
			};
			$CommonFactory.showLoading();
			CommunityService.getProductListByComId(data, function(res){
				$CommonFactory.hideLoading();
				//没有数据
				if (res.statuscode != CODE_SUCCESS || res.data.length == 0) {
					$scope.isEmptyData = false;
					return;
				}
				//有数据
				var tmpData = res.data;
				for (var i = 0, len = tmpData.length; i < len; i++) {
					$scope.productList.push(tmpData[i]);
				}
				angular.forEach($scope.productList, function(item){
					if(item.com_service_thumb && item.com_service_thumb.length > 0){
						item.display_thumb =  item.com_service_thumb[0];
					}
					if (typeof(deliveredProduct.product) != "undefined") {
						if (item.com_service_id == deliveredProduct.product.com_service_id) {
							item.checked = true;
						} else {
							item.checked = false;
						}
					}
					
				});

				//判断总数，防止无线滚动加载
				$scope.itemTotal = res.page_info;
				if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
					$scope.isEmptyData = true;
				} else {
					$scope.currentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			});
		};

		$scope.confirmSelectProduct = function(){
			delete deliveredProduct.product;
			angular.forEach($scope.productList, function(item){
				if(item.checked){
					//$scope.selectedMaterialId = item.com_article_material_id;
					deliveredProduct.product = item;
				}
			});
			TransferPostDataService.setDeliveredProduct(deliveredProduct);
			$state.go('deliverproduct',{'com_needs_id':com_needs_id});
		};

		$scope.updateSelection = function(position, items){
			angular.forEach(items, function(subscription, index) {
				if (position != index)
					subscription.checked = false;
				}
			);
		};

		//下拉刷新
		$scope.doRefresh = function(){
			$scope.productList = [];
			$scope.currentPage = 1;
			$scope.getProductList();
			$scope.$broadcast('scroll.refreshComplete');
		}
}]);