/*
 * 身份验证的控制器
 */

app.controller('AptitudeCtrl',
	['$scope','$stateParams','$state', '$localStorage','$rootScope','$ionicActionSheet','$cordovaCamera','$CommonFactory',
	function ($scope,$stateParams,$state,$localStorage, $rootScope, $ionicActionSheet,$cordovaCamera,$CommonFactory) {


		var accesstoken = $localStorage.get("accesstoken");
		$scope.user = $rootScope.getCurrentUser();
		$scope.ImgItems = [];
		var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		/*console.log($scope.commonPath)*/
		var imgPath = commonPath.route_path;
		var uri = window.platformServer+'commons/common-upload?accesstoken='+accesstoken;
		var pictureSource;
		var destinationType;
		document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {
			pictureSource = navigator.camera.PictureSourceType;
			destinationType=navigator.camera.DestinationType;
		}

		var imgs = [];

				/*上传图片开始*/
		$scope.getPic = function(){
			imgs = [];
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
			function selectImg(index) {
				$scope.cameraOptions.destinationType =  Camera.DestinationType.DATA_URL;
				$scope.cameraOptions.sourceType =  index;
				if(index == 0){
					window.imagePicker.getPictures(
						function(results) {
							for (var i = 0; i < results.length; i++) {
								var dataUrl = "data:image/jpeg;base64," + results[i];
								//uploadImg(uri, dataUrl);
								imgs.push(dataUrl);
								var data = {
				accesstoken : accesstoken,
				image : imgs
			};

			UserService.uploadImg(data, function(res){
				console.log(res);
			});
							}
							hideSheet();
						}, function (error) {
							hideSheet();
						},$scope.cameraOptions);
					//$cordovaCamera.cleanup();
				}
				if(index == 1){
					$scope.cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
					$cordovaCamera.getPicture($scope.cameraOptions).then(function(imageURI){
							var dataUrl = "data:image/jpeg;base64," + imageURI;
							imgs.push(dataUrl);
							var data = {
								accesstoken : accesstoken,
								image : imgs
							};

			UserService.uploadImg(data, function(res){
				console.log(res);
			});
							//uploadImg(uri, imageURI);
							hideSheet();
							//$cordovaCamera.cleanup();
						},function(err){
							hideSheet();
						});

				}
			};



			/*function uploadImg(uri, fileURL) {
				var options = new FileUploadOptions();
				options.fileKey="file";
				options.mimeType="text/plain";

				var headers={'headerParam':'headerValue'};

				options.headers = headers;

				var ft = new FileTransfer();

				ft.onprogress = function(progressEvent) {
					if (progressEvent.lengthComputable) {
						loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
					} else {
						loadingStatus.increment();
					}
				};
				ft.upload(fileURL, uri, win, fail, options);

			}*/
		};
		/*上传图片结束*/

		$scope.saveIdVerify = function() {
			console.log($scope.uploadImages);
			var imgPath = [];
			if($scope.uploadImages.imgs && $scope.uploadImages.imgs.length > 0){
				angular.forEach($scope.uploadImages.imgs,function(subitem){
					imgPath.push(subitem.img_path);
				});
			}else{
				imgPath = null;
			}
			var data = {
				'accesstoken' : accesstoken,
				'image' : imgPath
			};
			$CommonFactory.showLoading();
			UserService.saveIdVerify(data, function(res){
				if(res.statuscode == CODE_SUCCESS){
					$scope.uploadImages = null;
					TransferPostDataService.setuploadImages(null);
					$state.go('tab.mine');
				}
				$CommonFactory.hideLoading();
			});
		};

		$scope.cameraOptions = {
			quality: 50,
			//sourceType: pictureSource.SAVEDPHOTOALBUM,
			maximumImagesCount:9,
			width: 1280,
			height: 852
		};
		$scope.cameraOptions1 = {
			quality: 50,
			//sourceType: pictureSource.SAVEDPHOTOALBUM,
			maximumImagesCount:9,
			width: 1280,
			height: 852
		};

	}]);
