/**
 * 注册控制器
 */
app.controller('RegistCtrl',
	['$scope', '$rootScope', '$state', '$timeout','$interval', 'CommonService', '$CommonFactory', '$localStorage', 'UserService','$ionicLoading',
	function($scope, $rootScope, $state, $timeout, $interval, CommonService, $CommonFactory, $localStorage, UserService, $ionicLoading) {
	$scope.user = {};
	$scope.isPhoneValid = true;
	$scope.isTimeout = false;//发送短信的计时器，默认未过时
	$scope.waitTime = 60;
	$scope.smsConfirmed = false;
	var timer1;
	var timer2;

	//条款
	$scope.tiaokuan = function(){
		$state.go('tiaokuan');
	}

	// 注册
	$scope.regist = function() {
		if (!$scope.user.userName) {
			$CommonFactory.showAlert("请填写用户名！");
			return;
		}
		if (!$scope.user.passWord) {
			$CommonFactory.showAlert("请填写密码！");
			return;
		}
		//	验证姓名是否汉字
		// var nameReg = /^([\u4e00-\u9fa5]){2,7}$/;
		// if (!nameReg.test($scope.user.full.uname)) {
		// 	$CommonFactory.showAlert('请输入正确的姓名');
		// 	return;
		// }
		// var comReg = /^\S.*?(?<![\x{4e00}-\x{9fa5}\s])\s{1}(?![\x{4e00}-\x{9fa5}\s]).*/u;
		// if (!comReg.test($scope.user.tem_com.uname)) {
		// 	$CommonFactory.showAlert('请输入正确的企业名称');
		// 	return;
		// }

		var data = {
			username : $scope.user.userName,
			password : $scope.user.passWord
		};
		data = JSON.stringify(data);
		$CommonFactory.showLoading();
		CommonService.register(data, function(response){
			$CommonFactory.hideLoading();
			if (response.statuscode == CODE_SUCCESS) {
				$ionicLoading.show({
					animation: 'fade-in',
					template: '<span class="positive">注册成功<i class="ion-checkmark"></i> </span>'
				});
				$timeout(function() {
					$ionicLoading.hide(); // 0.1秒后关闭弹窗
					$state.go('tab.business')					 
					// $rootScope.setAccessToken(response.accesstoken);
					
					//获取通用路径
					// CommonService.commonDatas({}, function (response2) {
					// 	$CommonFactory.hideLoading();
					// 	if (response2.statuscode == CODE_SUCCESS) {
					// 		$localStorage.setObject(KEY_COMMON_PATH, response2.data);
					// 		$scope.getUserInfo(response.accesstoken, response.multiplecom);
							
					// 		// $state.go('start');

					// 	} else {
					// 		$CommonFactory.showAlert(response2.message);
					// 	}
					// });
				}, 200);			
			} else {
				$CommonFactory.showAlert(response.message);
			}
		});
	};
	$scope.getUserInfo = function(token, multiplecom){
		var userData = {
			'accesstoken': token,
		};
		UserService.userMine(userData, function (response2) {
			//console.log(response2)
			if (response2.statuscode == CODE_SUCCESS) {
				//保存当前登录对象的关键信息
				var userObj = {
					user_account : response2.data.userInfo.user_account || response2.data.userInfo.phone,//当前用户的账号（手机号，用于小师妹的登记等）
					id : response2.data.userInfo.id,
					name : response2.data.userInfo.name,
					photo : response2.data.userInfo.photo,
					isManager : response2.data.isManager, //是否为管理员
					com_id : response2.data.userInfo.com_id,
					com_name : response2.data.userInfo.com_name,
					opt_permission : response2.data.userInfo.opt_permission, //判断用户权限0不可操作，1可操作
					member_end_time:response2.data.userInfo.member_end_time,
					user_type:response2.data.userInfo.user_type,
					multiplecom: multiplecom,
					store_id_by_ip : response3.data.userInfo.store_id_by_ip
				};
				$rootScope.setCurrentUser(userObj);
				$rootScope.setUmengToken(token,response2.data.userInfo.id);
				$rootScope.initXSM();
				// $state.go('tab.business');
			}
		},function(res){
			console.log(res)
		});
	}	
}]);
