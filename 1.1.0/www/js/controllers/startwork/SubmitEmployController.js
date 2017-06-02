/**
 * 提交招聘信息需求
 */
app.controller('SubmitEmployController',
	['$scope', '$rootScope', "$state", '$window', '$timeout', 'BusinessService', '$CommonFactory', '$stateParams', '$localStorage','$ionicModal','$ionicPopup','$filter',
	function ($scope, $rootScope, $state, $window, $timeout, BusinessService, $CommonFactory, $stateParams, $localStorag, $ionicModal, $ionicPopup,$filter) {
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.user = $rootScope.getCurrentUser();
		$scope.item = {};
		$scope.modal = {};

		$scope.getAllIsland = function(){
				var data = {
					'accesstoken':$scope.accesstoken,
				}
				BusinessService.getAllIsland(data,function(response){
					if (response.statuscode == 1) {
						$scope.allIsland = response.data;
					}
				})
			}
			$scope.getAllIsland();

			//选择岛
			$scope.clickIsland = function(){
				$scope.modal.title="选择门店"
				$scope.modal.item = false;
				$scope.modal.island = true;
				$scope.openModal();
			}
			//选择岛确认
			$scope.selectIsland = function(str) {
				$scope.item.island = str;
				$scope.item.store_id = $scope.item.island.store_id;
				$scope.closeModal();
			}
	//提交审核信息
	$scope.submitemploy = function(){
		if(!$scope.item.com_name){
			$CommonFactory.showAlert("请填写公司名称!");
			return;
		}
		// if(!$scope.item.room_number){
		// 	$CommonFactory.showAlert("请填写房间号!");
		// 	return;
		// }
		if(!$scope.item.contact_name){
			$CommonFactory.showAlert("请填写联系人!");
			return;
		}
		if(!$scope.item.contact_phone){
			$CommonFactory.showAlert("请填写联系电话!");
			return;
		}
		if(!$scope.item.content){
			$CommonFactory.showAlert("请填写需求信息!");
			return;
		}
		if ($scope.item.contact_phone) {
			var owner_phoneReg = /^(1[3,4,5,7,8]{1}[\d]{9})|(((\d{3})-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/ || /^[\(（][(\d{4})\s\S]*[\)）][\(（][(\d{8})\s\S]*[\)）]$/;
			if (!owner_phoneReg.test($scope.item.contact_phone)) {
			$CommonFactory.showAlert("联系电话格式不正确！");
			return;
			}
		}
		// if ($scope.item.room_number) {
		// 	var gwReg = /^[a-zA-Z0-9]{1,15}$/ ;
		// 	if (!gwReg.test($scope.item.room_number)) {
		// 		$CommonFactory.showAlert("房间号格式不正确！");
		// 		return;
		// 	}
		// }

		var data = {
			'accesstoken':$scope.accesstoken,
			'com_name' : $scope.item.com_name,
			'room_number':$scope.item.room_number,
			'seat_number' : $scope.item.seat_number,
			'store_id': $scope.item.store_id,
			'contact_name' : $scope.item.contact_name,
			'contact_phone' : $scope.item.contact_phone,
			'content':$scope.item.content,
		}
		$CommonFactory.showLoading();
		BusinessService.submitemploy(data,function(response){
			$CommonFactory.hideLoading();
			if(response.statuscode==CODE_SUCCESS){
				$CommonFactory.showAlert("信息已提交");
				$state.go("employ");
				// $scope.back();
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


	$scope.ComBack = function(){
		// $ionicHistory.goBack();
		window.history.back();
		}


}]);
