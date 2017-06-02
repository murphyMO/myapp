/**
 * 意向分岛控制器
 */
app.controller('WillingIslandCtrl',
	['$scope', '$rootScope', '$state', '$localStorage', '$ionicHistory',
		function ($scope, $rootScope, $state, $localStorage, $ionicHistory) {

		//$rootScope.muiltIsland = true;//多选岛，测试
		var cityArry = [];
		var cityObj = {};
		var cityNameArry = [];

		//如果需要多选岛，初始化
		if ($rootScope.muiltIsland) {
			$scope.city = [];
		}

		//选择城市
		$scope.citySelect = function(index, cityName) {
			if(!$rootScope.muiltIsland){
				//单选岛
				$scope.city = $localStorage.getObject("Info");
				$scope.city.store_id = index;
				$scope.city.store_name = cityName;
				$localStorage.setObject("Info", $scope.city);
				$scope.back();
			} else {
				//多选岛时
				$scope.city[index] = !$scope.city[index];
				if ($scope.city[index]) {
					//插入数组
					if (!cityObj[index]) {
						cityObj[index] = 1;
						cityArry[cityArry.length] = index;
						cityNameArry[cityNameArry.length] = cityName;
					}
				} else {
					//从数组中取出
					if (cityObj[index]) {
						cityObj[index] = 0;
						cityArry.splice(cityArry.indexOf(index),1);
						cityNameArry.splice(cityArry.indexOf(index),1);
					}
				}
				//console.log(cityNameArry);
			}
		}

		//多选时 点击确认
		$scope.updateIsland = function(){
			var temp = {};
			temp.store_id = cityArry;
			temp.store_name = cityNameArry.join("、");
			$localStorage.setObject("Info", temp);
			$scope.back();
		}

		$scope.back = function (){
			$ionicHistory.goBack();
		}
}]);