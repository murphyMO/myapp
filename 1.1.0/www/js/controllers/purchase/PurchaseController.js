/**
 * 立项控制器
 */
app.controller('PurchaseCtrl', 
	['$scope', '$rootScope','$state', '$timeout','ContactService','CompanyService','UserService','PurchaseService','$CommonFactory','$localStorage','$cordovaToast',
	function($scope, $rootScope,$state, $timeout, ContactService,CompanyService,UserService,PurchaseService,$CommonFactory,$localStorage,$cordovaToast) {

		$scope.order = {};
		angular.element(document.querySelector('#type')).val(1);//默认以个人名义购买
		$scope.order.status = 1;
		$scope.accesstoken = $rootScope.getAccessToken();

		var pathTemp = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.host_path = pathTemp.route_path + pathTemp.article_photo_path;

		//获取服务信息
		$scope.getService = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				com_service_id: $scope.paramsData.com_service_id
			}
			ContactService.getOneService(data,function(response){
				$scope.order.service = response.data;
			})
		}

		//调用原生的toast
		$scope.toast = function(message, duration, position){
			$cordovaToast.show(message, duration, position)
				.then(function(success) {
				// success
				}, function (error) {
				// error
			});
		}

		//获取卖方企业信息
		$scope.getCompany = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				id: $scope.paramsData.com_id
			}
			CompanyService.companyData(data,function(response){
				$scope.order.company = response.data;
				$scope.order.address = $scope.order.company.com_address;
			})
		}


		//获取买方信息
		$scope.getBuyer = function(){
			var data = {
				accesstoken: $scope.accesstoken,
			}
			UserService.userMine(data,function(response){
				$scope.order.reserve_name = response.data.userInfo.name;
				$scope.order.reserve_phone = response.data.userInfo.phone ||　response.data.userInfo.user_account;
			})
		}

		//提交订单
		$scope.submitOrder = function(){
			if (!$scope.order.reserve_name || !$scope.order.reserve_phone) {
				$CommonFactory.showAlert("请完善数据");
				return false;
			}
			var phoneReg = /^1[34578]\d{9}$/;
			if (!phoneReg.test($scope.order.reserve_phone)) {
				$CommonFactory.showAlert('手机号格式不正确');
				return false;
			}
			var data = {
				accesstoken: $scope.accesstoken,
				com_service_id: $scope.paramsData.com_service_id,
				comments: $scope.order.comments,
				reserve_phone: $scope.order.reserve_phone,
				reserve_name: $scope.order.reserve_name,
				reserved_user_id: $scope.paramsData.target_id,
				reservation_release_type: angular.element(document.querySelector('#type')).val()
			}
			PurchaseService.serviceReserve(data,function(response){
				if(response.statuscode == CODE_SUCCESS){
					$scope.toast("下单成功，对方会尽快处理您的订单。","long","center");
					$scope.back();
					//$CommonFactory.showAlert("下单成功，对方会尽快处理您的订单。");
				}else{
					$CommonFactory.showAlert(response.message);
				}
			})
		}



		$scope.back = function(){
			if ($state.params.data && $state.params.data.hasOwnProperty("from")) {
				if ($state.params.data.from_param) {
					$state.go($state.params.data.from ,$state.params.data.from_param);
				} else {
					$state.go($state.params.data.from);
				}
			} else {
				window.history.back();
			}
		}

		//数据准备
		$scope.dataPrepare = function(){
			if($state.params.data && $state.params.data.hasOwnProperty("com_service_id")){
				$scope.paramsData = $state.params.data;
				$scope.getService();
				$scope.getBuyer();
				$scope.getCompany();
			} else {
				$CommonFactory.showAlert("数据有误~");
				$timeout(
					function() {
						$scope.back();
					},1500);
			}
		}
		$scope.dataPrepare();
}]);