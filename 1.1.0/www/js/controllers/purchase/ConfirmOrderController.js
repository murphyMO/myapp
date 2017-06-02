/*
 * 下单的控制器
 */

app.controller('ConfirmOrderCtrl',
	['$scope','$rootScope','$localStorage','$stateParams','$state','PurchaseService','$ionicLoading','$ionicModal','$CommonFactory',
	function ($scope,$rootScope,$localStorage,$stateParams,$state,PurchaseService,$ionicLoading,$ionicModal,$CommonFactory) {

	$scope.accesstoken = $rootScope.getAccessToken();
	var user = $rootScope.getCurrentUser();
	$scope.path = $localStorage.getObject(KEY_COMMON_PATH);
	$scope.selectPaymentMethodResult = "";
	$scope.isDiscount = false;

	$scope.targetId = $stateParams.data.targetId;
	$scope.getPayment = function(){
		var data = {
			accesstoken:$scope.accesstoken,
			id:$scope.targetId
		}
		PurchaseService.getPayment(data,function(response){
			$scope.order = response.data;
			for(var j = 0;j < $scope.order.pay_method.length;j++){
				$scope.order.pay_method[j].checked = false;
			}
			
			//初始单价
			for(var i = 0;i < $scope.order.order_items.length;i++){
				if ($scope.order.order_items[i].room_type == 2) {
					$scope.order.order_items[i].unit_price_ary = $scope.order.order_items[i].unit_price.split("#")
					$scope.order.order_items[i].fourHoursAgoPrice = $scope.order.order_items[i].unit_price_ary[0];
					$scope.order.order_items[i].fourHoursAfterPrice = $scope.order.order_items[i].unit_price_ary[1];
				}
				$scope.order.order_items[i].reserve_time_from = $scope.order.order_items[i].reserve_time_from.slice(0,-3);
				$scope.order.order_items[i].reserve_time_to = $scope.order.order_items[i].reserve_time_to.slice(11,-3);
			}
			console.log($scope.order)
		})
	}
	$scope.getPayment();
	$scope.clickPay = function(){
		if ($scope.selectPaymentMethodResult == '') {
			$CommonFactory.showAlert("请选择付款方式")
			return;
		}
		if ($scope.payMethodId == 1) {
			var data = {
				accesstoken : $scope.accesstoken,
				pay_method : $scope.payMethodId,
				id : $scope.targetId
			}
			PurchaseService.pay(data,function(response){
				if (response.statuscode == 1) {
					$CommonFactory.showConfirm($scope.alipay,"你已确认过订单细节并已阅读并同意购买须知所有信息");
				}
			})
		}
		else if ($scope.payMethodId == 2 && $scope.isDiscount == false) {
			var data = {
				accesstoken : $scope.accesstoken,
				pay_method : $scope.payMethodId,
				id : $scope.targetId
			}
			PurchaseService.pay(data,function(response){
				if (response.statuscode == 1) {
					$scope.goTo();
				}
			})
		}
		else if ($scope.payMethodId == 2 && $scope.isDiscount) {
			var data = {
				accesstoken : $scope.accesstoken,
				pay_method : 3,
				id : $scope.targetId
			}
			PurchaseService.pay(data,function(response){
				if (response.statuscode == 1) {
					$scope.goTo();
				}
			})
		}
		
	}
	$scope.goTo = function(){
		if($scope.order.store_id == 5 && $scope.order.room_type != 2){
			$state.go('intelligoo',{'from' : $state.current.name});
		}else{
			if ($scope.payMethodId == 2) {
				$state.go('companyBillList');
			}
			else if ($scope.payMethodId == 1 && $scope.order.order_info.is_personal == 1) {
				$state.go('mineorderslist',{'from' : $state.current.name});
			}
			else if ($scope.payMethodId == 1 && $scope.order.order_info.is_personal == 0) {
				$state.go('companyBillList');
			}
		}
	}
	$scope.alipay = function(){
		var myDate = new Date();
		var tradeNo = myDate.getTime();

		var alipayClass = navigator.alipay;
		var rsa ="MIICeQIBADANBgkqhkiG9w0BAQEFAASCAmMwggJfAgEAAoGBANkgv5pHr7tAJ1SxSJsxDDQhSGP+WMgWbrXngT4YF6V6K2OlAZpQBETOR0zhLXKngz41oHcVA+OHdT3Q6u01tGoK+9AdBfgnMDgk+D3AG1Jh7Y9fOAwjbgF1h3vjRz0PtswzsPEop5qeIeRdCtYwRH64FV4no6khYkOjinEIU7/1AgMBAAECgYEAyQlRXn/RbgbQY9Jh749SRVIrvKnbeieLClH3kI6uFkEvu2skOMStrydvTPeRJP+EvSzaDmge2aSqITo2yrtW9sLsJhsiFQcZ3QJJUs5IItW7r4bSDVISEVedqXmpMdKjCe7tIYIma3bKAO/YsqQzoZj+NW5N9rq3R0jOkxtSoAECQQD8UuIU8U7PIx6E9JlNL7YFoDyaqAc2R1u5k5+EanQKMKLNxrw4fa2NqkwjmK1fWbiwc6vP9qp/maMkD/jbb8EBAkEA3EqXh/7bmAwjQqH60aWBb7cK3jTf4mMUqoHyeu6OpnYTuMbvcr760Awqupp7LmFiG5zpIoD/ABeHJpZ3UtYK9QJBAKToRnoJe8hE251pfwfDNuNWZkVtq8j9uiT/JjIUoOJIBx8V083X1aXQtxJMpoK60MoBzziLrcLXVpgrGCnSUAECQQDA17+dOrrLeNypKRljy4nq3QbzjL/s86WUuhsmCI3yJO2Q1P2qqorv86a4IiHxcSisWYkxPlF8qBwU6KVea6e9AkEA2qRq5VElCGtTL1agbr91vzKtzfj//xc0bKyoAFjaWlnG4jLC7PrZb9cU43L+nnufkb9TCANEl8sUOIvJkzN5qw==";
		var pubRsa="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDZIL+aR6+7QCdUsUibMQw0IUhj/ljIFm6154E+GBeleitjpQGaUAREzkdM4S1yp4M+NaB3FQPjh3U90OrtNbRqCvvQHQX4JzA4JPg9wBtSYe2PXzgMI24BdYd740c9D7bMM7DxKKeaniHkXQrWMER+uBVeJ6OpIWJDo4pxCFO/9QIDAQAB";

		var data = {
			"partner":"2088121651201573",	//商户ID
			"rsa_private":rsa,				 //私钥
			"rsa_public":pubRsa,				//公钥
			"seller":"2088121651201573",	//收款支付宝账号或对应的支付宝唯一用户号
			"subject":$scope.order.order_items[0].meeting_room_name,			 //商品名称
			"body":tradeNo+'#'+'支付宝',		//商品详情
			"price":$scope.order.order_info.to_pay,					//金额$scope.order.to_pay
			"tradeNo":$scope.order.order_info.order_sn,
			"timeout":"30m",				 //超时设置
			"notifyUrl":$scope.order.notifyUrl,
			'store_id': $scope.order.order_items[0].store_id,
			"order_id" : $scope.targetId,
			"pay_method" : $scope.payMethodId

		}
		alipayClass.pay(data,function(result){
			data.return_string = result;
			data.order = $scope.order;
			data.accesstoken = $scope.accesstoken;
			var resultStatus = result.split('#')[0];
			if(resultStatus==9000){
				$scope.goTo();
			}
			PurchaseService.sendData(data,function(response){
			})
		},function(message){
			$ionicLoading.show({
			template:"支付宝支付失败＝" + message,
			noBackdrop: true,
			duration: 500
			});
		});

	};
	$scope.weixinpay = function(){
		var params = {
		partnerid: '1300406001', // merchant id
		prepayid: 'wx20160921214129d9c7d891b90074703749', // prepay id
		noncestr: 'MgVhLlzq7gG22fPw', // nonce
		timestamp: '1439531364', // timestamp
		sign: 'AE990C36EF3FE0BC80CBAB4FDE2B85C1', // signed string
	};

	Wechat.sendPaymentRequest(params, function () {
		alert("Success");
	}, function (reason) {
		alert("Failed: " + reason);
	});
	}



		// 触发一个按钮点击，或一些其他目标
		$ionicModal.fromTemplateUrl('templates/modal/select_payment_method.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		$scope.selectPaymentMethod = function() {
			$scope.modal.show();
		};
		$scope.closeModal = function() {
			$scope.modal.hide();
		};

		$scope.selectItem = function(item){
			$scope.closeModal();
			if (item.checked == false) {
				for(var i = 0;i < $scope.order.pay_method.length;i++){
					$scope.order.pay_method[i].checked = false;
				}
				item.checked = true;
				$scope.selectPaymentMethodResult = item.pay_text;
				$scope.payMethodId = item.pay_id;
			}
		}

		$scope.clickDiscount = function(){
			$scope.isDiscount = !$scope.isDiscount;
		}

		//跳转返回
		$scope.topBack = function(){
			window.history.back();
			// $state.go('conferenceRoomList',{'store_id':'-1','from':$state.current.name});
		}


}]);
