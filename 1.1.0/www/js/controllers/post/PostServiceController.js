/**
 * 发布服务控制器
 */
app.controller('PostServiceController',
	['$scope', '$rootScope', '$localStorage', '$ionicHistory','$state', '$CommonFactory', '$ionicActionSheet','$cordovaCamera', '$ionicModal', '$ionicScrollDelegate', '$timeout', 'TransferPostDataService', 'CommunityService', 'PostService', 'BusinessService',
	function ($scope, $rootScope, $localStorage, $ionicHistory, $state, $CommonFactory, $ionicActionSheet, $cordovaCamera, $ionicModal, $ionicScrollDelegate, $timeout, TransferPostDataService, CommunityService, PostService, BusinessService) {
		$scope.myGoBack = function() {
			// $state.go('posttypelist');
			//window.history.back();
			$state.go("businessallposts");
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
		$scope.article.post_type = 'service';
		$scope.article.post_level = '1';
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
				if(results.statuscode == window.CODE_SUCCESS){
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

		$scope.postSerivce = function() {
			console.log($scope.article);
			if (!($scope.article.title && $scope.article.title.length > 0)) {
				$CommonFactory.showAlert("请填写服务标题");
				return;
			}
			if (!($scope.article.content && $scope.article.content.length > 0)) {
				$CommonFactory.showAlert("请填写服务内容");
				return;
			}

			if (!($scope.article.productType && !$rootScope.isEmptyObject($scope.article.productType))) {
				$CommonFactory.showAlert("请选择服务类型");
				return;
			}

			if (!($scope.article.productArea && !$rootScope.isEmptyObject($scope.article.productArea))) {
				$CommonFactory.showAlert("请选择服务范围");
				return;
			}

			if (!($scope.article.businesslabels && $scope.article.businesslabels.length > 0)) {
				$CommonFactory.showAlert("请选择行业标签");
				return;
			}

			if($scope.article.price == null) {
				$CommonFactory.showAlert("请填写服务价格");
				return;
			}

			if(!($scope.article.unit && $scope.article.unit.length > 0)) {
				$CommonFactory.showAlert("请填写价格单位");
				return;
			}

			if (!($scope.article.belongStore && !$rootScope.isEmptyObject($scope.article.belongStore))) {
				$CommonFactory.showAlert("请填写归属门店");
				return;
			}

			var imgPath = [];
			if($scope.article.imgs && $scope.article.imgs.length > 0){
				angular.forEach($scope.article.imgs,function(subitem){
					imgPath.push(subitem.img_path);
				});
			}else{
				imgPath = null;
			}
			var data = {
				"accesstoken" : accesstoken,
				"com_service_name" : $scope.article.title,
				"com_service_des" : $scope.article.content,
				"service_range" : typeof($scope.article.productArea) == "undefined" ? null :  $scope.article.productArea.path,
				"com_service_thumb" : imgPath,
				"com_service_type" : typeof($scope.article.productType) == "undefined" ? null : $scope.article.productType.id,
				"unit_value": $scope.article.price,
				"unit": $scope.article.unit,
				// "release_type" : $scope.article.post_level,
				"release_type" : 2,
				"com_service_tag_info" :  $scope.article.businessLabelIds.length >0 ? $scope.article.businessLabelIds : null,
				"store_id" : $scope.article.belongStore.store_id
 			};
 			$CommonFactory.showLoading();
			CommunityService.postProduct(data, function(res){
				$CommonFactory.hideLoading();
				if(res.statuscode == CODE_SUCCESS){
					$scope.article = null;
					TransferPostDataService.setArticle(null);
					// $state.go('tab.community',{refresh:'demand'});
					$localStorage.SearchPage = 1;
					$state.go("businessallposts");
				}
			});
		};

		$scope.goSelectMaterial = function(){
			TransferPostDataService.setArticle($scope.article);
			console.log($scope.article.material);
			//$state.go('postmateriallist',{'type':1,'material_id':typeof($scope.article.material) == "undefined"?null:$scope.article.material.material_id});
			$state.go('postmateriallist',{'type':2});
		};
		
		$scope.goSelectProductType = function (){
			TransferPostDataService.setArticle($scope.article);
			$state.go('postproducttype');
		};

		$scope.goSelectProductArea = function () {
			TransferPostDataService.setArticle($scope.article);
			$state.go('postproductarea');
		};

		//选择图片指令
		$scope.cameraOptions = {
			quality: 50, 
			//sourceType: pictureSource.SAVEDPHOTOALBUM,
			maximumImagesCount:9,
			width: 1280,
			height: 852,
			post_type : 2
		};

		//选择岛事件modal

		$scope.selectedItems = []; //已选择的省份和城市

		$scope.selectedItems.push({'id':-1, 'name':'请选择', 'clicked': true, 'level' : 1});

		$scope.selectItems = []; //待选择的省份或者城市的列表

		$scope.article.belongStore = {}; //最终选择的城市结果

		var position = {'top':0};

		//获取城市信息
		$scope.getCities = function() {
			var data = {
				"accesstoken" :  $rootScope.getAccessToken()
			};
			$CommonFactory.showLoading();
			BusinessService.getCitys(data, function(res) {
				$CommonFactory.hideLoading();
				if (res.data.cityList && res.data.cityList.length > 0) {
					for (var i = 0; i < res.data.cityList.length; i++) {
						res.data.cityList[i].clicked = false;
						res.data.cityList[i].level = 1;
					}
				}
				$scope.cities = res.data.cityList; 
			});
		};

		$scope.getCities();

		//获取分岛信息
		$scope.getStores = function() {
			var data = {
				'accesstoken' : $rootScope.getAccessToken()
			};
			$CommonFactory.showLoading();
			BusinessService.getAllPosition(data, function(res){
				$CommonFactory.hideLoading();
				$scope.stores = res.data;
			});
		}
		$scope.getStores();


		//定义modal
		$ionicModal.fromTemplateUrl('select-city-modal.html', {
			scope: $scope,
			animation: 'slide-in-up',
			backdropClass:'templates'
		}).then(function(modal){
			$scope.selectCityModal = modal;
		});

		//打开modal事件
		$scope.selectBelongStore = function() {
			$scope.selectCityModal.show();

			if ($scope.article.belongStore && !$rootScope.isEmptyObject($scope.article.belongStore)) {
				//已经选择的
			} else {
				$scope.selectItems = [];
				for (var i = 0; i < $scope.cities.length; i++) {
					if ($scope.cities[i].city_official_code != "310000") {
						$scope.selectItems.push({'id':$scope.cities[i].id, 'name':$scope.cities[i].city_name, 'level':1,'clicked':false, 'city_official_code':$scope.cities[i].city_official_code});
					}
				}
			}

			

			//如果已经有选择的岛，需要渲染已经选择的项

			/*if ($scope.article.selectCityResult.length > 0) {
				//如果只有1级省份，应该是只有北京，上海，天津，重庆
				if ($scope.article.selectCityResult.indexOf('-') != -1) {
					;
				}
			} else {
				$scope.selectItems = $scope.provinceData;
			}*/
		};

		//关闭岛选择modal
		$scope.closeSelectCityModal = function() {
			$scope.selectCityModal.hide();
		}; 


		//城市岛modal。点击选择header事件
		$scope.clickLi = function(item) {
			if (item.level == 1) {
				if ($scope.selectedItems) {
					for (var i = 0; i < $scope.selectedItems.length; i++) {
						$scope.selectedItems[i].clicked = false;
					}
				}
				item.clicked = true;
				//$scope.selectItems = $scope.provinceData;
				$scope.selectItems = [];
				for (var i = 0; i < $scope.cities.length; i++) {
					if ($scope.cities[i].city_official_code != "310000") {
						$scope.selectItems.push({'id':$scope.cities[i].id, 'name':$scope.cities[i].city_name, 'level':1,'clicked':false, 'city_official_code':$scope.cities[i].city_official_code});
					}
					
				}
				for (var i = 0; i < $scope.selectItems.length; i++) {
					//设置item选中状态
					if ($scope.selectItems[i].id == item.id) {
						$scope.selectItems[i].clicked = true;
						break;
					}
				}

				// console.log(position);

				if (position) {
					// console.log('scroll to ' + position.toString());
					$timeout(function(){
						$ionicScrollDelegate.$getByHandle('selectCityScroll').scrollTo(position.left, position.top);
					}, 500);
				}
			}
		};

		

		//选择列表
		$scope.selectItem = function(item) {
			
			position = $ionicScrollDelegate.$getByHandle('selectCityScroll').getScrollPosition();
			//取消列表中所有的选中状态
			if ($scope.selectItems && $scope.selectItems.length > 0) {
				for (var i = 0; i < $scope.selectItems.length; i++) {
					$scope.selectItems[i].clicked = false;
				}
			}
			if (item.level == 1) { //选城市
				$scope.selectItems = [];
				$scope.selectedItems = [
					{'id':item.id, 'name':item.name, 'clicked': false, 'level':1},
					{'id':-1, 'name':'请选择', 'clicked': true, 'level':2}
				];
				//根据城市列出城市的所有岛，更新待选择岛列表
				if ($scope.stores) {
					for (var i = 0; i < $scope.stores.length; i++) {
						if ($scope.stores[i].city_id == item.city_official_code) {
							var temp = $scope.stores[i];
							temp.clicked = false;
							temp.level = 2;
							temp.name = temp.store_name;
							temp.id = temp.store_id;
							temp.parent = item.name;
							$scope.selectItems.push(temp);
						}
					}
					$timeout(function(){
						// console.log('scroll to top');
						$ionicScrollDelegate.$getByHandle('selectCityScroll').scrollTo(0,0);
					},500);
				}
				//scroll to top
				
				//$ionicScrollDelegate.$getByHandle('selectCityScroll').scrollTop();
				return;


			} else if (item.level == 2) { //选岛
				for (var i = 0; i < $scope.selectItems.length; i++) {
					$scope.selectItems[i].clicked = false;
				}
				item.clicked = true;

				if ($scope.selectedItems.length == 1) {
					$scope.selectedItems[0].clicked = false;
				}
				$scope.selectedItems[1] = {'id':item.id, 'name':item.name, 'clicked':true, 'level' : 2};
				//组装选择的岛
				$scope.article.belongStore = {'store_id': item.store_id, 'name' : item.parent+'-'+item.store_name};
				$scope.selectCityModal.hide();
				return;
			}

		};
}]);