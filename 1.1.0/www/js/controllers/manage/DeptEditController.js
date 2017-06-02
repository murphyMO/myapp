/**
 * 编辑部门控制器
 */
app.controller('DeptEditCtrl',
	['$scope', '$rootScope', 'DeptService', '$stateParams', '$CommonFactory', '$state',
		function ($scope, $rootScope, DeptService, $stateParams, $CommonFactory, $state) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.dept_id = $stateParams.dept_id;
		$scope.dept_name = $stateParams.dept_name;
		$scope.dept = {};
		
		// 编辑部门
		$scope.editDeptSave = function() {
			if (!$scope.dept.dept_name) {
				$CommonFactory.showAlert('请填写部门名称');
				return;
			}
			var data = {
				"accesstoken": $scope.accesstoken,
				'dept_name': $scope.dept.dept_name,
				'id': $scope.dept_id
			};
			DeptService.deptUpdate(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$state.go("deptlist");
				} else {
					$CommonFactory.showAlert(response.message);
				}
			});
		}
}]);