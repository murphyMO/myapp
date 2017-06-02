/*
 * 会员权限的控制器
 */

app.controller('memAuthorityCtrl',
	['$scope','$rootScope','$localStorage','$timeout','$stateParams','$state','UserService','$ionicModal','$sce','$ionicLoading','rongCloudService','PurchaseService','$ionicHistory','$CommonFactory',
	function ($scope,$rootScope,$localStorage,$timeout,$stateParams,$state, UserService,$ionicModal,$sce,$ionicLoading,rongCloudService,PurchaseService,$ionicHistory,$CommonFactory) {

	$scope.accesstoken = $rootScope.getAccessToken();
	$scope.userobj = $rootScope.getCurrentUser();
	$scope.user = [];//$rootScope.getCurrentUser();
	$scope.path = $localStorage.getObject(KEY_COMMON_PATH);
	//获取个人信息
	$scope.getMineMessage = function(){
		var data = {
			"accesstoken": $scope.accesstoken,
		};
//		UserService.userMine(data, function (response) {
//			if (response.statuscode == CODE_SUCCESS) {
//				$scope.user = response.data.userInfo;
//			}
//		});
		UserService.userIsManager(data, function (response) {
			if (response.statuscode == CODE_SUCCESS) {
				$scope.user = response.data.userInfo;
			}
		});
	}
	$scope.getMineMessage();

	//获取会员权限
	$scope.getTypeDatas = function(){
		var data = {
			accesstoken:$scope.accesstoken,
			fee:true
		}
		UserService.userTypeDatas(data,function(response){
			$scope.items = response.data;
			for(var i=0;i<$scope.items.length;i++){
				$scope.items[i].comments = $sce.trustAsHtml($scope.items[i].comments);
				if($scope.items[i].sort_id==1){
					$scope.items[i].img = 'img/newappIcons-08.png';
				}else if($scope.items[i].sort_id==2){
					$scope.items[i].img = 'img/newappIcons-09.png';
				}else if($scope.items[i].sort_id==3){
					$scope.items[i].img = 'img/newappIcons-10.png';
				}else if($scope.items[i].sort_id==4){
					$scope.items[i].img = 'img/newappIcons-21.png';
				}
			}
		})
	}
	$scope.getTypeDatas();
	// 触发一个按钮点击，或一些其他目标
	$ionicModal.fromTemplateUrl('templates/modal/upgradeMember.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});
	$scope.openModal = function(id) {
		if($rootScope.isGuest){
			$state.go('login');
		}else{
		$scope.modal.show();
		$scope.activeId = id?id:0;//初始化tab
		}
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

	$scope.setActive = function(id){
		$scope.activeId = id;
	}
	$scope.setActive();
	//联系小师妹
	$scope.chatWithXsm = function(){
		rongCloudService.getServiceId({accesstoken:$scope.accesstoken,store_id:'-1'},function(response){
			if(response.statuscode==CODE_SUCCESS){
				var data = {
					chat_user_id : response.data[0].user_id, //必传  对方id                       
					chat_user_name : response.data[0].user_name, // 必传 对方名字                       
					service_id : 0,//必传 服务（产品）id,没有则传0                       
					user_role : 'B',//必传   从联系人直接发起，则传'B' ‘A’卖方，'B' 买方                       
					user_face : response.data[0].user_face,//非必传 对方的头像                         
					is_xsm:  false,//非必传，是否从小师妹处点进来  true false                       
					from : $state.current.name //非必传  希望聊天页面返回到的页面的路由                   
				};
				$scope.closeModal();
				$state.go('chat',{data: data});
			}

		})
	}
	$scope.getDetailDatas = function(member_reserve_type){
		var data = {
			accesstoken:$scope.accesstoken
		}
		UserService.userTypeDetailDatas(data,function(response){
			$scope.typeDetail = response.data;
		})
	}
	$scope.getDetailDatas();
	$scope.alipay = function(name,text,member_reserve_type,user_type){
		$scope.ordertext = text;
		$scope.ordername = name;
		$scope.user_type = user_type;
		PurchaseService.getMemPayment({
			accesstoken:$scope.accesstoken,
			member_reserve_type:member_reserve_type
		},function(response){
			$scope.order = response.data;
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
				"subject":$scope.ordername+$scope.ordertext,			 //商品名称
				"body":tradeNo+'#'+'支付宝',		//商品详情
				"price":$scope.order.amount_original,					//金额$scope.order.amount_original
				"tradeNo":$scope.order.order_sn,
				"timeout":"30m",				 //超时设置
				"notifyUrl":$scope.order.notifyUrl
			}

			alipayClass.pay(data,function(result){
				data.return_string = result;
				data.order = $scope.order;
				data.accesstoken = $scope.accesstoken;
				var resultStatus = result.split('#')[0];
				if(resultStatus==9000){
					$scope.order = {"text":$scope.ordertext,"name":$scope.ordername}
					$scope.closeModal();
					$scope.getUserInfo();
				}
				PurchaseService.sendMemData(data,function(response){
				})
			},function(message){
				$ionicLoading.show({
				template:"支付宝支付失败＝" + message,
				noBackdrop: true,
				duration: 500
				});
			});
		})


		//设置会员信息
		$scope.getUserInfo = function(){
			var userData = {
				'accesstoken': $scope.accesstoken,
			};
			UserService.userMine(userData, function (response) {
				if (response.statuscode == CODE_SUCCESS) {
					//$scope.user = $rootScope.getCurrentUser();
					$scope.user.member_end_time = response.data.userInfo.member_end_time;
					$scope.user.user_type = response.data.userInfo.user_type;
					$rootScope.setCurrentUser($scope.user);
					$state.go("purchaseSuccess",{data:{order:$scope.order}});
				}
			});
		}

	};

	//返回
	$scope.myBack = function(){
		$ionicHistory.goBack();
	}
}]);
