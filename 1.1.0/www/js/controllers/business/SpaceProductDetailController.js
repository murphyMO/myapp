/**
 * 空间产品详情控制器
 */
app.controller('SpaceProductDetailCtrl',
	['$scope', '$rootScope', '$state','$stateParams', '$localStorage', '$ionicHistory','rongCloudService',
	function ($scope, $rootScope, $state,$stateParams, $localStorage, $ionicHistory,rongCloudService) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.from = $state.params.hasOwnProperty("from") ? $state.params.from : "";
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.item = $localStorage.getObject("conference_item")

		$scope.buy = function(i){
			$localStorage.setObject("conference_item",i)
			$state.go("conferenceRoomBook")
		}
		//跳转返回
		$scope.topBack = function(){
			if($scope.from){
				$state.go($scope.from);
				return;
			}

			$ionicHistory.goBack();
//			window.history.back();
		}

		$scope.toChat = function(item){
			if (!item.store_id) {
				item.store_id = '-1';
			}
			var data = {
				'accesstoken' : accesstoken,
				'store_id' : item.store_id
			};
			rongCloudService.getServiceId(data, function(response){
				if (response.statuscode == CODE_SUCCESS && response.data.length > 0) {
					xsm_info = response.data[0];
					var data = {
						chat_user_id : xsm_info.user_id,
						chat_user_name : xsm_info.user_name,
						service_id : item.com_service_id,
						user_role : 'B',
						is_xsm:  false,
						from : $state.current.name
					};
					$state.go('chat',{data: data});
				}
			});
		}

		$rootScope.reloadPosition();



	}
]);
