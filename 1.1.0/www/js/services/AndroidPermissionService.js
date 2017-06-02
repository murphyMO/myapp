/*
	安卓权限请求
	依赖cordova插件 cordova-plugin-android-permissions
	permissionList 权限列表
	requestPermission 请求permissionList列表中的权限
*/
angular.module('AndroidPermissionService',[])
	.factory('AndroidPermissionService', function($ionicPlatform) {
	var AndroidPermission = {};
	AndroidPermission.permissionList = [
		'android.permission.ACCESS_FINE_LOCATION',
		'android.permission.READ_EXTERNAL_STORAGE',
		'android.permission.WRITE_EXTERNAL_STORAGE',
		'android.permission.RECORD_AUDIO'
	];

	AndroidPermission.requestPermission = function() {
		$ionicPlatform.ready(function() {
			if (device.platform == "Android") {
				var permissions = cordova.plugins.permissions;
				var temp = AndroidPermission.permissionList;
				var errorCounts = 0;
				function errorCallback (error) {
					errorCounts ++;
					// console.log(errorCounts+"error,"+temp[0]);
					if (errorCounts < 3) {
						doRequest();
					}
				}
				function successCallback (success){
					// console.log('success'+temp[0]);
				}
				function doRequest () {
					len = temp.length;
					if (len){
						permissions.requestPermissions(temp,successCallback,errorCallback);
					}
				}
				doRequest();
			}
		});
	};
	return AndroidPermission;
	});