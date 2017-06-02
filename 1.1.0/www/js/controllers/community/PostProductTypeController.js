/**
 * 发布类型列表控制器
 */
app.controller('PostProductTypeCtrl',
	['$rootScope', '$scope', '$ionicHistory','$state', 'CommunityService', '$CommonFactory', 'TransferPostDataService','BusinessService', 
	function ($rootScope, $scope, $ionicHistory, $state, CommunityService, $CommonFactory, TransferPostDataService, BusinessService) {

		$scope.myGoBack = function() {
			window.history.back();
			//$ionicHistory.goBack();
			// var article = TransferPostDataService.getArticle();
			// if(article){
			// 	switch (article.post_type) {
			// 		case 'needs' :
			// 			$state.go("postneeds");
			// 			break;
			// 		case 'product' :
			// 			$state.go("postproduct");
			// 			break;
			// 		case 'activity' :
			// 			$state.go("postactivity");
			// 			break;
			// 		case 'person_intr' :
			// 			$state.go("postpersonintr");
			// 			break;
			// 		case 'company_intr' :
			// 			$state.go("postcompanyintr");
			// 			break;
			// 		case 'dynamic' :
			// 			$state.go("postdynamic");
			// 			break;
			// 		default : 
			// 			$state.go("postneeds");
			// 			break;
			// 	}
			// }else{
			// 	$state.go("postneeds");
			// }
		};
		var accesstoken = $rootScope.getAccessToken();
		$scope.getProductTypeList = function(){
			var data = {
				"accesstoken" : accesstoken,
				"store_id": -1,
				"id": 36
			};
			$CommonFactory.showLoading();
			CommunityService.getProductType(data, function(res){
				$scope.productTypeList = res.data;
				$CommonFactory.hideLoading();
			});
		};

		/*$scope.getProductTypeList = function(){
			var data = {
				"accesstoken" : accesstoken
			};
			$CommonFactory.showLoading();
			BusinessService.serviceTypeDatas(data, function(res){
				$scope.productTypeList = res.data;
				$CommonFactory.hideLoading();
			});
		};*/

		$scope.getProductTypeList();

		$scope.confirmSelectBusinessLabel = function(){

			$scope.businesslabels = [];
			$scope.businessLabelIds = [];

			var length = $scope.businessLabelList.length;

			for (var i = 0; i < length; i++) {
				if($scope.businessLabelList[i].checked){
					var item = {};
					item.business_label_id = $scope.businessLabelList[i].business_label_id;
					item.business_label_des = $scope.businessLabelList[i].business_label_des;
					$scope.businesslabels.push(item);
					$scope.businessLabelIds.push(item.business_label_id);
				}
			}

			var article = TransferPostDataService.getArticle();

			if(article){
				article.businesslabels = $scope.businesslabels;
				article.businessLabelIds = $scope.businessLabelIds;
			}

			TransferPostDataService.setArticle(article);
			if(article){
				switch (article.post_type) {
					case 'needs' :
						$state.go("postneeds");
						break;
					case 'product' :
						$state.go("postproduct");
						break;
					case 'activity' :
						$state.go("postactivity");
						break;
					case 'person_intr' :
						$state.go("postpersonintr");
						break;
					case 'company_intr' :
						$state.go("postcompanyintr");
						break;
					case 'dynamic' :
						$state.go("postdynamic");
						break;
					case 'service' :
						$state.go("postservice");
						break;
					default : 
						$state.go("postneed");
						break;
				}
			}else {
				$state.go("postneed");
			}
			
			
		};

		/*$scope.goSelectSecondLevelProductType = function (item) {
			$state.go('postprodcuttypesecond', {item:item});
		}*/

		$scope.confirmSelectProductType = function(thisItem) {
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
			$state.go('postservice');
		};
}]);