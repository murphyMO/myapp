/**
 * 上门服务
 */
app.controller('CleaningCtrl',
	['$scope', '$window', '$rootScope','$CommonFactory','WorkOrderService','$ionicHistory','$ionicPopup','$filter',
		function ($scope, $window, $rootScope,$CommonFactory,WorkOrderService,$ionicHistory,$ionicPopup,$filter) {
			$scope.modal = {};
			$scope.item = {};
			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.user = $rootScope.getCurrentUser();


			//选择日期
			$scope.dateClick = function() {
				$CommonFactory.showDatePicker(function(date){
					$scope.item.date = date;
					//console.log(date)
				});
			}

		$scope.saveForm = function(){
			if(!$scope.item.date){
				$CommonFactory.showAlert("请选择日期!");
				return;
		}
			if(!$scope.item.content){
				$CommonFactory.showAlert("请填写留言!");
				return;
		}
			if($scope.item.date) {
				date = $scope.item.date.replace(/-/g,"");
				var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
				if(date < nowDate){
					$CommonFactory.showAlert("日期低于今天,请重新选择!");
					return;
			}
		}
				var data = {
					'accesstoken':$scope.accesstoken,
					'title':'上门服务',
					'body':'日期:'+$scope.item.date +','+ '留言:'+$scope.item.content,
					'sub_category_id':'7'
				}
				$CommonFactory.showLoading();
				WorkOrderService.addWorkOrder(data,function(response){
					$CommonFactory.hideLoading();
					if(response.statuscode==CODE_SUCCESS){
						var alertPopup = $ionicPopup.alert({
							title: '信息',
							template: response.message
						 });
						 alertPopup.then(function(res) {
							$scope.back();
						 });
					}else{
						$CommonFactory.showAlert('出错了！');
					}

				})

			}

			$scope.back = function(){
				$ionicHistory.goBack();
			}
	}]);
