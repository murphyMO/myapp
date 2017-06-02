/**
 * 城市选择
 */
app.controller('PersonalCityCtrl',
	['$scope', '$window', '$rootScope', '$stateParams', 'PersonalService','$CommonFactory', 'PersonalCityService', '$state', '$localStorage',
	function ($scope, $window, $rootScope, $stateParams, PersonalService, $CommonFactory, PersonalCityService, $state, $localStorage) {
	var accesstoken = $rootScope.getAccessToken();
	var province_name = $stateParams.province_name;
	
	//选择城市
	$scope.saveLocateCity = function(city){
		//var userObj = $localStorage.personalProfileInfo;
		var data = {
				"accesstoken": accesstoken,	
				locate_city : province_name + "-" + city.city_name,
				
			}
			
			PersonalService.setPersonMessage(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					//$CommonFactory.showAlert("修改成功!");
					$state.go("profile");
				}else{
					$CommonFactory.showAlert("操作失败，请重试!");
				}
			});
//		locate_city = province_name + "-" + city.city_name;
//		$localStorage.personalProfileInfo = userObj;
//		console.log(userObj.locate_city);
//		//console.log($localStorage.personalProfileInfo.locate_city);
//		$state.go("profile");
//		localStorage.removeItem(userObj.locate_city);
	}

	$scope.getCity = function(){
		var data = {
			"accesstoken" : accesstoken
		};
		PersonalCityService.getPersonalCity(data,function(response){
			$scope.areacity = response.data[province_name];
		});
	}
	$scope.getCity();
}]);