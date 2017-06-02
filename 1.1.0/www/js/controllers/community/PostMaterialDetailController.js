/**
 * 发布类型列表控制器
 */
app.controller('PostMaterialDetailCtrl',
	['$rootScope', '$scope', '$ionicHistory', '$localStorage', '$state', '$CommonFactory', 'CommunityService','TransferPostDataService',
	function ($rootScope, $scope, $ionicHistory, $localStorage, $state, $CommonFactory, CommunityService, TransferPostDataService) {
		$scope.myGoBack = function() {
			var article = TransferPostDataService.getArticle();
			if($state.params.from){
				$state.go($state.params.from);
			}else{
				if(article){
					switch (article.post_type) {
						case 'needs' :
							$state.go('postmateriallist',{type:1});
							break;
						case 'product' :
							$state.go('postmateriallist',{type:2});
							break;
						case 'activity' :
							$state.go('postmateriallist',{type:6});
							break;
						case 'person_intr' :
							$state.go('postmateriallist',{type:4});
							break;
						case 'company_intr' :
							$state.go('postmateriallist',{type:3});
							break;
						default : 
							$state.go("postneeds");
							break;
					}
				}else{
					$ionicHistory.goBack(); 
				}
			}
		};
		
		var accesstoken = $rootScope.getAccessToken();
		$scope.getMaterialDetail = function(){
			var data = {
				"accesstoken" : accesstoken,
				"id" : $state.params.id
			};
			$CommonFactory.showLoading();
			CommunityService.getMaterialDetail(data, function(res){
				$CommonFactory.hideLoading();
				if(res.statuscode == CODE_SUCCESS){
					$scope.hasMaterial = true;
					$scope.material = res.data;
				} else {
					$scope.hasMaterial = false;
				}
			});
		};

		$scope.getMaterialDetail();
}]);