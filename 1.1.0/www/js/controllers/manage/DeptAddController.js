/**
 * 新增部门控制器
 */
app.controller('DeptAddCtrl',
	['$scope', '$rootScope', 'DeptService', '$stateParams', '$CommonFactory', '$state',
		function ($scope, $rootScope, DeptService, $stateParams, $CommonFactory, $state) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.sub_dept_id = $stateParams.dept_id;
		$scope.sub_dept_name = $stateParams.dept_name;
		$scope.sub_dept_type = $stateParams.dept_type;
		$scope.dept = {};
	
		// 新增部门
		$scope.addDeptSave = function() {
			if (!$scope.dept.dept_name) {
				$CommonFactory.showAlert('请填写部门名称');
				return;
			}
			var data = {
				"accesstoken": $scope.accesstoken,
				'dept_name': $scope.dept.dept_name,
				'sup_dept_id': $scope.sub_dept_id,
				'sub_dept_type': $scope.sub_dept_type
			};
			DeptService.deptCreate(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$state.go("deptlist");
				} else {
					$CommonFactory.showAlert(response.message);
				}
			});
		}
}]);