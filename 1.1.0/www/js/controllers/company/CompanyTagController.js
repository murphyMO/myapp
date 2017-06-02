/**
 * 企业行业标签控制器
 */
app.controller('CompanyTagCtrl', 
	['$scope', '$rootScope','$state','$CommonFactory','CompanyService','CommonService','$localStorage',
	function($scope, $rootScope,$state,$CommonFactory,CompanyService,CommonService,$localStorage){

		var accesstoken = $rootScope.getAccessToken();
		//获取所有行业标签，根据localstorage里面的所选的行业标签渲染
		$scope.getTagInfo=function(){
			var data={
				"accesstoken" : accesstoken
			}
			$CommonFactory.showLoading();
			var business_label = [];
			business_label = $localStorage.getObject("com_business_label_localstorage");
			//console.log(business_label);
			CompanyService.businessLabel(data,function(response){
				$CommonFactory.hideLoading();
				if (response.statuscode == CODE_SUCCESS) {
					$scope.tagInfo = response.data;
					for(var i=0;i<$scope.tagInfo.length;i++){
						for(var j=0;j<business_label.length;j++){
							if ($scope.tagInfo[i].business_label_id == business_label[j].business_label_id) {
								$scope.tagInfo[i].isSelect = true;
								break;
							}else{
								$scope.tagInfo[i].isSelect = false;
							}
						}
					}
				}

			});
		};
		$scope.getTagInfo();

		//选择标签方法
		$scope.selectTag = function(index){
			$scope.label = 0;

			for(i=0; i < $scope.tagInfo.length; i++){
				if ($scope.tagInfo[i].isSelect == true) {
					$scope.label++;
				}
			}
			
			if($scope.label > 6){
				$scope.tagInfo[index].isSelect = false;
				$CommonFactory.showAlert("选择行业标签不能超过6个!");
				return;
			}
			console.log($scope.tagInfo[index].isSelect);
		};

		//确认选择行业标签，数据保存到localStorage,用于公司基本信息页面的显示
		$scope.updateTag = function(){
			var business_label = [];
			for(var i=0; i<$scope.tagInfo.length; i++){
				if ($scope.tagInfo[i].isSelect) {
					business_label.push({business_label_id:$scope.tagInfo[i].business_label_id,business_label_des:$scope.tagInfo[i].business_label_des});
				}
			}
			$localStorage.setObject("com_business_label_localstorage",business_label);
			$state.go('combase');
		};

		$scope.myBack = function() {
			$state.go("combase");
		}
}]);