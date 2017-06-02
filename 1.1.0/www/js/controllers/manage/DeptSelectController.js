/**
 *部门选择
 */
app.controller('DeptSelectCtrl',
	['$scope', '$window', '$rootScope', 'DeptService', '$state', '$localStorage',
		function ($scope, $window, $rootScope, DeptService, $state, $localStorage) {
		$scope.dataItems = []; //部门数据
		
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.isEmptyData = false;
		$scope.isShowChildDept = false; //默认不显示子部门
		
		//获取部门列表
		$scope.getDeptList = function (dept_id) {
			var data = {
				'accesstoken': $scope.accesstoken
			};
			if (dept_id) {
				data.dept_id = dept_id;
			} else {
				data.com_id = $scope.dept_id;
			}
			
			DeptService.deptViewJunior(data, function (response) {
				// 请求失败或者没有数据
				if (response.statuscode != CODE_SUCCESS) {
					$scope.isEmptyData = true;
					return;
				}
				
				//有部门显示部门列表
				if (response.data.dept_info && response.data.dept_info.length > 0) {
					$scope.dataItems = response.data.dept_info;
				}
				
				if ($scope.dataItems.length == 0) {
					$scope.isEmptyData = true;
				} else {
					$scope.isEmptyData = false;
				}
			});
		};
		$scope.getDeptList();
		
		// 显示子部门
		$scope.showChildDept = function(item) {
			if (item.have_junior) {
				//有部门
				$scope.isShowChildDept = true; //显示编辑部门
				$scope.getDeptList(item.dept_id);
			} else {
				var deptStaff = $localStorage.getObject("tmp_edit_staff");
				deptStaff.dept_name = item.dept_name;
				deptStaff.dept_id = item.dept_id;
				$localStorage.setObject("tmp_edit_staff", deptStaff);
				$state.go("personaledit", {user_id: deptStaff.user_id});
			}
		}
		
		//返回
		$scope.myBack = function() {
			var deptStaff = $localStorage.getObject("tmp_edit_staff");
			$state.go("personaledit", {user_id: deptStaff.user_id});
		}
}]);