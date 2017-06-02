/**
 * 城市选择控制器
 */
app.controller('BusinessCitySelectCtrl',
	['$scope', '$localStorage', '$state','$rootScope', '$ionicHistory','BusinessService','$ionicPlatform','$CommonFactory',
	function ($scope, $localStorage, $state,$rootScope, $ionicHistory,BusinessService,$ionicPlatform,$CommonFactory) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.loading = false;
		//选择城市
		$scope.citySelect = function(index, cityName) {
			var city = {
				city_id: index,
				city_name: cityName
			}
			$localStorage.setObject(KEY_CITY_SELECT, city);
			$rootScope.initXSM(index);
			$state.go("tab.business");
		}


		$scope.getLocationInfo = function(targetLongitude,targetLatitude){
			// 百度地图根据经纬度获取省市区
			var new_point = new BMap.Point($rootScope.locationInfo.longitude,$rootScope.locationInfo.latitude);
			var gc = new BMap.Geocoder();
			gc.getLocation(new_point, function(rs){
				var addComp = rs.addressComponents;
				$rootScope.locationInfo.province = addComp.province;
				$rootScope.locationInfo.city = addComp.city;
				$rootScope.locationInfo.district = addComp.district;
				$rootScope.locationInfo.street = addComp.street;
				$rootScope.locationInfo.streetNumber = addComp.streetNumber;
			});
		}


		$scope.getAllPosition = function(){
			var data = {
				'accesstoken' : $scope.accesstoken,
				'longitude' : $rootScope.locationInfo.longitude,
				'latitude' : $rootScope.locationInfo.latitude,
				// 'longitude' : '104.072686',
				// 'latitude' : '30.555246',
				'sort': 'distance'
			}
			
			BusinessService.getAllPosition(data,function(response){
				if (response.statuscode == 1) {
					$scope.stores = response.data
					for(var i = 0;i < $scope.stores.city.length;i++){
						for(var j = 0; j < $scope.stores.city[i].data.length;j++){
							// 如果没有获得经纬度，距离置空
							if (!$scope.stores.city[i].data[j].distance) {
								return;
							}
							// 距离大于一千米，显示单位km，
							if ($scope.stores.city[i].data[j].distance > 1000) {
								$scope.stores.city[i].data[j].distance = $scope.stores.city[i].data[j].distance/1000;
								$scope.stores.city[i].data[j].distance = $scope.stores.city[i].data[j].distance.toFixed(2) + "km";
							}
							// 小于一千米单位为m
							else{
								$scope.stores.city[i].data[j].distance = parseInt($scope.stores.city[i].data[j].distance) + "m";
							}
						}
					}
				}
			})
		}
		$scope.getAllPosition();
		$scope.$watch("locationInfo",function(newVal,oldVal){
			if (newVal != oldVal) {
				$scope.getLocationInfo()
				$scope.getAllPosition();
			}
		},true)


		//返回
		$scope.topBack = function() {
//			$ionicHistory.goBack();
			$state.go("tab.business");
		}
	}
]);