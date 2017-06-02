/*
 * 个人信息控制器
 */
app.controller('payCtrl',
	['$scope','$ionicLoading' ,
		function ($scope,$ionicLoading) {
		$scope.alipay = function(){
	    alert("alipay demo");
	    var myDate = new Date();
	    var tradeNo = myDate.getTime();

	    var alipayClass = navigator.alipay;
	    var rsa ="MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAKKSatFYfHaFeJa4QlqoDbcY7blSVG72QxXKr2l5Uj2mYjTkEey+ELIAnZTDRYLL2YBtFa2qemjja0C9BX5IlxsKuTVwb7kvItaHuknUa78jLZ8zvisPJszS4TBKQS4QGoLw0FJsUPSd3P3JSYy/iRun1UFgU+lhHDdvVUDXgMvZAgMBAAECgYAvrCPqs7n7v3P3Lp02nGU5NfQwDfZ4e3p8n20EzvDQ50ORIvgmpi2bJRcQkpqFmmVzhYl/3af7rgS7fTJpL7wvWCxI8rWY9d09Uk4FktFQpbs2L8x18mMkdyeBiaVIZUDtMSGaffVtFAbhP8htGYD0l4OVcQZXKgvXV9Gpdm4lIQJBANE7/zkZLsun/eYbpqfQRf1CFn9MxrFT9Fx9T6WWgXl6D50dxPLBM+cis4qhCP+fWePd/FZ1Oc6mEFODcZJE0/UCQQDG6Huhk+1sRNq3J6hAarnfnVCp9tEo7OPH/nhTXzlvlD4fancaBojGBUT1++sDh2vQKlsQKQN9AGeWCcsc9Q3VAkAj09gyGMPQj6WEP3vcBGfXo/diOO1U9AFFzRdUTV9CQ8pkpvJQdxDCJUkFFeoKi2jDAgHxdAVAA2OMSVerKin5AkAMcAkbB2b3OC78+Ovaa1IIG4wptJdLmdR8cvsPK4sp4PkpebzM0c/Hohi30PLXG6awM5XSIt5m+JmBlkcvHlupAkBTrT4XFGKnW+KnccKeExvGw00vczto393A9W9HGpWIuiiV7gPBoFHcadwp4tyamHlcie+i8EWc5Xt1sPacTsbx";
	    var pubRsa="MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCikmrRWHx2hXiWuEJaqA23GO25UlRu9kMVyq9peVI9pmI05BHsvhCyAJ2Uw0WCy9mAbRWtqnpo42tAvQV+SJcbCrk1cG+5LyLWh7pJ1Gu/Iy2fM74rDybM0uEwSkEuEBqC8NBSbFD0ndz9yUmMv4kbp9VBYFPpYRw3b1VA14DL2QIDAQAB";
	    alipayClass.pay({
	      "partner":"2088121651201573",    //商户ID
	      "rsa_private":rsa,               //私钥
	      "rsa_public":pubRsa,                //公钥
	      "seller":"2088121651201573",    //收款支付宝账号或对应的支付宝唯一用户号
	      "subject":"共享停车",             //商品名称
	      "body":"共享停车支付宝支付",        //商品详情
	      "price":"0.01",                  //金额
	      "tradeNo":tradeNo,
	      "timeout":"30m",                 //超时设置
	      "notifyUrl":"http://www.baidu.com"
	    },function(resultStatus){
	      $ionicLoading.show({
	        template:"支付宝测试返回结果＝" + resultStatus,
	        noBackdrop: true,
	        duration: 500
	      });
	    },function(message){
	      $ionicLoading.show({
	        template:"支付宝支付失败＝" + message,
	        noBackdrop: true,
	        duration: 500
	      });
	    });
	  };
	}]);
