/**
 * 保洁申请
 */
app.controller('ExpressCtrl',
	['$scope', '$window', '$rootScope','$ionicModal','$CommonFactory','$ionicHistory','$ionicPopup','WorkOrderService','$filter',
		function ($scope, $window, $rootScope,$ionicModal,$CommonFactory,$ionicHistory,$ionicPopup,WorkOrderService,$filter) {
			$scope.modal = {};
			$scope.item = {};
			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.user = $rootScope.getCurrentUser();


			//私密开放选择
			$scope.expressClick = function() {
				$scope.modal.title="选择快递"
				$scope.modal.time = true;
				$scope.openModal();
			}
			//私密开放确认
			$scope.expressSelect = function(str) {
				$scope.item.excompany = str;
				$scope.closeModal();

			}

			//选择日期
			$scope.dateClick = function() {
				$CommonFactory.showDatePicker(function(date){
					$scope.item.date = date;
					//console.log(date)
				});
			}

			$scope.saveForm = function(){
				if(!$scope.item.excompany){
					$CommonFactory.showAlert("请填写快递公司!");
					return;
			}
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
					'title':'快递',
					'body':'寄件日期:'+$scope.item.date +","+'快递:'+$scope.item.excompany+','+ '留言:'+$scope.item.content,
					'sub_category_id':'6'
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

			$ionicModal.fromTemplateUrl('select.html', {
				scope: $scope,
				animation: 'slide-in-right'
			}).then(function(modal) {
				$scope.modal = modal;
			});
			$scope.openModal = function() {
				$scope.modal.show();
			};
			$scope.closeModal = function() {
				$scope.modal.hide();
			};
			//当我们用到模型时，清除它！
			$scope.$on('$destroy', function() {
				$scope.modal.remove();
			});
			// 当隐藏的模型时执行动作
			$scope.$on('modal.hide', function() {
				// 执行动作
			});
			// 当移动模型时执行动作
			$scope.$on('modal.removed', function() {
				// 执行动作
			});

			$scope.back = function(){
				$ionicHistory.goBack();
			}
	}]);
