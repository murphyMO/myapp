/**
 * 登陆控制器
 */
app.controller('LoginCtrl',
	['$scope', '$state', '$rootScope', '$timeout', '$interval', 'CommonService', '$CommonFactory', '$localStorage', 'UserService','$ionicLoading','$ionicModal',
	function ($scope, $state, $rootScope, $timeout, $interval, CommonService, $CommonFactory, $localStorage, UserService, $ionicLoading,$ionicModal) {
		$scope.tab = {};//tab控制
		$scope.tab.active = 1;//初始化初始进入为第一个为active
		$scope.loginUser = [];
		$scope.user = {};
		$scope.isPhoneValid = true;
		$scope.isTimeout = false;//发送短信的计时器，默认未过时
		$scope.waitTime = 60;
		$scope.smsConfirmed = false;
		var timer1;
		var timer2;

		// 登录
		$scope.login = function () {
			if (!$scope.loginUser.userName) {
				$CommonFactory.showAlert("请输入用户名");
				return;
			}
			// var phoneReg = /^1[34578]\d{9}$/;
			// if (!phoneReg.test($scope.loginUser.uname)) {
			// 	$CommonFactory.showAlert('手机号格式不正确');
			// 	return;
			// }
			if (!$scope.loginUser.passWord) {
				$CommonFactory.showAlert("请输入密码");
				return;
			}

			/*if (!$scope.loginUser.pwd) {
				$CommonFactory.showAlert("请输入登录密码");
				return;
			}*/
			var data = {
				'username' : $scope.loginUser.userName,
				'password' : $scope.loginUser.passWord,
			};
			$CommonFactory.showLoading();
			CommonService.login(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$rootScope.setCurrentUser(response.currentUser);//将用户信息存到缓存中
					$state.go('tab.business');
					$CommonFactory.hideLoading();
				} else {
					$CommonFactory.hideLoading();
					$CommonFactory.showAlert(response.message);
				}
			});
		}

		$scope.getUserInfo = function(token, multiplecom){
			var userData = {
				'accesstoken': token,
			};
			UserService.userMine(userData, function (response3) {
				//console.log(response2)
				if (response3.statuscode == CODE_SUCCESS) {
					//保存当前登录对象的关键信息
					var userObj = {
						user_account : response3.data.userInfo.user_account || response3.data.userInfo.phone,//当前用户的账号（手机号，用于小师妹的登记等）
						id : response3.data.userInfo.id,
						name : response3.data.userInfo.name,
						photo : response3.data.userInfo.photo,
						isManager : response3.data.isManager, //是否为管理员
						com_id : response3.data.userInfo.com_id,
						com_name : response3.data.userInfo.com_name,
						opt_permission : response3.data.userInfo.opt_permission, //判断用户权限0不可操作，1可操作
						member_end_time:response3.data.userInfo.member_end_time,
						user_type:response3.data.userInfo.user_type,
						multiplecom: multiplecom,
						store_id_by_ip : response3.data.userInfo.store_id_by_ip
					};
					$rootScope.setCurrentUser(userObj);
					$rootScope.setUmengToken(token,response3.data.userInfo.id);
					$rootScope.initXSM();
					$rootScope.checkGuest();
					$state.go('tab.business');
				}
			},function(res){
				console.log(res)
			});
		}

		//定时减时间数
		var decreaseTime = function(){
			$scope.waitTime --;
			if ($scope.waitTime == 0) {
				$interval.cancel(timer1);
				$interval.cancel(timer2);
				$scope.isTimeout = true;
				$scope.waitTime = 60;
			}
		}

		//从cookie取上次时间戳
		$scope.checkTimeCookie = function(){
			var oldTime = $localStorage.get('smsTime');
			if (oldTime) {
				var now = parseInt(new Date().getTime()/1000);
				if (now - oldTime >= 60){
					$scope.isTimeout = true;
				} else {
					$scope.time = 60 - (now - oldTime);
					try{
						timer1 = $interval(decreaseTime,1000,60);
					}catch(error){
					}
				}
			} else {
				$scope.isTimeout = true;
			}
		}

		$scope.checkTimeCookie();

		//发送校验码
		$scope.smsCode = function(){
			if (!$scope.loginUser.uname) {
				$CommonFactory.showAlert("请您输入手机号");
				return;
			}
			var phoneReg = /^1[34578]\d{9}$/;
			if (!phoneReg.test($scope.loginUser.uname)) {
				$CommonFactory.showAlert("手机号码格式不正确");
				return;
			}

			var data = {
				uname: $scope.loginUser.uname
			};
			CommonService.checkPhone(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					if (response.data.exist != 1) {
						$scope.isTimeout = true;
						$scope.isPhoneValid = false;
						$CommonFactory.showAlert("您的手机号未注册");
						$interval.cancel(timer1);
						$interval.cancel(timer2);
						return;
					}
				} else {
					$CommonFactory.showAlert(response.message);
				}
			});

			//重新计时
			$localStorage.set('smsTime', parseInt(new Date().getTime()/1000));
			timer2 = $interval(decreaseTime, 1000, 60);
			$scope.isTimeout = false;

			//发送短信的接口
			var data = {
				'mobile' : $scope.loginUser.uname
			};
			CommonService.smsCode(data, function(response){
				if(response.statuscode != CODE_SUCCESS){
					$CommonFactory.showAlert(response.message);
				}
			});
		}



		//注册部分-校验手机号码
	$scope.checkPhone1 = function() {
		if (!$scope.user.uname) {
			$CommonFactory.showAlert("请您输入手机号");
			return;
		}
		var phoneReg = /^1[34578]\d{9}$/;
		if (!phoneReg.test($scope.user.uname)) {
			$CommonFactory.showAlert("手机号码格式不正确");
			return;
		}
		var data = {
			uname: $scope.user.uname
		};
		CommonService.checkPhone(data, function(response){
			if (response.statuscode == CODE_SUCCESS) {
				if (response.data.exist == 1) {
					$CommonFactory.showAlert("手机号码已经注册过");
				} else {
					$scope.isPhoneValid = false;
				}
			} else {
				$CommonFactory.showAlert(response.message);
			}
		});
	}

		//发送校验码
	$scope.smsCode1 = function(){
		//重新计时
		$localStorage.set('smsTime', parseInt(new Date().getTime()/1000));
		timer2 = $interval(decreaseTime, 1000, 60);
		$scope.isTimeout = false;
		//发送短信的接口
		var data = {
			'mobile' : $scope.user.uname
		};
		CommonService.smsCode(data, function(response){
			if(response.statuscode != CODE_SUCCESS){
				$CommonFactory.showAlert(response.message);
			}
		});
	}

	//验证码的校验
	$scope.next = function(){
		if (!$scope.user.uname) {
			$CommonFactory.showAlert("请输入手机号");
			return;
		}
		var phoneReg = /^1[34578]\d{9}$/;
		if (!phoneReg.test($scope.user.uname)) {
			$CommonFactory.showAlert('手机号格式不正确');
			return;
		}
		if (!$scope.user.verifyCode) {
			$CommonFactory.showAlert("请输入验证码");
			return;
		}
		var data = {
			'uname' : $scope.user.uname,
			'verify_code' : $scope.user.verifyCode
		};
		$CommonFactory.showLoading();
		CommonService.smsCodeCheck(data, function(response){
			$CommonFactory.hideLoading();
			if (response.statuscode == CODE_SUCCESS) {
				//验证通过
				$scope.smsConfirmed = true;
				//跳转个人信息界面
			} else {
				$scope.smsConfirmed = false;
				$CommonFactory.showAlert(response.message);
			}
		});
	}

	$scope.regist = function() {
		if (!$scope.user.full_name) {
			$CommonFactory.showAlert("请填写姓名！");
			return;
		}
		if (!$scope.user.tem_com_name) {
			$CommonFactory.showAlert("请填写企业名称！");
			return;
		}
		if (!$scope.user.com_employee_duty) {
			$CommonFactory.showAlert("请填写职位名称！");
			return;
		}

		var data = {
			uname : $scope.user.uname,
			//pwd : $scope.user.pwd,
			verify_code : $scope.user.verifyCode,
			full_name: $scope.user.full_name,
			tem_com_name: $scope.user.tem_com_name,
			com_employee_duty: $scope.user.com_employee_duty
		};
		$CommonFactory.showLoading();
		CommonService.register(data, function(response){
			$CommonFactory.hideLoading();
			if (response.statuscode == CODE_SUCCESS) {
				//$state.go('login');
				$ionicLoading.show({
					animation: 'fade-in',
					template: '<span class="positive">注册成功<i class="ion-checkmark"></i> </span>'
				});
				$timeout(function() {
					$ionicLoading.hide(); // 0.1秒后关闭弹窗
					$rootScope.setAccessToken(response.accesstoken);

					//获取通用路径
					CommonService.commonDatas({}, function (response2) {
						$CommonFactory.hideLoading();
						if (response2.statuscode == CODE_SUCCESS) {
							$localStorage.setObject(KEY_COMMON_PATH, response2.data);
							$scope.getUserInfo(response.accesstoken, response.multiplecom);

							// $state.go('start');

						} else {
							$CommonFactory.showAlert(response2.message);
						}
					});
				}, 200);
			} else {
				$CommonFactory.showAlert(response.message);
			}
		});
	};

		//条款
	$scope.tiaokuan = function(){
		$state.go('tiaokuan');
	}

	// 游客登录
	$scope.guest = function(){
		$CommonFactory.showLoading();
		$rootScope.setAccessToken('youketoken');
		$scope.accesstoken = $rootScope.getAccessToken('youketoken');
		var userData = {
			'accesstoken': $scope.accesstoken,
		};
		$rootScope.isGuest = true;
		// console.log(userData)
			//获取通用路径
		CommonService.commonDatas({}, function (response2) {
			$CommonFactory.hideLoading();
			if (response2.statuscode == CODE_SUCCESS) {
				$localStorage.setObject(KEY_COMMON_PATH, response2.data);
				$scope.getUserInfo($scope.accesstoken, null);
			} else {
				$CommonFactory.showAlert(response2.message);
			}
		});
	}

	// 触发一个按钮点击，或一些其他目标
		// $ionicModal.fromTemplateUrl('templates/modal/guestbusiness.html', {
		// 	scope: $scope,
		// 	animation: 'slide-in-up'
		// }).then(function(modal) {
		// 	$scope.modal = modal;
		// });
		// $scope.openModal = function() {
		// 	$scope.modal.show();
		// };
		// $scope.closeModal = function() {
		// 	$scope.modal.hide();
		// };


	}
]);

