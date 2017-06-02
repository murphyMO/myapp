/**
 * 员工详情控制器
 */
app.controller('PersonalDetailCtrl',
	['$scope', '$window', '$rootScope', 'AdminService', '$stateParams', '$localStorage','$CommonFactory','$ionicHistory',
		function ($scope, $window, $rootScope, AdminService, $stateParams, $localStorage,$CommonFactory,$ionicHistory) {
		//员工头像地址
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.photo_path = $scope.commonPath.route_path + $scope.commonPath.photo_path;

		// $scope.accesstoken = $rootScope.getAccessToken();
		//$scope.user_id = $stateParams.user_id;
		$scope.loginUser = $rootScope.getCurrentUser();
		var accesstoken = $rootScope.getAccessToken();
		var user_id = $stateParams.user_id;
		$scope.isEmptyData = false;
		console.log($stateParams.user_id);


		// $scope.accesstoken = $rootScope.getAccessToken();
		// $scope.user_id = $stateParams.user_id;
		$scope.staff = {};

		// 获取员工详情
		$scope.getPersonalDetail = function() {
			var data = {
				accesstoken: accesstoken,
				user_id : user_id,
				com_id : $scope.loginUser.com_id
			};
			AdminService.userGetSetting(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					if (response.data.member_type == 2) {
						response.data.member_text = '云会员';
					}
					else if (response.data.member_type == 9) {
						response.data.member_text = '灵活会员';
					}
					else if (response.data.member_type == 3) {
						response.data.member_text = '入驻会员';
					}
					$scope.staff = response.data;
					$scope.staff.dept_name = $stateParams.dept_name
				}
			});
		}
		$scope.getPersonalDetail();


		$scope.delUserModal = function(){
			$CommonFactory.showConfirm($scope.goToDel,"确认删除"+$scope.staff.full_name+"吗？");
		}

		$scope.goToDel = function(){
			$CommonFactory.showLoading();
			var data = {
				accesstoken: accesstoken,
				id : $scope.staff.user_org_dept_id
			};
			AdminService.userDel(data,function(response){
				$CommonFactory.hideLoading();
				console.log(response)
				if (response.statuscode == 1) {
					$cordovaToast.show("删除成功", "short", "center")
							.then(function(success) {
							// success
							}, function (error) {
							// error
						});
					$ionicHistory.goBack();
				}
				else{
					$CommonFactory.showAlert("操作失败")
				}
			})
		}
		//跳转返回
		$scope.topBack = function(){
			$ionicHistory.goBack();
		}
}]);