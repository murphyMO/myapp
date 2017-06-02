/**
 * 编辑员工控制器
 */
app.controller('PersonalEditCtrl',
	['$scope', '$window', '$rootScope', 'UserService', 'AdminService', '$stateParams', '$state', '$localStorage', '$CommonFactory','$ionicModal','$ionicHistory',
		function ($scope, $window, $rootScope, UserService, AdminService, $stateParams, $state, $localStorage, $CommonFactory,$ionicModal,$ionicHistory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.user_id = $stateParams.user_id;
		$scope.staff = {};
		$scope.com_id = $localStorage.getObject("currentUser").com_id;

		$scope.getCompanyMember = function(){
			var data = {
				"accesstoken": $scope.accesstoken,
				"com_id" : $scope.com_id
			}
			AdminService.getCompanyMember(data,function(response){
				if (response.statuscode == CODE_SUCCESS) {
					for(var i = 0;i < response.data.length;i++){
						response.data[i].checked = false;
						if (response.data[i].member_type == 2) {
							response.data[i].member_text = '云会员';
						}
						else if (response.data[i].member_type == 9) {
							response.data[i].member_text = '灵活会员';
						}
						else if (response.data[i].member_type == 3) {
							response.data[i].member_text = '入驻会员';
						}
					}
					$scope.companyMember = response.data;
					$scope.sys_time = response.sys_time;
				}
			})
		}
		$scope.getCompanyMember();
		
		// 获取员工详情
		$scope.getPersonalDetail = function() {
			var data = {
				"accesstoken": $scope.accesstoken,
				'user_id' : $scope.user_id,
				"com_id" : $scope.com_id
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

		$scope.$on('$ionicView.beforeEnter',function (){
			if ($rootScope.isEmptyObject($localStorage.getObject("tmp_edit_staff"))) {
				$scope.getPersonalDetail();
			} else {
				$scope.staff = $localStorage.getObject("tmp_edit_staff");
			}
		})
		$scope.clickManager =function(){
			if ($scope.staff.is_manager == 0) {
				$scope.staff.is_manager = 1;
			}
			else{
				$scope.staff.is_manager = 0;
			}
		}

		// 编辑员工
		$scope.editPersonalSave = function() {
//			if (!$scope.staff.full_name) {
//				$CommonFactory.showAlert('请填写姓名');
//				return;
//			}
//			if (!$scope.staff.mobile) {
//				$CommonFactory.showAlert('请填写手机号');
//				return;
//			}
//			var phoneReg = /^1[34578]\d{9}$/;
//			if (!phoneReg.test($scope.staff.mobile)) {
//				$CommonFactory.showAlert('手机号码格式不正确');
//				return;
//			}
			var data = {
				"accesstoken": $scope.accesstoken,
				'full_name': $scope.staff.full_name,
				'mobile': $scope.staff.user_account,
				'post_name': $scope.staff.post_name,
				'dept_id' : $scope.staff.dept_id,
				'id': $scope.user_id,
				'member_id' : $scope.staff.memberId,
				'start_time' : $scope.staff.start_time,
				'end_time' : $scope.staff.end_time,
				'manager' : $scope.staff.is_manager
			};
			if ($scope.revert) {
				data.abolish_user_id = $scope.user_id;
				data.user_type = $scope.staff.user_type;
			}
			UserService.userUpdate(data, function(response){
				//$.toast(response.message, "text");
				$scope.clearLocalStorage();
				if (response.statuscode == 1) {
					$CommonFactory.showAlert("修改成功");
					$scope.topBack();
				}
				else{
					$CommonFactory.showAlert("修改失败");
				}
			});
		}
		
		//选择部门
		$scope.deptSelectOne = function() {
			$localStorage.setObject("tmp_edit_staff", $scope.staff);
			$state.go("deptselect");
		}
		
		//清空存储
		$scope.clearLocalStorage = function() {
			$localStorage.setObject("tmp_edit_staff", "");
		}

		// 触发一个按钮点击，或一些其他目标
		$ionicModal.fromTemplateUrl('templates/modal/select_user_type.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		$scope.openModal = function() {
			$scope.modal.show();
		};
		$scope.closeModal = function() {
			$scope.modal.hide();
		};

		$scope.selectItem = function(item){
			$scope.closeModal();
			if (item == 'revert') {
				$scope.revert = true;
				if ($scope.staff.user_type == 0) {
					$scope.staff.member_text = '侠客岛员工'
				}
				else if ($scope.staff.user_type == 1) {
					$scope.staff.member_text = '注册会员'
				}
				else if ($scope.staff.user_type == 2) {
					$scope.staff.member_text = '云会员'
				}
				else if ($scope.staff.user_type == 9) {
					$scope.staff.member_text = '灵活会员'
				}
				else if ($scope.staff.user_type == 3) {
					$scope.staff.member_text = '入驻会员'
				}
				$scope.staff.memberId = null;
				$scope.staff.start_time = null;
				$scope.staff.end_time = null;
			}
			else{
				$scope.revert = false;
				if (item.checked == false) {
					for(var i = 0;i < $scope.companyMember.length;i++){
						$scope.companyMember[i].checked = false;
					}
					item.checked = true;
					$scope.staff.member_text = item.member_text;
					$scope.staff.memberId = item.id;
					$scope.staff.start_time = item.start_time;
					$scope.staff.end_time = item.end_time;
				}
			}
		}

		//跳转返回
		$scope.topBack = function(){
			$scope.clearLocalStorage();
			$ionicHistory.goBack();
		}

}]);