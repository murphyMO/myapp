/**
 * 聊天发送产品列表
 */
app.controller('ChatProductCtrl',
	['$rootScope', '$scope', '$ionicHistory', '$localStorage', '$state', '$CommonFactory',  'TransferPostDataService', 'ContactService',
	function ($rootScope, $scope, $ionicHistory, $localStorage, $state, $CommonFactory, TransferPostDataService, ContactService) {

		var hasMore =true;
		var accesstoken = $rootScope.getAccessToken();
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$localStorage.removeItem(KEY_PRODUCT_DI);
		//每页数据量
		$scope.itemsPerPage = 9;
		//初始页数
		$scope.currentPage = 1;
		$scope.productList = [];

		$scope.getProductList = function(){
			if (hasMore) {
				var data = {
					"accesstoken" : accesstoken,
					"com_id" : $state.params.com_id,
					"currentPage" : $scope.currentPage,
					"itemsPerPage" : $scope.itemsPerPage
				};
				$CommonFactory.showLoading();
				ContactService.getProductList(data, function(response){
					$CommonFactory.hideLoading();
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.productIsEmptyData = true;
						$scope.productIsOverLoad = true;
						return;
					} else if(response.statuscode == CODE_SUCCESS){
						var temp = response.data.length;
						for(var j = 0; j<temp; j++){
							$scope.productList.push(response.data[j]);
						}
					}
					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.page_info;
					if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.productIsEmptyData = true;
						hasMore = false;
					} else {
						$scope.currentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
						hasMore = true;
					}
				});
			}
		};

		$scope.confirmSelectProduct = function(){
			var hasChecked = false;
			var selectedItem = null;
			angular.forEach($scope.productList, function(item){
				if(item.checked){
					$scope.selectedProductlId = item.com_article_material_id;
					hasChecked = true;
					selectedItem = item;
					// article.material = item;
					// article.material.material_id = item.com_article_material_id;
				}
				
			});
			if(!hasChecked){
				$CommonFactory.showAlert("请至少选择一个产品");
				return false;
			}
			$localStorage.set(KEY_PRODUCT_DI, JSON.stringify(selectedItem));
			$ionicHistory.goBack();
		};

		//点击
		$scope.updateSelection = function(position, items){
			angular.forEach(items, function(subscription, index) {
				if (position != index){
					subscription.checked = false;
				} else {
					subscription.checked = true;
				}
			});
		}

		$scope.myGoBack = function() {
			$localStorage.removeItem(KEY_PRODUCT_DI);
			$ionicHistory.goBack();
		};
}]);