/**
 * 发布类型列表控制器
 */
app.controller('PostPersonIntrCtrl',
	['$scope', '$rootScope', '$localStorage', '$ionicHistory','$state', '$ionicActionSheet','$cordovaCamera', 'TransferPostDataService', 'CommunityService', '$CommonFactory',
	function ($scope, $rootScope, $localStorage, $ionicHistory, $state, $ionicActionSheet, $cordovaCamera, TransferPostDataService, CommunityService, $CommonFactory) {
		$scope.myGoBack = function() {
			$state.go('posttypelist');
			TransferPostDataService.setArticle(null);
			$scope.article = null;
		};
		var accesstoken = $rootScope.getAccessToken();
		//accesstoken = '81628ed463a99d128136c7126c3fbf3985';
		var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		var imgPath = commonPath.route_path;
		var uri = window.platformServer+'commons/common-upload?accesstoken='+accesstoken;
		var pictureSource;
		var destinationType;
		document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {
			pictureSource = navigator.camera.PictureSourceType;
			destinationType=navigator.camera.DestinationType;
		}

		$scope.article = TransferPostDataService.getArticle();
		console.log($scope.article);
		if(!$scope.article){
			$scope.article = {};
			//$scope.article.material = {};
			$scope.article.imgs = [];
			$scope.article.businessLabelIds = [];
			$scope.article.businesslabels = [];
		}
		$scope.article.post_type = 'person_intr';
		/*上传图片开始*/
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
				buttonClicked: function(index){
					var cameraOptions = {
						quality: 50, 
						destinationType: destinationType.FILE_URI,
						sourceType: index,
						maximumImagesCount:9,
						width: 1280,
						height: 852
					};
					
					if(index == 0){
						window.imagePicker.getPictures(
							function(results) {
								for (var i = 0; i < results.length; i++) {
									// $scope.article.imgs.push(results[i]);
									// $scope.$apply();
									uploadImg(uri, results[i]);
								}
								hideSheet();
							}, function (error) {
								hideSheet();
							},cameraOptions);
						$cordovaCamera.cleanup();
					}
					if(index == 1){
						$cordovaCamera.getPicture(cameraOptions).then(function(imageURI){
								// $scope.article.imgs.push(imageURI);
								// $scope.$apply();
								uploadImg(uri, imageURI);
								hideSheet();
							},function(err){
								hideSheet();
							});
						$cordovaCamera.cleanup();
					}
					
				}
			});

			function win(r) {
				/*console.log("Code = " + r.responseCode);
				console.log("Response = " + r.response);
				console.log("Sent = " + r.bytesSent);*/
				var results = JSON.parse(r.response);
				if(results.statuscode == CODE_SUCCESS){
					var img = {};
					img.src = imgPath + results.data;
					img.img_path = results.data.substr(results.data.lastIndexOf('/')+1);
					$scope.article.imgs.push(img);
					$scope.$apply();
					// console.log(r);
				}
			}

			function fail(error) {
				alert("An error has occurred: Code = " + error.code);
				console.log("upload error source " + error.source);
				console.log("upload error target " + error.target);
			}

			

			function uploadImg(uri, fileURL) {
				var options = new FileUploadOptions();
				options.fileKey="file";
				options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
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

			}
		};
		/*上传图片结束*/



		$scope.goSelectBusinessLabel = function() {
			TransferPostDataService.setArticle($scope.article);
			$state.go('postbusinesslabels');
		};

		$scope.postPersonIntr = function() {
			console.log($scope.article);
			var imgPath = [];
			if($scope.article.imgs && $scope.article.imgs.length > 0){
				angular.forEach($scope.article.imgs,function(subitem){
					imgPath.push(subitem.img_path);
				});
			}else{
				imgPath = null;
			}
			var data = {
				'accesstoken' : accesstoken,
				'article_data_title' : $scope.article.title,
				'article_content' : $scope.article.content,
				'article_data_photo' : imgPath,
				'com_article_material_id' : typeof($scope.article.material) == "undefined"? null:$scope.article.material.com_article_material_id,
				'com_business_label' : $scope.article.businessLabelIds.length >0 ? $scope.article.businessLabelIds : null,
				'article_type_id' : 4
			};
			$CommonFactory.showLoading();
			CommunityService.postArticle(data, function(res){
				$CommonFactory.hideLoading();
				if(res.statuscode == CODE_SUCCESS){
					$localStorage.set("communityPage",1)
					$state.go('tab.community',{refresh:'dynamic'});
					$scope.article = null;
					TransferPostDataService.setArticle(null);
				}else{
					$CommonFactory.showAlert('系统错误');
				}
			});
		};

		$scope.goSelectMaterial = function(){
			TransferPostDataService.setArticle($scope.article);
			console.log($scope.article.material);
			$state.go('postmateriallist',{'type':4});
		};

		//选择图片指令
		$scope.cameraOptions = {
			quality: 50, 
			//sourceType: pictureSource.SAVEDPHOTOALBUM,
			maximumImagesCount:9,
			width: 1280,
			height: 852,
			post_type: 4
		};
		
}]);