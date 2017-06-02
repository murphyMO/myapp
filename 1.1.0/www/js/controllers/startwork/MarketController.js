/**
 * 整合营销控制器
 */
app.controller('MarketController',
	['$scope', '$rootScope', '$state','$stateParams', '$localStorage', '$ionicHistory','$ionicPopup','rongCloudService','$window',
	function ($scope, $rootScope, $state,$stateParams, $localStorage, $ionicHistory, $ionicPopup,rongCloudService, $window) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.user = $rootScope.getCurrentUser();

		$scope.toChat = function(){
			if($rootScope.isGuest){
				$state.go('login');
	}else{
			var data = {
				'accesstoken' : $scope.accesstoken,
				'store_id' : '-1'
			};
			rongCloudService.getServiceId(data, function(response){
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					xsm_info = response.data[0];
					var data = {
						chat_user_id : xsm_info.user_id,
						chat_user_name : xsm_info.user_name,
						service_id : 0,
						user_role : 'B',
						is_xsm:  false,
						from : $state.current.name
					};
					$state.go('chat',{data: data});
				}
			});
		}
		}

		//跳转返回
		$scope.topBack = function(){
			$ionicHistory.goBack();
//			window.history.back();
		}

		$scope.callPhone = function (mobilePhone) {
			window.open("tel:" + mobilePhone);
		};

	}
]);
