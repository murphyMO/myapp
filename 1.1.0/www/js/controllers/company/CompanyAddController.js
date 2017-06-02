/**
 * 企业基本信息控制器
 */
app.controller('CompanyAddCtrl',
	['$scope', '$rootScope', '$state','$localStorage', 'CompanyService', 'CommonService', 'UserService', '$stateParams', '$CommonFactory','$ionicHistory',
	function($scope, $rootScope, $state, $localStorage, CompanyService, CommonService, UserService, $stateParams, $CommonFactory,$ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.comObj = {};
		$scope.comObj.com_title_type = 1;
		$scope.isManager;
		$scope.typeDatas = [
			{
				id: 0,
				text: "企业"
			},
			{
				id: 1,
				text: "团队"
			}
		];

		$scope.$watch("comObj.com_title_type",function(newVal,oldVal){
			if ($scope.comObj.com_title_type == 0) {
				$state.go("comcheck")
			}
		},true)

		$scope.back = function(){
			$ionicHistory.goBack();
		}

		// 新增企业
		$scope.addCompanySave = function() {
			if (!$scope.comObj.com_name) {
				$CommonFactory.showAlert("请填写企业名称");
				return;
			}
			var data = {
				"accesstoken": $scope.accesstoken,
				'com_name': $scope.comObj.com_name,
				'com_title_type': $scope.comObj.com_title_type
			};
			$CommonFactory.showLoading();
			CompanyService.companyAdd(data, function(response){
				$CommonFactory.hideLoading();
				if (response.statuscode == CODE_SUCCESS) {
					//更新企业信息
					var userObj = $rootScope.getCurrentUser();
					userObj.com_id = response.data.insert_id;
					userObj.com_name = $scope.comObj.com_name;
					userObj.multiplecom = 1;
					$rootScope.setCurrentUser(userObj);
					//更新公司token
					var data2 = {
						'accesstoken': $scope.accesstoken,
						'comid': response.data.insert_id
					};
					CommonService.getTokenByUserTokenAndComId(data2, function (response2) {
						if (response2.statuscode == CODE_SUCCESS) {
							$rootScope.setAccessToken(response2.accesstoken);
							var userObj = $rootScope.getCurrentUser();
							if (!userObj.multiplecom || userObj.multiplecom == 0) {
								$state.go("tab.mine", {thisItem:1});
							} else {
								// $state.go("comsetting");
								$state.go("tab.mine", {thisItem:1});
							}
						}
					});
				}else{
					$CommonFactory.showAlert("新增公司无效，此公司已在您的企业列表，请在切换企业中查看");
				}
			});
		}

//		//获取当前的用户信息
//		$scope.getUserMine = function() {
//			var userData = {
//				'accesstoken': $rootScope.getAccessToken(),
//			};
//			UserService.userMine(userData, function (response2) {
//				if (response2.statuscode == 1) {
//					/*var userObj = {
//						isManager : response2.data.isManager, //是否为管理员
//					};*/
//					$scope.isManager=response2.data.isManager;
//					//console.log(response2.data.isManager);
//				}
//			});
//		}

}]);
