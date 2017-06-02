/**
 * 入驻通知
 */
app.controller('EntryNoticeCtrl',
	['$scope', '$window','$state', '$rootScope','$ionicHistory','OfficeBookService','$CommonFactory',
		function ($scope, $window,$state, $rootScope,$ionicHistory,OfficeBookService,$CommonFactory) {

			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.id = $state.params.id;
			$scope.getEntryNoticeDetail = function(){
				var data = {
					accesstoken : $scope.accesstoken,
					id : $scope.id
				}
				$CommonFactory.showLoading();
				OfficeBookService.getEntryNoticeDetail(data,function(response){
					$CommonFactory.hideLoading();
					if (response.statuscode == 1) {
						$scope.entryNoticeDetail = response.data;
					}
				})
			}
			$scope.getEntryNoticeDetail();

			$scope.goEntryLst = function(i){
				if (i.checkin_list_status == '1') {
					$CommonFactory.showAlert("小师妹正在新建入驻清单")
					return;
				}
				else if(i.checkin_list_status == '2'){
					$CommonFactory.showAlert("小师妹正在确认入驻清单")
					return;
				}
				$state.go("entryLst",{id : i.id})
			}

			$scope.back = function(){
				$ionicHistory.goBack();
			}
	}]);
