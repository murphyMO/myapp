/**
 * 新增员工控制器
 */
app.controller('PersonalAddCtrl',
	['$scope', '$rootScope', 'UserService', '$stateParams', '$state','$ionicHistory','$CommonFactory',
		function ($scope, $rootScope, UserService, $stateParams, $state,$ionicHistory,$CommonFactory) {

		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.dept_id = $stateParams.dept_id;
		$scope.dept_name = $stateParams.dept_name;
		$scope.staff = {};


		
		
		// 新增员工
		$scope.addPersonalSave = function() {
			$CommonFactory.showLoading();
			// if (!$scope.staff.full_name) {
			// 	$CommonFactory.showAlert('请填写姓名');
			// 	return;
			// }
			// if (!$scope.staff.mobile) {
			// 	$CommonFactory.showAlert('请填写手机号');
			// 	return;
			// }
			// var phoneReg = /^1[34578]\d{9}$/;
			// if (!phoneReg.test($scope.staff.mobile)) {
			// 	$CommonFactory.showAlert('手机号码格式不正确');
			// 	return;
			// }
			var data = {
				"accesstoken": $scope.accesstoken,
				'full_name': $scope.staff.full_name,
				'mobile': $scope.staff.mobile,
				'post_name': $scope.staff.post_name,
				'dept_id' : $scope.dept_id

			};
			UserService.userCreate(data, function(response){
				$CommonFactory.hideLoading();
				if (response.statuscode == CODE_SUCCESS) {
					console.log(data);
					// $state.go("deptlist");
					$ionicHistory.goBack();
				} else {
					$CommonFactory.showAlert(response.message);
				}
			});
		}
		//跳转返回
		$scope.topBack = function(){
			window.history.back();
		}

}]);