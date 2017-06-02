/*
 * 反馈表2控制器
 */
app.controller('XiaKeYuCtrl',
	['$scope', '$window', '$ionicHistory', '$rootScope', "$state", '$CommonFactory', '$filter', '$stateParams', 'UserService',
	function ($scope, $window, $ionicHistory, $rootScope, $state,  $CommonFactory, $filter, $stateParams, UserService) {

		var accesstoken = $rootScope.getAccessToken();
		$scope.item = {};

		//选择日期
			$scope.dateClick = function() {
				$CommonFactory.showDatePicker(function(date){
					$scope.item.lease_time = date;
					//console.log(date)
				});
			}

		//上传用户反馈
		$scope.uploadInfoClick = function(){
			if (!$scope.item.com_name) {
				$CommonFactory.showAlert("请填写完整公司名称");
				return;
			}
			if (!$scope.item.name) {
				$CommonFactory.showAlert("请填写姓名");
				return;
			}
			if ($scope.item.name) {
					if(!(/^.{4,20}|[\u4E00-\u9FA5]{2,16}$/.test($scope.item.name))){
					$CommonFactory.showAlert("姓名格式不对！");
					return;
				}
			}
			if (!$scope.item.mobile) {
				$CommonFactory.showAlert("请填联系方式");
				return;
			}
			if ($scope.item.mobile) {
				if (!(/^1[3|4|5|7|8]\d{9}$/.test($scope.item.mobile))) {
				$CommonFactory.showAlert("联系方式有误！");
				return;
				}
			}
			var data = {
				"accesstoken": accesstoken,
				'com_name':$scope.item.com_name,
				'name':$scope.item.name,
				'mobile':$scope.item.mobile,
				'lease_time':$scope.item.lease_time

			};

			UserService.chuzu(data, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					$CommonFactory.showAlert("提交成功");
					$scope.back();
				}
			});
		}
		//返回
		$scope.back=function(){
			$state.go("tab.business");
		}
	}]);
