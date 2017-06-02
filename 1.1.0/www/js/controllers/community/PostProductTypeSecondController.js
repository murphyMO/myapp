/**
 * 发布类型列表控制器
 */
app.controller('PostProductTypeSecondCtrl',
	['$rootScope', '$scope', '$ionicHistory','$state', 'CompanyService', 'TransferPostDataService', 
	function ($rootScope, $scope, $ionicHistory, $state, CompanyService, TransferPostDataService) {
		$scope.myGoBack = function() {
			$ionicHistory.goBack();
		};

		//$scope.businessLabelList = [];
		var accesstoken = $rootScope.getAccessToken();
		var allItem = [{'text':'全部','id':-1}];
		var item = $state.params.item;
		console.log(item);
		if(item.children && item.children.length > 0){
			$scope.subItems = allItem.concat(item.children);
		}
		$scope.confirmSelectProductType = function(thisItem) {
			console.log(thisItem);
			console.log(item);
			var article = TransferPostDataService.getArticle();
			if(!article){
				article = {};
			}
			article.productType = {};
			if(thisItem.id == '-1'){
				article.productType.id = item.id;
				article.productType.text = item.text+"-"+thisItem.text;
			}else {
				article.productType.id = thisItem.id;
				article.productType.text = thisItem.text;
			}
			TransferPostDataService.setArticle(article);
			$state.go('postproduct');
		};


		
}]);