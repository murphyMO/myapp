/**
 * 员工列表控制器
 */
app.controller('PersonalListCtrl',
	['$scope', '$window', '$rootScope', 'DeptService', '$stateParams', '$state', '$localStorage','$ionicHistory',
		function ($scope, $window, $rootScope, DeptService, $stateParams, $state, $localStorage,$ionicHistory) {
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
		
		//跳转连接
		$scope.personalListCick = function(item) {
			// if ($scope.loginUser.isManager) {
			// 	$state.go("personaledit", {user_id:item.id});
			// } else {
			// 	$state.go("personaldetail", {user_id:item.id});
			// }
			$state.go("personaldetail", {user_id:item.id,dept_name:$scope.dept_name});
		}
		//跳转返回
		$scope.topBack = function(){
			$ionicHistory.goBack();
		}

		//页面返回按钮
		// $scope.back = function(){
		// 	if($localStorage.dept_id_a){
		// 		console.log($localStorage.dept_id_a);
		// 		$state.go("deptlist",{dept_id:$localStorage.dept_id_a})
		// 		$localStorage.dept_id_a = "";
		// 	}else{
		// 		$state.go('deptlist');
		// 	}
		// }
}]);