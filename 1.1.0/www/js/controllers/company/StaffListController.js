/**
 * 员工列表控制器
 */
app.controller('StaffListCtrl',
	['$scope', '$window', '$rootScope', 'DeptService', 'SettingSafetyService', '$stateParams', '$state', '$localStorage',
		function ($scope, $window, $rootScope, DeptService, SettingSafetyService, $stateParams, $state, $localStorage) {
		//员工头像地址
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.photo_path = $scope.commonPath.route_path + $scope.commonPath.photo_path;

		$scope.loginUser = $rootScope.getCurrentUser();
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.dept_id = $stateParams.dept_id;
		$scope.dept_name = $stateParams.dept_name;
		$scope.dept_type = "dept"; //部门
		$scope.isEmptyData = false;
		$scope.dataItems = [];

		//获取部门列表
		$scope.getUserList = function () {
			var data = {
				'accesstoken': $scope.accesstoken,
				'dept_id': $scope.dept_id
			};
			DeptService.deptViewJunior(data, function (response) {
				// 请求失败或者没有数据
				if (response.statuscode != CODE_SUCCESS) {
					$scope.isEmptyData = true;
					return;
				}
				//console.log($scope.dept_id);
				//员工列表
				if (response.data.user_info && response.data.user_info.length > 0) {
					$scope.isEmptyData = false;
					$scope.dataItems = response.data.user_info;
				} else {
					$scope.isEmptyData = true;
				}
			});
		};
		$scope.getUserList();
		
		//新增客服
		$scope.saveDeptFullName = function(item) {
			var data = {
				'accesstoken': $scope.accesstoken,
				'staff_user_id' : item.id
			};
			SettingSafetyService.comStaffRelatioDatas(data, function (response) {
				//console.log("skjdjhfj");
				if (response.statuscode == 1) {

					$state.go("comsetting");
				}
			});
		}

}]);