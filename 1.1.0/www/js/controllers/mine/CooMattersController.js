/**
 * 合作事项控制器
 */
app.controller('CooMattersCtrl',
	['$scope', '$rootScope', 'CooMattersService', '$state', '$localStorage',
		function ($scope, $rootScope, CooMattersService, $state, $localStorage) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.coomatters={};

		//获取合作事项
		$scope.getCooMatters = function(){
			var data = {
				accesstoken : $scope.accesstoken
			};
			CooMattersService.getCooMatters(data,function(response){
				$scope.coomatters = response.data;
			});
		}
		$scope.getCooMatters();


		//选择合作事项
		$scope.saveCooMatters = function(matter){
			$scope.mattersInfo = $localStorage.getObject("MattersInfo");
			
			$scope.mattersInfo.bookMatter = matter.coo_matters;
			$localStorage.setObject("MattersInfo",$scope.mattersInfo);
			$state.go("bookform");
		}
}]);