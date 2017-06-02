/**
 * 闲置出租-控制器
 */
app.controller('LeaveRentCtrl',
	['$scope','$rootScope','$state','$stateParams','CustomNeedService','$CommonFactory',
	function ($scope, $rootScope,$state,$stateParams,CustomNeedService,$CommonFactory) {
		$scope.accesstoken = $rootScope.getAccessToken();

	$scope.item = {};
		//提交
	$scope.submitOffice = function(){

		var data = {
			'accesstoken': $scope.accesstoken,
			'is_lianhe':$scope.item.is_lianhe,
			'is_jinzhuangxiu':$scope.item.is_jinzhuangxiu,
			'is_zhuanzu':$scope.item.is_zhuanzu,
			'is_zhinenghua':$scope.item.is_zhinenghua,
			'is_qiyefuwu' : $scope.item.is_qiyefuwu,

		};
		$CommonFactory.showLoading();
		CustomNeedService.LeaveRent(data,function(response){
			if(response.statuscode==CODE_SUCCESS){
				$CommonFactory.hideLoading();
				$CommonFactory.showAlert("提交成功！");
				$state.go('tab.mine');

			}
		})
	}

	//跳转返回
		$scope.myBack = function(){
				window.history.back();
		}




	}

]);




