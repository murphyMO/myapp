/**
 * 企业列表控制器
 */
app.controller('CompanyListCtrl',
	['$scope', '$rootScope', '$state', 'BusinessService', '$localStorage', '$ionicHistory','$CommonFactory',
	function ($scope, $rootScope, $state, BusinessService, $localStorage, $ionicHistory,$CommonFactory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.user_type = $localStorage.getObject("currentUser").user_type;
		
		// $scope.currentCity = $localStorage.getObject(KEY_CITY_SELECT);
		// if (!$scope.currentCity.city_name) {
		// 	$scope.currentCity = {
		// 		city_id: 2,
		// 		city_name: "航天岛"
		// 	}
		// }
		// $scope.currentStoreId = $scope.currentCity.city_id;
		$scope.currentStoreId = $rootScope.getCurrentUser().store_id_by_ip;
	
		//路径对象
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		//推荐企业
		$scope.companyPath = $scope.commonPath.route_path + $scope.commonPath.com_logo_path;
		$scope.recomCompanyList = [];
		$scope.isEmptyData = false;

		//获取推荐企业
		$scope.getRecommengDatas = function(){
			var data = {
				accesstoken: $scope.accesstoken,
				store_id: $scope.currentStoreId
			}
			BusinessService.recommengDatas(data, function(response){
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.isEmptyData = true;
					return;
				}
				$scope.recomCompanyList = response.data;
			});
		};
		
		$scope.getRecommengDatas();

		$scope.showCompany = function(id){
				if ($scope.user_type == 1 || $scope.user_type == 2) {
					$CommonFactory.showAlert("您的会员等级还不能查看企业信息");
					return;
				}
				$state.go("commsg",{com_id:id})
			}
		
		//返回
		$scope.topBack = function() {
			$ionicHistory.goBack();
		}
	}
]);