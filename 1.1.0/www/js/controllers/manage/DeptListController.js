/**
 *部门列表控制器
 */
app.controller('DeptListCtrl',
	['$scope', '$window', '$rootScope', 'DeptService', '$state', '$stateParams', '$localStorage','$CommonFactory',
		function ($scope, $window, $rootScope, DeptService, $state, $stateParams, $localStorage, $CommonFactory) {
		$scope.dataItems = []; //部门数据
		$scope.userItems = []; //用户数据
		$scope.loginUser = $rootScope.getCurrentUser();
		console.log($scope.loginUser)

		//员工头像地址
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.comObj = $localStorage.getObject('comObj_localstorage');
		$scope.photo_path = $scope.commonPath.route_path + $scope.commonPath.photo_path;
		console.log($scope.comObj);

		$scope.accesstoken = $rootScope.getAccessToken();
		//$scope.dept_id = $scope.loginUser.com_id;
		// if($stateParams.dept_id){
		// 	//$scope.dept_id = $scope.loginUser.com_id;
		// 	$scope.dept_id = $stateParams.dept_id;
		// 	$scope.getDeptList($scope.dept_id);
		// }else{
		// $scope.dept_id = $scope.loginUser.com_id;
		$scope.dept_id = 0;
		$scope.dept_name = $scope.loginUser.com_name;
		$scope.dept_type = "org"; //默认为公司
		$scope.isEmptyData = false;
		$scope.isShowChildDept = false; //默认不显示子部门
		// }


		//获取部门列表
		$scope.getDeptList = function (dept_id) {
			var data = {
				'accesstoken': $scope.accesstoken
			};
			if (dept_id) {
				data.dept_id = dept_id;
			} else {
				data.com_id = $scope.loginUser.com_id;
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
					console.log($scope.dataItems);
				}
				//有员工
				if (response.data.user_info && response.data.user_info.length > 0) {
					$scope.userItems = response.data.user_info;
				}

				if ($scope.dataItems.length == 0 && $scope.userItems.length == 0) {
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
				$scope.dept_type = "dept"; //部门
				$scope.dept_name = item.dept_name;
				$scope.dept_id = item.dept_id;
				$scope.getDeptList(item.dept_id);
				//$localStorage.dept_id_a = item.dept_id;
			} else {
				$state.go("personallist", {dept_id: item.dept_id,dept_name:item.dept_name});
			}
		}

		//员工跳转连接
		$scope.personalListClick = function(item) {
			console.log(item.id);
			// if ($scope.loginUser.isManager) {
			// 	$state.go("personaledit", {user_id:item.id});
			// } else {
				$state.go("personaldetail", {user_id:item.id});
			// }

		}
		// 添加部门
		$scope.deptadd = function(){
				if ($scope.comObj.com_title_type == 1) {
					$CommonFactory.showConfirm(function(){
						// "deptadd({dept_id:dept_id,dept_type:dept_type,dept_name:dept_name})"
						$state.go("comaptitudemsg");
					},'请完善信息升级成为企业用户');
				}else{
					$state.go("deptadd",{'dept_id':$scope.dept_id,'dept_type':$scope.dept_type,'dept_name':$scope.dept_name});
				}
			}
			// 查看会员
		$scope.memberList = function(){
			if ($scope.comObj.com_title_type == 1) {
				$CommonFactory.showConfirm(function(){
					$state.go("comaptitudemsg");
				},'请完善信息升级成为企业用户');
			}else{
				$state.go("memberList");
			}
		}

		//页面返回按钮
		// $scope.back = function(){
		// 	if($localStorage.dept_id_a){
		// 		$scope.getDeptList($localStorage.dept_id_a);
		// 		$localStorage.dept_id_a = "";
		// 	}else{
		// 		$state.go('tab.company');
		// 	}
			//window.history.back();
		//}
}]);
