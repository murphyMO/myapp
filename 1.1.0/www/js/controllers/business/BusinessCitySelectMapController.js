/**
 * 城市选择控制器
 */
app.controller('BusinessCitySelectMapCtrl',
	['$scope', '$localStorage', '$state','$rootScope', '$ionicHistory','$ionicPlatform','$CommonFactory',
	function ($scope, $localStorage, $state,$rootScope, $ionicHistory,$ionicPlatform,$CommonFactory) {
		
		// 百度地图API功能
		var map = new BMap.Map("mapContainer");
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 4);
		map.enableScrollWheelZoom();

		var dao = [
				{ "name":"节能岛" , "lon":"104.072686" ,"lat":"30.555246"},
				{ "name":"磨子桥岛" , "lon":"104.08084" ,"lat":"30.639036"},
				{ "name":"航天岛" , "lon":"104.073291" ,"lat":"30.659123"},
				{ "name":"菁蓉岛" , "lon":"104.069539" ,"lat":"30.544393"},
				// { "name":"婚家岛" , "lon":"www.google.com" ,"lat":""}, 
				// { "name":"银河岛" , "lon":"www.google.com" ,"lat":""},
				{ "name":"望京岛" , "lon":"116.490307" ,"lat":"40.012778"},
				{ "name":"金山岛" , "lon":"106.572608" ,"lat":"29.648647"}
				]

		var markers = [];
		var pt = null;
		
		for (var i = 0; i < dao.length; i++) {
			pt = new BMap.Point(dao[i].lon, dao[i].lat);
			markers.push(new BMap.Marker(pt));
		}
		var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});



		//返回
		$scope.topBack = function() {
			window.history.back();
			// $state.go("tab.business");
		}
	}
]);