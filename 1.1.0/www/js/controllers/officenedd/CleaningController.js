/**
 * 保洁申请
 */
app.controller('CleaningCtrl',
	['$scope', '$window', '$rootScope','$ionicModal','$CommonFactory','WorkOrderService','$ionicHistory','$ionicPopup','$filter',
		function ($scope, $window, $rootScope,$ionicModal,$CommonFactory,WorkOrderService,$ionicHistory,$ionicPopup,$filter) {
			$scope.modal = {};
			$scope.item = {};
			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.user = $rootScope.getCurrentUser();

			$scope.getAllIsland = function(){
				var data = {
					'accesstoken':$scope.accesstoken,
				}
				WorkOrderService.getAllIsland(data,function(response){
					if (response.statuscode == 1) {
						$scope.allIsland = response.data;
					}
				})
			}
			$scope.getAllIsland();

			//选择岛
			$scope.clickIsland = function(){
				$scope.modal.title="选择所在岛"
				$scope.modal.time = false;
				$scope.modal.island = true;
				$scope.openModal();
			}
			//选择岛确认
			$scope.selectIsland = function(str) {
				$scope.item.island = str;
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
				if(!$scope.item.island){
					$CommonFactory.showAlert("请填写所在岛!");
					return;
				}
				if(!$scope.item.number){
					$CommonFactory.showAlert("请输入工位号!");
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
				if ($scope.item.number) {
					var gwReg = /^[a-zA-Z0-9]{1,15}$/ ;
					if (!gwReg.test($scope.item.number)) {
						$CommonFactory.showAlert("工位格式不正确！");
						return;
					}
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
					'title':'保洁申请',
					'body':'所在岛：'+$scope.item.island+','+'工位：'+$scope.item.number+','+'日期:'+$scope.item.date +','+ '留言:'+$scope.item.content,
					'sub_category_id':'1'
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
