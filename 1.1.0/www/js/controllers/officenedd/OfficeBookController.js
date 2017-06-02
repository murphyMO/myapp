/**
 * 入驻通知
 */
app.controller('OfficeBookCtrl',
	['$scope', '$window', '$rootScope','$ionicHistory','OfficeBookService','$localStorage','$CommonFactory',
		function ($scope, $window, $rootScope,$ionicHistory,OfficeBookService,$localStorage,$CommonFactory) {
			$scope.user = $rootScope.getCurrentUser();
			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.path = $localStorage.getObject(KEY_COMMON_PATH);
			//获取个人信息
			$scope.getHomeDatas = function(){
				var data = {
					"accesstoken" : $scope.accesstoken
				};
				$CommonFactory.showLoading();
				OfficeBookService.getCompanyOnes(data,function(response){
					$CommonFactory.hideLoading();
					if(response.statuscode == 1){
						$scope.deptCnt = response.data.deptCnt;
						$scope.userCnt = response.data.userCnt;
						$scope.comInfo = response.data.comInfo;
						$scope.comBusinessLabelInfo = response.data.comBusinessLabelInfo;
					}
				});
			};
			$scope.getHomeDatas();


			$scope.back = function(){
				$ionicHistory.goBack();
			}
	}]);
