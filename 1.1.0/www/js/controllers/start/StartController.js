/*
 * 个人信息控制器
 */
app.controller('startCtrl',
	['$scope', '$window', '$rootScope', "$state","$ionicSlideBoxDelegate",'$CommonFactory','CommonService','$localStorage','UserService',
		function ($scope, $window, $rootScope, $state,$ionicSlideBoxDelegate,$CommonFactory,CommonService,$localStorage,UserService) {
		var accesstoken = $rootScope.getAccessToken();
		$scope.myActiveSlide = 0;
		$scope.test = function(i){
			$scope.thisPage = $ionicSlideBoxDelegate.currentIndex()
			console.log($scope.thisPage)
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


	}]);
