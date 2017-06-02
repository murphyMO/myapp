/**
 * 服务分类控制器
 */
app.controller('BusinessServiceCtrl',
	['$scope', '$rootScope', '$state', 'BusinessService', '$localStorage', 
	function ($scope, $rootScope, $state, BusinessService, $localStorage) {
		$scope.accesstoken = $rootScope.getAccessToken();
		//当前岛
		$scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
		$scope.currentStoreId = $scope.currentCity.city_id;
		console.log($scope.currentStoreId);
		$scope.serviceTypeList = [];

		/*//服务分类
		$scope.getServiceTypeDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				store_id: $scope.currentStoreId
			}
			BusinessService.serviceTypeDatas(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.serviceTypeList = response.data;
				}
			});
		};
		
		$scope.getServiceTypeDatas();*/

		//服务排序
		$scope.getServiceTypeDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				store_id: $scope.currentStoreId
			}
			BusinessService.sortService(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.serviceTypeList = response.data;
				}
			});
		};
		
		$scope.getServiceTypeDatas();

		//更多服务
		$scope.getServiceTwoTypeDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				//currentPage: 1,
				//itemsPerPage: 3,
				store_id: $scope.currentStoreId,
				id: 36
			}
			BusinessService.serviceTypeDatas(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.serviceTwoTypeList = response.data;
				}
			});
		};

		$scope.getServiceTwoTypeDatas();
		
		//跳转到服务列表
		$scope.toServiceListPageForCommunity = function(type) {
			var data = {
				type_id : type.id,
//				from : $state.current.name
			};
			$state.go('businessServiceList', data);
		}

		//返回
		$scope.topBack = function() {
			$localStorage.removeItem(KEY_CITY_SELECT);
			$state.go("tab.business");
		}
	}
]);