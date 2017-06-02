/**
 * 维修申请-控制器
 */
app.controller('MaintenAppliCtrl',
	['$scope', '$window', '$rootScope','$ionicModal','WorkOrderService','$ionicHistory','$ionicPopup','$CommonFactory','$filter',
		function ($scope, $window, $rootScope,$ionicModal,WorkOrderService,$ionicHistory,$ionicPopup,$CommonFactory,$filter) {
			$scope.modal = {};
			$scope.item = {};
			$scope.item.imgs = [];
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
				$scope.modal.area = false;
				$scope.modal.item = false;
				$scope.modal.island = true;
				$scope.openModal();
			}
			//选择岛确认
			$scope.selectIsland = function(str) {
				$scope.item.island = str;
				$scope.closeModal();
			}
			//私密开放选择
			$scope.areaClick = function() {
				$scope.modal.title="选择区域"
				$scope.modal.area = true;
				$scope.modal.item = false;
				$scope.modal.island = false;
				$scope.openModal();
			}
			//私密开放确认
			$scope.areaSelect = function(str) {
				$scope.item.area = str;
				$scope.closeModal();
			}
			//报修项选择
			$scope.itemClick = function() {
				$scope.modal.title="选择保修项"
				$scope.modal.area = false;
				$scope.modal.item = true;
				$scope.modal.island = false;
				$scope.openModal();
			}
			//保修项确认
			$scope.itemSelect = function(str) {
				$scope.item.type = str;
				$scope.closeModal();
			}

			$scope.saveForm = function(){
				if(!$scope.item.island){
					$CommonFactory.showAlert("请填写所在岛!");
					return;
				}
				if(!$scope.item.number){
					$CommonFactory.showAlert("请填写工位号!");
					return;
				}
				if(!$scope.item.area){
					$CommonFactory.showAlert("请填写保修区域!");
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
				var imgPath = [];
				if($scope.item.imgs && $scope.item.imgs.length > 0){
					angular.forEach($scope.item.imgs,function(subitem){
						imgPath.push(subitem.img_path);
					});
				}else{
					imgPath = null;
				}
				var data = {
					'accesstoken':$scope.accesstoken,
					'title':'申请维修',
					'body':'所在岛：'+$scope.item.island+','+'工位：'+$scope.item.number+','+'保修区域:'+$scope.item.area+','+'保修项：'+$scope.item.type+','+ '留言:'+$scope.item.content,
					'sub_category_id':2,
					'imgPath' : imgPath
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
			//选择图片指令
			$scope.cameraOptions = {
				quality: 50,
				maximumImagesCount:9,
				width: 1280,
				height: 852,
				post_type: 21
			};

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
