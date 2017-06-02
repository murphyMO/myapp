/**
 * 找回密码控制器
 */
app.controller('ForgetPwdCtrl', 
	['$scope', '$rootScope', '$state', '$timeout','$interval', 'CommonService', '$CommonFactory', '$localStorage',
	function($scope, $rootScope, $state, $timeout, $interval, CommonService, $CommonFactory, $localStorage) {
	$scope.user = {};
	$scope.isPhoneValid = true;
	$scope.isTimeout = false;//发送短信的计时器，默认未过时
	$scope.waitTime = 60;
	$scope.smsConfirmed = false;
	var timer1;
	var timer2;

	// 校验手机号码
	$scope.checkPhone = function() {
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
					$scope.isPhoneValid = false;
				} else {
					$CommonFactory.showAlert("您的手机号未注册");
				}
			} else {
				$CommonFactory.showAlert(response.message);
			}
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
	$scope.confirmSms = function(){
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
				//跳转再次输入密码界面
			} else {
				$scope.smsConfirmed = false;
				$CommonFactory.showAlert(response.message);
			}
		});
	}
	
	// 密码重置
	$scope.forgotPwd = function() {
		if (!$scope.user.pwd) {
			$CommonFactory.showAlert("请输入登录密码");
			return;
		}
		var pwdReg = /^(?![^A-Za-z]+$)(?![^0-9]+$)[\x21-x7e]{6,12}$/;
		if (!pwdReg.test($scope.user.pwd)) {
			$CommonFactory.showAlert('密码为6-12位字母、数字或符号组合，必须同时包含字母和数字');
			return;
		}
		if ($scope.user.pwd != $scope.user.confirmPwd) {
			$CommonFactory.showAlert("两次密码不一致");
			return;
		}
		var data = {
			uname : $scope.user.uname,
			pwd : $scope.user.pwd,
			verify_code : $scope.user.verifyCode
		};
		$CommonFactory.showLoading();
		CommonService.forgotPwd(data, function(response){
			$CommonFactory.hideLoading();
			if (response.statuscode == CODE_SUCCESS) {
				$state.go('login');
			} else {
				$CommonFactory.showAlert(response.message);
			}
		});
	};

}]);