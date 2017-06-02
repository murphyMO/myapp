/**
 * 单个订单详情-控制器
 */
app.controller('CompanyBillDetailCtrl',
	['$scope', '$rootScope', 'CompanyBillService','$stateParams','$state','$ionicPopup','$CommonFactory','$localStorage','$cordovaToast','$ionicModal',
	function($scope, $rootScope, CompanyBillService, $stateParams,$state,$ionicPopup,$CommonFactory,$localStorage,$cordovaToast,$ionicModal) {
		var accesstoken = $rootScope.getAccessToken();
		//$scope.color = false
		//$scope.text = "取消订单";
		$scope.item = [];
		$scope.order_id = $stateParams.order_id;
		$scope.dateFromAry = []; 
		//获取单个订单详情
		$scope.getOrderDetail = function(){
			var data = {
				"accesstoken" : accesstoken,
				"order_id" : $scope.order_id
			};
			CompanyBillService.orderDetail(data,function(response){
				if (response.statuscode == 1) {
					$scope.order = response.data;
					//系统当前时间
					var now = $scope.order.sys_time.replace(/\-/g, "/");
					//订单创建时间
					var creTime = $scope.order.order_info.cre_time.replace(/\-/g, "/");
					var nowdate = new Date(now).getTime();
					var orderCreTime = new Date(creTime).getTime();
					//初始单价
					for(var i = 0;i < $scope.order.order_items.length;i++){
						if ($scope.order.order_items[i].room_type == 2) {
							$scope.order.order_items[i].unit_price_ary = $scope.order.order_items[i].unit_price.split("#")
							$scope.order.order_items[i].fourHoursAgoPrice = $scope.order.order_items[i].unit_price_ary[0];
							$scope.order.order_items[i].fourHoursAfterPrice = $scope.order.order_items[i].unit_price_ary[1];
						}
						//开始时间和结束时间转成毫秒
						$scope.order.order_items[i].date_from = new Date($scope.order.order_items[i].reserve_time_from.replace(/\-/g, "/")).getTime();
						$scope.order.order_items[i].date_to = new Date($scope.order.order_items[i].reserve_time_to.replace(/\-/g, "/")).getTime();
						//剪切开始和结束时间
						$scope.order.order_items[i].reserve_time_from = $scope.order.order_items[i].reserve_time_from.slice(0,-3);
						$scope.order.order_items[i].reserve_time_to = $scope.order.order_items[i].reserve_time_to.slice(11,-3);

						$scope.dateFromAry.push($scope.order.order_items[i].date_from)
						
					}
					//判断后台返回的当前系统时间-预定开始时间
					$scope.dateFromAry.sort(function(a,b){
							return a-b;
						})
					if($scope.dateFromAry[0] - nowdate > 0){
						//如果大于，可以退款
						$scope.cancelButtonShow = true;
					}else{
						$scope.cancelButtonShow = false;
					}
					//判断当前时间-创建时间大于15分钟，则不能支付
					if(nowdate - orderCreTime > 1000 * 60 * 15){
						$scope.payButtonShow = false;
					}else{
						$scope.payButtonShow = true;
					}

					//延时
					if ($scope.order.order_items[0].date_to - nowdate > 0 && $scope.order.order_items[0].date_from - nowdate < 0) {
						$scope.delayedButtonShow = true;
					}
					else{
						$scope.delayedButtonShow = false;
					}
					//结束
					if ($scope.order.order_items[0].date_from - nowdate < 0 && $scope.order.order_items[0].date_to - nowdate > 0) {
						$scope.overButtonShow = true;
					}
					else{
						$scope.overButtonShow = false;
					}
					//修改成功后把orderListItem替换成新的值
					$scope.companyBillListItem = $localStorage.getObject('companyBillListItem');
					$scope.companyBillListItem.status_text = $scope.order.order_info.status_text;
					$scope.companyBillListItem.status = $scope.order.order_info.status;
					$localStorage.setObject('companyBillListItem',$scope.companyBillListItem);
				}
			});
		}
		// 加载数据
		$scope.getOrderDetail();
		// 点击结束，判断时效性
		$scope.over = function(){
			$scope.checkTime('over');
		}
		// 确定结束
		$scope.goToOver = function(){
			var data = {
				"accesstoken" : accesstoken,
				'order_id' : $scope.order_id,
				'status' : 7,
			}
			CompanyBillService.changeStatus(data,function(response){
				$cordovaToast.show(response.message, "short", "center");
				if (response.statuscode == 1) {
					
					$scope.order.order_info.status_text = response.data.status_text;
					$scope.order.order_info.status = response.data.status;

					//修改成功后把orderListItem替换成新的值
					$scope.companyBillListItem = $localStorage.getObject('companyBillListItem');
					$scope.companyBillListItem.status_text = $scope.order.order_info.status_text;
					$scope.companyBillListItem.status = $scope.order.order_info.status;
					$localStorage.setObject('companyBillListItem',$scope.companyBillListItem);
				}
			})
		}

		//弹出提示确认退款，判断时效性
		$scope.cancel = function(){
			$scope.checkTime('cancel');
		}


		// 触发一个按钮点击，或一些其他目标
		$ionicModal.fromTemplateUrl('templates/modal/cancel_modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		$scope.openModal = function() {
			$scope.modal.show();
		};
		$scope.closeModal = function() {
			$scope.modal.hide();
		};

		$scope.cancelSure = function(){
			$scope.goto();
		}
		// 确定申请退款
		$scope.goto = function(){
			$scope.closeModal();
			var data = {
				"accesstoken" : accesstoken,
				'order_id' : $scope.order_id,
				'status' : 4,
			}
			CompanyBillService.changeStatus(data,function(response){
				$cordovaToast.show(response.message, "short", "center")
				if (response.statuscode == 1) {
					$scope.order.order_info.status_text = response.data.status_text;
					$scope.order.order_info.status = response.data.status;

					//修改成功后把orderListItem替换成新的值
					$scope.companyBillListItem = $localStorage.getObject('companyBillListItem');
					$scope.companyBillListItem.status_text = $scope.order.order_info.status_text;
					$scope.companyBillListItem.status = $scope.order.order_info.status;
					$localStorage.setObject('companyBillListItem',$scope.companyBillListItem);
				}
			})
		}

		//弹出提示确认延时，判断时效性
		$scope.delayed = function(){
			$scope.checkTime('delayed');
		}

		// 确定延时
		$scope.goToDelayed = function(){
			if ($scope.order.order_items[0].room_type == 1) {
				$localStorage.setObject("conference_item",$scope.order.order_items[0])
				$state.go("conferenceRoomBook",{from:"mineorderdetail",parent_order_id:$scope.order.order_info.order_id});
			}
			else if ($scope.order.order_items[0].room_type == 2){
				$localStorage.setObject("space_item",$scope.order.order_items[0])
				$state.go("spaceRoomBook",{from:"mineorderdetail",parent_order_id:$scope.order.order_info.order_id});
			}
		}

		// 立即支付，判断时效性
		$scope.pay = function(){
			$scope.checkTime('pay');
		}

		$scope.checkTime = function(type){
			$CommonFactory.showLoading();
			var data = {
				"accesstoken" : accesstoken,
				"order_id" : $scope.order_id
			};
			CompanyBillService.orderDetail(data,function(response){
				$CommonFactory.hideLoading();
				if (response.statuscode == 1) {
					$scope.order = response.data;
					//系统当前时间
					var now = $scope.order.sys_time.replace(/\-/g, "/");
					//订单创建时间
					var creTime = $scope.order.order_info.cre_time.replace(/\-/g, "/");
					var nowdate = new Date(now).getTime();
					var orderCreTime = new Date(creTime).getTime();
					//初始单价
					for(var i = 0;i < $scope.order.order_items.length;i++){
						if ($scope.order.order_items[i].room_type == 2) {
							$scope.order.order_items[i].unit_price_ary = $scope.order.order_items[i].unit_price.split("#")
							$scope.order.order_items[i].fourHoursAgoPrice = $scope.order.order_items[i].unit_price_ary[0];
							$scope.order.order_items[i].fourHoursAfterPrice = $scope.order.order_items[i].unit_price_ary[1];
						}
						//开始时间和结束时间转成毫秒
						$scope.order.order_items[i].date_from = new Date($scope.order.order_items[i].reserve_time_from.replace(/\-/g, "/")).getTime();
						$scope.order.order_items[i].date_to = new Date($scope.order.order_items[i].reserve_time_to.replace(/\-/g, "/")).getTime();
						//剪切开始和结束时间
						$scope.order.order_items[i].reserve_time_from = $scope.order.order_items[i].reserve_time_from.slice(0,-3);
						$scope.order.order_items[i].reserve_time_to = $scope.order.order_items[i].reserve_time_to.slice(11,-3);

						$scope.dateFromAry.push($scope.order.order_items[i].date_from)
						if (type == "delayed") {
							//延时
							if ($scope.order.order_items[i].date_to - nowdate > 0 && $scope.order.order_items[i].date_from - nowdate < 0) {
								$CommonFactory.showConfirm($scope.goToDelayed,"你是否真的想要延时？");
							}
							else{
								$CommonFactory.showAlert("预约的时间已结束，不能延时")
							}
						}
						if (type == "over") {
							//结束
							if ($scope.order.order_items[i].date_from - nowdate < 0 && $scope.order.order_items[i].date_to - nowdate > 0) {
								$CommonFactory.showConfirm($scope.goToOver,"确认结束订单吗？");
							}
							else{
								$CommonFactory.showAlert("预订时间已结束，订单已自动结束")
							}
						}
					}
					if (type == "cancel") {
						//判断后台返回的当前系统时间-预定开始时间
						$scope.dateFromAry.sort(function(a,b){
								return a-b;
							})
						if($scope.dateFromAry[0] - nowdate > 0){
							//如果大于，可以退款
							$scope.openModal();
						}else{
							$CommonFactory.showAlert("预约的时间已开始，不能退款")
							$scope.closeModal();
						}
					}
					if (type == "pay") {
						//判断当前时间-创建时间大于15分钟，则不能支付
						if(nowdate - orderCreTime > 1000 * 60 * 15){
							$CommonFactory.showAlert("订单创建时间已过15分钟，不能支付，请重新下单")
						}else{
							$state.go("confirmOrder",{data:{targetId:$scope.order_id}})
						}
					}
				}
			});
		}

		//跳转返回
		$scope.myBack = function(){
			window.history.back();
		}

}]);
