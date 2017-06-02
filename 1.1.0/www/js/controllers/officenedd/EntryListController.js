/**
 * 入驻通知
 */
app.controller('EntryListCtrl',
	['$scope', '$window', '$state','$rootScope','$ionicHistory','OfficeBookService','$CommonFactory',
		function ($scope, $window,$state, $rootScope,$ionicHistory,OfficeBookService,$CommonFactory) {

			$scope.id = $state.params.id;
			$scope.accesstoken = $rootScope.getAccessToken();
			//默认不显示确认按钮
			$scope.buttonShow = false;
			$scope.getEntryList = function(){
				var data = {
					accesstoken : $scope.accesstoken,
					contract_id : $scope.id
				}
				$CommonFactory.showLoading();
				OfficeBookService.getEntryList(data,function(response){
					$CommonFactory.hideLoading();
					if (response.statuscode == 1) {
						$scope.entryList = response.data;
						for(var i = 0;i < $scope.entryList.checkin_list_data.length;i++){
							if ($scope.entryList.checkin_list_data[i].type == '3' && $scope.entryList.checkin_list_data[i].status != '2') {
								$scope.buttonShow = true;
							}
							else{
								$scope.buttonShow = false;
							}
						}
					}
				})
			}
			$scope.getEntryList();

			$scope.check = function(){
				$CommonFactory.showConfirm($scope.sure,"你已确认过列表内容并无异议？");
			}
			
			$scope.sure = function(){
				var data = {
					accesstoken : $scope.accesstoken,
					contract_id : $scope.id
				}
				OfficeBookService.sure(data,function(response){
					if (response.statuscode == '1') {
						$CommonFactory.showAlert("操作成功");
						$scope.getEntryList();
					}
					else{
						$CommonFactory.showAlert("操作失败");
					}
				})
			}

			$scope.back = function(){
				$ionicHistory.goBack();
			}
	}]);
