app.controller('CompanySettingCtrl',
	['$scope', '$rootScope', "$state", 'SettingSafetyService','$localStorage','$CommonFactory',
		function ($scope, $rootScope, $state, SettingSafetyService, $localStorage, $CommonFactory) {
		var accesstoken = $rootScope.getAccessToken();
		$scope.personlist = [];

		$scope.comObj = $localStorage.getObject('comObj_localstorage');

		//查询客服列表
		$scope.getpersonlist = function() {
			var data = {
				accesstoken : accesstoken
			};
			SettingSafetyService.getpersonlist(data, function (res) {
				$scope.personlist = res.data;
			});
		};
		$scope.getpersonlist();

		//删除
		$scope.deletePersonal = function(item) {
			var data = {
				accesstoken: accesstoken,
				id: item.com_staff_id
			};
			SettingSafetyService.deletePerson(data, function (res) {
				//$.toast(res.message, "text");
				$scope.getpersonlist();
			});
		}
			//团队不能设置客服提示
		$scope.department = function(){
			if ($scope.comObj.com_title_type == 1) {
				$CommonFactory.showConfirm(function(){
					$state.go("comaptitudemsg");
				},'请完善信息升级成为企业用户');
			}else{
				$state.go("department");
			}
		}



}]);
