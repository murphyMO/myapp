/**
 * 发布类型列表控制器
 */
app.controller('PostMaterialListCtrl',
	['$rootScope', '$scope', '$ionicHistory', '$localStorage', '$state', '$CommonFactory', 'CompanyService', 'TransferPostDataService', 'CommunityService',
	function ($rootScope, $scope, $ionicHistory, $localStorage, $state, $CommonFactory, CompanyService, TransferPostDataService, CommunityService) {
		$scope.myGoBack = function() {
			//$ionicHistory.goBack();
			var article = TransferPostDataService.getArticle();
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
					default : 
						$state.go("postneeds");
						break;
				}
			}else{
				$state.go("postneeds");
			}
		};
		// console.log($state.params.type);
		//$scope.businessLabelList = [];
		var accesstoken = $rootScope.getAccessToken();
		//accesstoken = '-awjSF8Xl5xuizEKOyNDSFJBYdelR7s585';
		$scope.selectedMaterialId = $state.params.material_id;
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		console.log($scope.commonPath);
		var article = TransferPostDataService.getArticle();
		if(!article){
			article = {};
		}
		$scope.getMaterialList = function(){
			var data = {
				"accesstoken" : accesstoken,
				"material_type" : $state.params.type
			};
			$CommonFactory.showLoading();
			CommunityService.getMaterialList(data, function(res){
				$CommonFactory.hideLoading();
				$scope.materialList = res.data;
				if(typeof(article.material) != "undefined"){
					angular.forEach($scope.materialList, function(item){
						if(item.com_article_material_id == article.material.material_id){
							item.checked = true;
						}else {
							item.checked = false;
						}
					});
				}
			});
		};

		$scope.getMaterialList();

		$scope.confirmSelectMaterial = function(){
			delete article.material;
			angular.forEach($scope.materialList, function(item){
				if(item.checked){
					$scope.selectedMaterialId = item.com_article_material_id;
					article.material = item;
					article.material.material_id = item.com_article_material_id;
				}
			});
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
					default : 
						$state.go("postneeds");
						break;
				}
			}else {
				$state.go("postneeds");
			}
		};

		$scope.updateSelection = function(position, items){
			angular.forEach(items, function(subscription, index) {
				if (position != index)
					subscription.checked = false;
				}
			);
		}
}]);