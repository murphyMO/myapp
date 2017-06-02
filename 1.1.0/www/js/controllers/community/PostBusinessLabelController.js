/**
 * 发布类型列表控制器
 */
app.controller('PostBusinessLabelCtrl',
	['$rootScope', '$scope', '$ionicHistory','$state', '$CommonFactory', 'CommunityService', 'TransferPostDataService', 
	function ($rootScope, $scope, $ionicHistory, $state, $CommonFactory, CommunityService, TransferPostDataService) {
		$scope.myGoBack = function() {
			//$ionicHistory.goBack();
			window.history.back();
		};

		//$scope.businessLabelList = [];
		var accesstoken = $rootScope.getAccessToken();
		$scope.getBusinessLabelList = function(){
			var data = {
				"accesstoken" : accesstoken
			};
			$CommonFactory.showLoading();
			CommunityService.getBusinessLabel(data, function(res){
				$CommonFactory.hideLoading();
				if(res.statuscode == CODE_SUCCESS){
					$scope.businessLabelList = res.data;
					var article = TransferPostDataService.getArticle();
					if(article && $scope.businessLabelList){
						var businessLabelIds = article.businessLabelIds;
						if(businessLabelIds){
							var lengthi = businessLabelIds.length;
							var lengthj = $scope.businessLabelList.length;

							for (var i = 0; i < lengthi; i++) {
								for (var j = 0; j < lengthj; j++) {
									if(businessLabelIds[i] == $scope.businessLabelList[j].service_tag_info_id){
										 $scope.businessLabelList[j].checked = true;
									}
								}
							}
						}
					}
				}else{
					$CommonFactory.showAlert('系统错误');
				}
			});
		};

		$scope.getBusinessLabelList();

		$scope.confirmSelectBusinessLabel = function(){

			$scope.businesslabels = [];
			$scope.businessLabelIds = [];

			var length = $scope.businessLabelList.length;

			for (var i = 0; i < length; i++) {
				if($scope.businessLabelList[i].checked){
					var item = {};
					item.business_label_id = $scope.businessLabelList[i].service_tag_info_id;
					item.business_label_des = $scope.businessLabelList[i].service_tag_name;
					$scope.businesslabels.push(item);
					$scope.businessLabelIds.push(item.business_label_id);
				}
			}

			var article = TransferPostDataService.getArticle();
			if(!article){
				article = {};
			}
			
			article.businesslabels = $scope.businesslabels;
			article.businessLabelIds = $scope.businessLabelIds;

			TransferPostDataService.setArticle(article);
			if(article){
				switch (article.post_type) {
					case 'needs' :
						$state.go("postneed");
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
						$state.go('postservice');
						break;
					default : 
						$state.go("postneed");
						break;
				}
			}else {
				$state.go("postneed");
			}
			
			
		};
}]);