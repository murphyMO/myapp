/**
 * 离店登记
 */
app.controller('CheckOutRegCtrl',
	['$scope', '$window', '$rootScope','$ionicHistory','OfficeBookService','$stateParams',
		function ($scope, $window, $rootScope,$ionicHistory,OfficeBookService,$stateParams) {
			$scope.accesstoken = $rootScope.getAccessToken();
			$scope.user = $rootScope.getCurrentUser();
			$scope.CheckOutRegData = {};
			//物品及其他交接手续
			$scope.big_type_1 = [];
			//服务终结
			$scope.big_type_2 = [];
			//未结算费用
			$scope.tb_big_type_1 = [];
			//应退费用
			$scope.tb_big_type_2 = [];
			//合计
			$scope.allMoney = '';
			$scope.CheckOutRegId = $stateParams.id;
			//console.log($stateParams);
			//初始化数据
			$scope.getCheckOutRegData = function(){
				var data = {
					"accesstoken" : $scope.accesstoken,
					// 'accesstoken' : '822b47afd775d48cf30a9e4b0f73c33385',
					'id': $scope.CheckOutRegId
				};
				OfficeBookService.getCheckOutRegData(data,function(res){
					if(res.statuscode == 1){
						$scope.CheckOutRegData = res.data;
						//console.log($scope.CheckOutRegData);
						for (var item of $scope.CheckOutRegData.items) {
						  if(item.big_type == 1){
						  	$scope.big_type_1.push(item);
						  }
						  else if (item.big_type == 2){
						  	$scope.big_type_2.push(item);
						  }
						};
						for (var item of $scope.CheckOutRegData.moneys) {
						  if(item.big_type == 1){
						  	$scope.tb_big_type_1.push(item);
						  }
						  else if (item.big_type == 2){
						  	$scope.tb_big_type_2.push(item);
						  }
						  //合计金额
						  else if(item.big_type == 3){
						  	$scope.allMoney = item.money;
						  }
						};
						
					}
				})
			}
			$scope.getCheckOutRegData();
			
			//确认按钮事件
			$scope.IsCheckOutReg = function(out_store_id){
				//console.log(id);
				var data = {
					'accesstoken' : $scope.accesstoken,
					'id': out_store_id
				};
				OfficeBookService.isCheckOutReg(data,function(res){
					if(res.statuscode == 1){
						
						$scope.getCheckOutRegData();
					}
				})
			};

			//返回
			$scope.back = function(){
				$ionicHistory.goBack();
			};
			

	}]);
