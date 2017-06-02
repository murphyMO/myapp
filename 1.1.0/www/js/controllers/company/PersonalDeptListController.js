/**
 * 员工列表控制器
 */
app.controller('PersonalDeptListCtrl',
	['$scope', '$window', '$rootScope', 'DeptService', '$stateParams', '$state','SettingSafetyService',
		function ($scope, $window, $rootScope, DeptService, $stateParams, $state, SettingSafetyService) {
		$scope.pageClass = 'animated fadeInRight';
		var accesstoken = $rootScope.getAccessToken();
		
		//员工头像地址
		//$scope.photo_path = $rootScope.getCommonPath().photo_path;
		$scope.loginUser = $rootScope.getCurrentUser();
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.dept_id = $stateParams.dept_id;
		$scope.dept_name = $stateParams.dept_name;
		$scope.dept_type = "dept"; //部门
		$scope.isEmptyData = false;
		
		//获取部门列表
		$scope.getUserList = function () {
			var data = {
				'accesstoken': $scope.accesstoken,
				'dept_id': $scope.dept_id
			};
			DeptService.deptViewJunior(data, function (response) {
				// 请求失败或者没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.isEmptyData = true;
					return;
				}
				//有部门显示部门列表
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
					accesstoken : accesstoken,
					staff_user_id : item.id
				};
				SettingSafetyService.comStaffRelatioDatas(data, function (res) {
					if (res.statuscode == 1) {
						$state.go("comsetting");
					} else {
						//$.toast(res.message, "text");
					}
				});
			}
}]);