/**
 * 企业详情控制器
 */
app.controller('CompanyDetailCtrl', 
	['$scope', '$rootScope','$window','$state','$CommonFactory','CompanyService','CommonService','$localStorage','$ionicModal','$filter','$ionicActionSheet','$cordovaCamera',
	function($scope, $rootScope,$window,$state,$CommonFactory,CompanyService,CommonService,$localStorage,$ionicModal,$filter,$ionicActionSheet,$cordovaCamera){
	var accesstoken = $rootScope.getAccessToken();
	var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
	
	//根据公司ID获取详情信息
	$scope.companyOnes = function(){
		var data={
			'accesstoken': accesstoken
		};
		CompanyService.companyMine(data, function(response){
			if (response.statuscode == CODE_SUCCESS) {
				$scope.comObj = response.data;
				$scope.sendObj = angular.copy($scope.comObj);
				$scope.com_id = $scope.comObj.com_id; //公司列表传过来的ID
				$scope.img = ($scope.comObj.image_path==null) ? [] : JSON.parse($scope.comObj.image_path);
			}
		});
	}
	
	$scope.companyOnes();
	
	//跳转至编辑页面
	$scope.editComBase = function(type,from){		
		if(type == 'city_name'){
			var value = {};
			value.city_name = $scope.comObj[type];
			value.city_official_code = $scope.comObj['city_official_code'];
			value.provience_official_code = $scope.comObj['provience_official_code'];
			value.provienc_name = $scope.comObj['provience_name'];
		}else if(type == 'com_scale' || type == 'com_registered_assets'){
			var value = parseInt($scope.comObj[type]);
		}else{
			var value = $scope.comObj[type];
		}
		var data = {
			'type':type,
			'value':value,
			'from':from
		};
		$localStorage.setObject("comObj_localstorage",$scope.comObj);
		$state.go('commsgedit',data);
	}
	
	//时间选择弹窗
	$scope.showDate = function(item){
		$CommonFactory.showDatePicker(function(date){
			if(item == 'com_establish_time') {
				var com_establish_time = date.replace(/-/g,"");
				var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
				if(com_establish_time > nowDate){
					$CommonFactory.showAlert("企业成立时间超过今天,请重新选择!");
					return;
				}
			}
			if(item == 'com_start_time') {
				var com_start_time = date.replace(/-/g,"");
				var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
//				var end_time = ($scope.comObj.com_end_time ? ($scope.comObj.com_end_time).substring(0,10).replace(/-/g,'') : nowDate);
				if(com_start_time > nowDate){
					$CommonFactory.showAlert("起始时间超过今天,请重新选择!");
					return;
				}
//				if(com_start_time >= end_time){
//					$CommonFactory.showAlert("起始时间大于或等于终止时间！");
//					return;
//				}
			}
			if(item == 'com_end_time') {
				var com_end_time = date.replace(/-/g,"");
				var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
//				var start_time = ($scope.comObj.com_start_time ? ($scope.comObj.com_start_time).substring(0,10).replace(/-/g,'') : nowDate);
				if(com_end_time < nowDate){
					$CommonFactory.showAlert("终止时间早于今天,请重新选择!");
					return;
				}
//				if(start_time >= com_end_time){
//					$CommonFactory.showAlert("终止时间小于或等于起始时间！");
//					return;
//				}
			}			
			$scope.sendObj[item] = date;
			$scope.updateData();
		});
	}
	
	//资质图片上传
	$scope.cameraOptions = {};
	$scope.getPic = function(){
		var hideSheet = $ionicActionSheet.show({
			buttons: [{
					text: '相册'
				}, {
					text: '拍照'
				}
			],
			titleText: '选择图片',
			cancelText: '取消',
			cancel: function() {
			// add cancel code..
			},
			buttonClicked: selectImg
		});
		
		//点击拍照或者选择相册事件
		var uri =  $window.platformServer + 'commons/common-upload?accesstoken='+accesstoken;
		function selectImg(index) {
			$scope.cameraOptions.destinationType =  Camera.DestinationType.DATA_URL;
			$scope.cameraOptions.sourceType =  index;
			$scope.cameraOptions.maximumImagesCount = 1;
			$scope.cameraOptions.width = 1280;
			$scope.cameraOptions.height = 852;
			if(index == 0){
				window.imagePicker.getPictures(
					function(results) {
						for (var i = 0; i < results.length; i++) {
							uploadImg(uri, results[i]);
						}
						hideSheet();
					}, function (error) {
						hideSheet();
					},$scope.cameraOptions);
				$cordovaCamera.cleanup();
			}
			if(index == 1){
				$scope.cameraOptions.destinationType =  Camera.DestinationType.FILE_URL;
				$scope.cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
				$cordovaCamera.getPicture($scope.cameraOptions).then(function(imageURI){
					uploadImg(uri, imageURI);
					hideSheet();
					$cordovaCamera.cleanup();
				},function(err){
					hideSheet();
				});
			}
		};	
		function win(r) {
			var imageURI = commonPath.route_path + JSON.parse(r.response).data;
			var temp = {};
			temp.thumb = imageURI;
			if($scope.img.length > 0){
				$scope.img.shift();
			}
			$scope.img.push(temp);
			$scope.updateData();
			$CommonFactory.hideLoading();
		};

		function fail(r) {
			//console.log(r);
			$CommonFactory.hideLoading();
			$CommonFactory.showAlert('上传图片失败');
		};

		function uploadImg(uri, fileURL) {
			var options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
			options.mimeType="text/plain";

			var headers={'headerParam':'headerValue'};

			var params = {'type':10};
			options.headers = headers;
			options.params = params;
			var ft = new FileTransfer();
			$CommonFactory.showLoading();
			ft.upload(fileURL, uri, win, fail, options);
		}
	}
	
	//更新数据
	$scope.updateData = function(){		
		var data = {
			'accesstoken':accesstoken,
			'com_establish_time':$scope.sendObj.com_establish_time,
			'com_start_time':$scope.sendObj.com_start_time,
			'com_end_time':$scope.sendObj.com_end_time,
			'image_path': $scope.img
		};
		CompanyService.companyUpdateMine(data, function(response){
			$CommonFactory.hideLoading();
			if (response.statuscode == CODE_SUCCESS) {
				$scope.comObj = angular.copy($scope.sendObj);
			} else {
				$CommonFactory.showAlert("操作失败，请重试!");
				return;
			}
		});
	}
	
	//页面回退
	$scope.myBack = function() {
		$state.go("tab.mine",{thisItem:1});
	};
}]);