/*
 * 身份验证的控制器
 */

app.controller('IdVerifyCtrl',
	['$scope','$stateParams','$state', '$timeout', '$window', '$localStorage','$rootScope','$ionicActionSheet','$cordovaCamera','$CommonFactory', '$q', '$cordovaToast', 'UserService', '$ionicPopup',
	function ($scope,$stateParams,$state, $timeout, $window, $localStorage, $rootScope, $ionicActionSheet,$cordovaCamera,$CommonFactory, $q, $cordovaToast, UserService,$ionicPopup) {

		$scope.isIdCard = true;
		var accesstoken = $localStorage.get("accesstoken");
		var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		var user = $rootScope.getCurrentUser();
		var imgPath = commonPath.route_path;

		var img = $scope.img = {};
		$scope.img.ID = img.ID = [];
		$scope.img.ID1 = img.ID1 = [];
		$scope.img.ID2 = img.ID2 = [];
		$scope.img.photo = img.photo = [];
		$scope.img.photo1 = img.photo1 = [];
		$scope.img.photo2 = img.photo2 = [];
		$scope.img.photo3 = img.photo3 = [];

		var picPath = commonPath.route_path +'/';
		var idPicPath = commonPath.route_path +'/';

		$scope.nextClick = function(){
			$scope.isIdCard = false;
		}
		$scope.back = function(){
			if ($scope.isIdCard) {
				$state.go("tab.mine");
			}
			else{
				$scope.isIdCard = true;
			}
		}

		//获取数据库数据初始化界面
		$scope.getImgs = function() {
			//重新获取数据的时候需要设置$scope.img的变量
			var data = {
				accesstoken : accesstoken
			};
			$CommonFactory.showLoading();
			UserService.getUserImg(data, function(res) {
				$CommonFactory.hideLoading();
				if (res.statuscode == CODE_SUCCESS) {
					$scope.img = {};
					$scope.img.ID = [];
					$scope.img.ID1 = [];
					$scope.img.ID2 = [];
					$scope.img.photo = [];
					$scope.img.photo1 = [];
					$scope.img.photo2 = [];
					$scope.img.photo3 = [];
					var data = res.data;
					if (data.image && data.image.length > 0) {
						for(var i = 0; i < data.image.length; i++){
							if (data.image[i].img_type == 1) {
								$scope.img.ID1.push({src : idPicPath + data.image[i].img_url});
							}
							if (data.image[i].img_type == 2) {
								$scope.img.ID2.push({src : idPicPath + data.image[i].img_url});
							}
							if (data.image[i].img_type == 3) {
								$scope.img.photo1.push({src : picPath + data.image[i].img_url});
							}
							if (data.image[i].img_type == 4) {
								$scope.img.photo2.push({src : picPath + data.image[i].img_url});
							}
							if (data.image[i].img_type == 5) {
								$scope.img.photo3.push({src : picPath + data.image[i].img_url});
							}
						}
					}
				}
			});
		};

		$scope.getImgs();
		//获取图片操作参数初始化
		$scope.cameraOptions = {};
		/*
		*	获取图片
		*	type: 1 身份证正面 2 身份证背 3 头像采集第一张 4 头像采集第二张 5 头像采集第三张
		*/
		/*上传图片开始*/
		$scope.getPic = function(type,item){
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
				$scope.cameraOptions.destinationType = Camera.DestinationType.DATA_URL;
				$scope.cameraOptions.sourceType = index;
				$scope.cameraOptions.maximumImagesCount = 1;
				$scope.cameraOptions.width = 720;
				$scope.cameraOptions.height = 720;
				if(index == 0){
					//相册
					window.imagePicker.getPictures(
						function(results) {
							$scope.$apply(function(){
								for (var i = 0; i < results.length; i++){
									var temp = {};
									temp.src = results[i];
									temp.upload = results[i];
									temp.thumb = results[i];
									temp.img_type = item;
									if (type == 1 && item == 1) {
										if($scope.img.ID1.length > 0){
											$scope.img.ID1 = [];
										}
										$scope.img.ID1.push(temp);
									}
									if(type == 1 && item == 2){
										if($scope.img.ID2.length > 0){
											$scope.img.ID2 = [];
										}
										$scope.img.ID2.push(temp);
									}
									if(type == 2 && item == 3) {
										if($scope.img.photo1.length > 0){
											$scope.img.photo1 = [];
										}
										$scope.img.photo1.push(temp);
									}
									if(type == 2 && item == 4) {
										if($scope.img.photo2.length > 0){
											$scope.img.photo2 = [];
										}
										$scope.img.photo2.push(temp);
									}
									if(type == 2 && item == 5) {
										if($scope.img.photo3.length > 0){
											$scope.img.photo3 = [];
										}
										$scope.img.photo3.push(temp);
									}
								}
							});
							hideSheet();
						}, function (error) {
							hideSheet();
							console.log(error);
						},$scope.cameraOptions);
					// 导致拍照时，拍第一张再拍第二张时，仍然显示第一张，不管拍多少次都是显示第一张
					// if (!$rootScope.isIOS) {
					// 	$cordovaCamera.cleanup();
					// }
				}
				if(index == 1){
					//拍照
					$scope.cameraOptions.destinationType =  Camera.DestinationType.FILE_URL;
					$scope.cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
					$scope.cameraOptions.correctOrientation = true;
					$cordovaCamera.getPicture($scope.cameraOptions).then(function(imageURI){
						$timeout(function(){
							var temp = {};
							temp.src = imageURI;
							temp.upload = imageURI;
							temp.thumb = imageURI;
							temp.img_type = item;
							if (type == 1 && item == 1) {
								//身份证有两张图片
								if($scope.img.ID1.length > 0){
									$scope.img.ID1 = [];
								}
								$scope.img.ID1.push(temp);
							}
							if (type == 1 && item == 2) {
								if($scope.img.ID2.length > 0){
									$scope.img.ID2 = [];
								}
								$scope.img.ID2.push(temp);
							}
							if (type == 2 && item == 3) {
								if($scope.img.photo1.length > 0){
									$scope.img.photo1 = [];
								}
								$scope.img.photo1.push(temp);
							}
							if (type == 2 && item == 4) {
								if($scope.img.photo2.length > 0){
									$scope.img.photo2 = [];
								}
								$scope.img.photo2.push(temp);
							}
							if (type == 2 && item == 5) {
								if($scope.img.photo3.length > 0){
									$scope.img.photo3 = [];
								}
								$scope.img.photo3.push(temp);
							}
						});
						hideSheet();
						// 导致拍照时，拍第一张再拍第二张时，仍然显示第一张，不管拍多少次都是显示第一张
						// if (!$rootScope.isIOSs) {
						// 	$cordovaCamera.cleanup();
						// }
					},function(err){
						hideSheet();
					});
				}
			}
		}

		$scope.getNewUserType = function(){
			var data2 = {
				accesstoken : accesstoken
			}
			UserService.getNewUserType(data2,function(re){
				if (re.statuscode == 1) {
					
				}
			})
		}

		//多文件上传
		$scope.saveIdVerify = function() {
			if ($scope.img.photo1.length > 0) {
				$scope.img.photo.push($scope.img.photo1[0]);
			}
			if ($scope.img.photo2.length > 0) {
				$scope.img.photo.push($scope.img.photo2[0]);
			}
			if ($scope.img.photo3.length > 0) {
				$scope.img.photo.push($scope.img.photo3[0]);
			}
			if ($scope.img.ID1.length > 0) {
				$scope.img.ID.push($scope.img.ID1[0]);
			}
			if ($scope.img.ID2.length > 0) {
				$scope.img.ID.push($scope.img.ID2[0]);
			}
			for(var a = 0; a < $scope.img.ID.length; a++){
				if ($scope.img.ID[a].upload) {
					$scope.uploadId = true;
					break;
				}
			}
			for(var b = 0; b < $scope.img.photo.length; b++){
				if ($scope.img.photo[b].upload) {
					$scope.uploadPhoto = true;
					break;
				}
			}
			if ($scope.uploadPhoto || $scope.uploadId) {
				var data = {
					accesstoken : accesstoken
				}
				UserService.uploadBefore(data,function(res){
					if (res.statuscode == 1) {
						$scope.record_id = res.data.record_id;
						
						$CommonFactory.showLoading();
						var defs = [];
						var uri = $window.platformServer + 'user-datas/upload-image?accesstoken='+accesstoken;
						if ($scope.img.photo.length > 0) {
							$scope.img.photo.forEach(function(i) {
								if (i.upload) {
									var def = $q.defer();
									function win(r) {
										def.resolve(1);
									};
									//上传文件失败回调函数
									function fail(r) {
										def.resolve(0);
									}
									var options = new FileUploadOptions();
									options.fileKey = "file";
									var params = new Object();
									params.img_type = i.img_type;
									params.record_id = $scope.record_id;
									options.params = params;
									options.fileName = i.upload.substr(i.upload.lastIndexOf('/')+1);
									options.mimeType = "text/plain";
									var headers = {'headerParam':'headerValue'};
									options.headers = headers;
									var ft = new FileTransfer();
									ft.upload(i.upload, uri, win, fail, options);
									defs.push(def.promise);
								}
							});
						}
						if ($scope.img.ID.length > 0) {
							$scope.img.ID.forEach(function(i) {
								if (i.upload) {
									var def = $q.defer();
									function win(r) {
										def.resolve(1);
									};
									//上传文件失败回调函数
									function fail(r) {
										def.resolve(0);
									}
									var options = new FileUploadOptions();
									options.fileKey = "file";
									var params = new Object();
									params.img_type = i.img_type;
									params.record_id = $scope.record_id;
									options.params = params;
									options.fileName = i.upload.substr(i.upload.lastIndexOf('/')+1);
									options.mimeType = "text/plain";
									var headers = {'headerParam':'headerValue'};
									options.headers = headers;
									var ft = new FileTransfer();
									ft.upload(i.upload, uri, win, fail, options);
									defs.push(def.promise);
								}
							});
						}
						$q.when.apply($q, defs).then(function() {
							$CommonFactory.hideLoading();
							$scope.img.ID = [];
							$scope.img.photo = [];
							$scope.showAlert();
						});
					}
					else{
						$CommonFactory.showAlert("上传图片失败")
					}
				})
			}
			else {
				$CommonFactory.showAlert("您当前未修改任何信息，请修改后再提交。");
			}

		}
		$scope.showAlert = function() {
			var alertPopup = $ionicPopup.alert({
				title: '提示',
				cssClass: 'custom-popup',
				template: '您的信息已提交成功！小师妹将在2小时内审核您的信息，审核通过后您将可以使用门禁。'
			});
			alertPopup.then(function(res) {
				
				$scope.getNewUserType();
			});
		};
		//上传文件成功回调函数
		function win(r) {
			$CommonFactory.hideLoading();
			$scope.img = {}; $scope.img.ID = []; $scope.img.photo = [];
			$timeout(function(){
				$scope.getImgs();
			},2500);
		};
		//上传文件失败回调函数
		function fail(r) {
			$CommonFactory.hideLoading();
			$scope.img = {}; 
			$scope.img.ID = []; 
			$scope.img.photo = [];
		}


		// //接收插件ion-gallery.js删除了图片的事件广播(修改了插件)
		$scope.$on('deleteImg'); 

	}]);