/*
 * 反馈表2控制器
 */
app.controller('Feedback2Ctrl',
	['$scope', '$window', '$ionicHistory', '$rootScope', "$state", '$CommonFactory', '$filter', '$stateParams', 'UserService',
	function ($scope, $window, $ionicHistory, $rootScope, $state,  $CommonFactory, $filter, $stateParams, UserService) {

		var accesstoken = $rootScope.getAccessToken();
		$scope.test = {};
	
		//上传用户反馈
		$scope.uploadInfoClick = function(){			
			if (!$scope.test.com_name) {
				$CommonFactory.showAlert("请填写完整公司名称");
				return;
			}
			if (!$scope.test.name) {
				$CommonFactory.showAlert("请填写联系人姓名");
				return;
			}
			if ($scope.test.name) {
					if(!(/^.{4,20}|[\u4E00-\u9FA5]{2,16}$/.test($scope.test.name))){
					$CommonFactory.showAlert("联系人姓名格式不对！");
					return;
				}
			}
			if (!$scope.test.mobile) {
				$CommonFactory.showAlert("请填联系人电话");
				return;
			}
			if ($scope.test.mobile) {
				if (!(/^1[3|4|5|7|8]\d{9}$/.test($scope.test.mobile))) {
				$CommonFactory.showAlert("联系人电话有误！");
				return;
				}
			}
			var data = {
				"accesstoken": accesstoken,
				'com_name':$scope.test.com_name,//公司名称
				'name':$scope.test.name,//姓名
				'mobile':$scope.test.mobile,//手机号
				
			};

			UserService.uploadInfo2(data, function (response) {
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
