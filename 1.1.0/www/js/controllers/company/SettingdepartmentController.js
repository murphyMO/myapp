app.controller('DepartmentCtrl',
	['$scope', '$window', '$rootScope', '$timeout', '$state','SettingSafetyService', 'DeptService','$localStorage',
		function ($scope, $window, $rootScope, $timeout, $state, SettingSafetyService, DeptService, $localStorage) {
			var accesstoken = $rootScope.getAccessToken();
			
			//头部返回
			$scope.back  = function() {
				window.history.back();
			}
			
			$scope.getsettingsafety = function() {
				var data = {
					accesstoken : accesstoken
				};
				SettingSafetyService.getsettingsafety(data, function (res) {
					$scope.item = res.data;
					$scope.safety = res.data;
					//console.log($scope.safety);
				});
			};
			$scope.getsettingsafety();
			
			$scope.dataItems = []; //部门数据
			$scope.userItems = []; //用户数据
			$scope.loginUser = $rootScope.getCurrentUser();
			
			//员工头像地址
			$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
			$scope.photo_path = $scope.commonPath.route_path + $scope.commonPath.photo_path;
			$scope.dept_id = $scope.loginUser.com_id;
			$scope.dept_name = $scope.loginUser.com_name;
			$scope.dept_type = "org"; //默认为公司
			$scope.isEmptyData = false;
			
			//获取部门列表
			$scope.getDeptList = function (dept_id) {
				var data = {
					'accesstoken': accesstoken
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
						//console.log($scope.dataItems);
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
				//console.log("sdhfjdasbjsd");
				if (item.have_junior) {
					//有部门
					$scope.dept_type = "dept"; //部门
					$scope.dept_name = item.dept_name;
					$scope.dept_id = item.dept_id;
					$scope.getDeptList(item.dept_id);
				} else {
					$state.go("stafflist", {dept_id: item.dept_id,dept_name:item.dept_name});
				}
			}
	}]);
//app.controller('DeptListCtrl',
//	['$scope', '$window', '$rootScope', 'DeptService', '$state', '$stateParams', '$localStorage',
//		function ($scope, $window, $rootScope, DeptService, $state, $stateParams, $localStorage) {
//		$scope.dataItems = []; //部门数据
//		$scope.userItems = []; //用户数据
//		$scope.loginUser = $rootScope.getCurrentUser();
//		
//		//员工头像地址
//		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
//		$scope.photo_path = $scope.commonPath.route_path + $scope.commonPath.photo_path;
//		
//		$scope.accesstoken = $rootScope.getAccessToken();
//		//$scope.dept_id = $scope.loginUser.com_id;
//		// if($stateParams.dept_id){
//		// 	//$scope.dept_id = $scope.loginUser.com_id;
//		// 	$scope.dept_id = $stateParams.dept_id;
//		// 	$scope.getDeptList($scope.dept_id);
//		// }else{
//		$scope.dept_id = $scope.loginUser.com_id;
//		$scope.dept_name = $scope.loginUser.com_name;
//		$scope.dept_type = "org"; //默认为公司
//		$scope.isEmptyData = false;
//		//$scope.isShowChildDept = false; //默认不显示子部门
//		// }
//		
//		
//		//获取部门列表
//		$scope.getDeptList = function (dept_id) {
//			var data = {
//				'accesstoken': $scope.accesstoken
//			};
//			if (dept_id) {
//				data.dept_id = dept_id;
//			} else {
//				data.com_id = $scope.dept_id;
//			}
//			
//			DeptService.deptViewJunior(data, function (response) {
//				// 请求失败或者没有数据
//				if (response.statuscode != CODE_SUCCESS) {
//					$scope.isEmptyData = true;
//					return;
//				}
//				
//				//有部门显示部门列表
//				if (response.data.dept_info && response.data.dept_info.length > 0) {
//					$scope.dataItems = response.data.dept_info;
//					console.log($scope.dataItems);
//				}
//				//有员工
//				if (response.data.user_info && response.data.user_info.length > 0) {
//					$scope.userItems = response.data.user_info;
//				}
//				
//				if ($scope.dataItems.length == 0 && $scope.userItems.length == 0) {
//					$scope.isEmptyData = true;
//				} else {
//					$scope.isEmptyData = false;
//				}
//			});
//		};
//		$scope.getDeptList();
//		
//		// 显示子部门
//		$scope.showChildDept = function(item) {
//			console.log("sdhfjdasbjsd");
//			if (item.have_junior) {
//				//有部门
//				//$scope.isShowChildDept = true; //显示编辑部门
//				$scope.dept_type = "dept"; //部门
//				$scope.dept_name = item.dept_name;
//				$scope.dept_id = item.dept_id;
//				$scope.getDeptList(item.dept_id);
//
//				//$localStorage.dept_id_a = item.dept_id;
//			} else {
//				$state.go("stafflist", {dept_id: item.dept_id,dept_name:item.dept_name});
//			}
//		}
//
//		/*//员工跳转连接
//		$scope.personalListClick = function(item) {
//			console.log(item.id);
//			// if ($scope.loginUser.isManager) {
//			// 	$state.go("personaledit", {user_id:item.id});
//			// } else {
//				$state.go("personaldetail", {user_id:item.id});
//			// }
//
//		}*/
//
//		//页面返回按钮
//		// $scope.back = function(){
//		// 	if($localStorage.dept_id_a){
//		// 		$scope.getDeptList($localStorage.dept_id_a);
//		// 		$localStorage.dept_id_a = "";
//		// 	}else{
//		// 		$state.go('tab.company');
//		// 	}
//			//window.history.back();
//		//}
//}]);
//app.controller('SafetyDeptCtrl',
//	['$scope', '$window', '$rootScope', '$timeout', '$stateParams', '$state','SettingSafetyService',
//	function ($scope, $window, $rootScope, $timeout, $stateParams, $state, SettingSafetyService) {
//		var accesstoken = $rootScope.getAccessToken();
//		
//		$scope.isEmptyData = false;
//
//		$scope.dept_name = $stateParams.dept_name;
//		$scope.dept_id = $stateParams.dept_id;
//		
//		//头部返回
//		$scope.back  = function() {
//			window.history.back();
//		}
//
//		$scope.getsafety = function() {
//			var data = {
//				accesstoken : accesstoken,
//				dept_id: $scope.dept_id
//			};
//			SettingSafetyService.getsafety(data, function (res) {
//				$scope.item = res.data;
//				$scope.employee = res.data;
//				console.log($scope.employee)
//			});
//		};
//		$scope.getsafety();
//		
//		//新增客服
//		$scope.saveDeptFullName = function(item) {
//			var data = {
//				accesstoken : accesstoken,
//				staff_user_id : item.id
//			};
//			SettingSafetyService.comStaffRelatioDatas(data, function (res) {
//				if (res.statuscode == 1) {
//					$state.go("comsetting");
//				} else {
//					//$.toast(res.message, "text");
//				}
//			});
//		}
//}]);