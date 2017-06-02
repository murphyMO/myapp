/**
 * 参加活动信息表格控制器
 */
app.controller('activityEntryFormCtrl',
	['$scope','$rootScope','$CommonFactory', '$state',
		function ($scope,$rootScope,$CommonFactory, $state) {
			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.activityEntryForm={};

			//保存登记信息
			$scope.saveActivityFormClick = function() {
				if (!$scope.entry.name){
					$CommonFactory.showAlert("请填写姓名！");
					return;
				}
				if(!$scope.entry.phone){
					$CommonFactory.showAlert("请输入联系电话!");
					return;
				}
				if(!$scope.entry.number){
					$CommonFactory.showAlert("请输入参与人数!");
					return;
				}

			}

		}]);