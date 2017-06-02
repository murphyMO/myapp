/**
 * 发布类型列表控制器 PostActivityController
 */
app.controller('PostActivityController',
	['$scope', '$rootScope', '$localStorage', '$ionicHistory','$state', '$ionicActionSheet','$cordovaCamera', '$ionicModal', 'TransferPostDataService', 'CommunityService', 'PostService', '$CommonFactory', '$ionicScrollDelegate', '$timeout',
	function ($scope, $rootScope, $localStorage, $ionicHistory, $state, $ionicActionSheet, $cordovaCamera, $ionicModal, TransferPostDataService, CommunityService, PostService, $CommonFactory, $ionicScrollDelegate, $timeout ) {
		$scope.myGoBack = function() {
			// $state.go('posttypelist');
			// window.history.back();
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
			destinationType = navigator.camera.DestinationType;
		}

		$scope.article = TransferPostDataService.getArticle();
		// console.log($scope.article);
		if(!$scope.article){
			$scope.article = {};
			//$scope.article.material = {};
			$scope.article.imgs = [];
			$scope.article.businessLabelIds = [];
			$scope.article.businesslabels = [];
		}
		$scope.article.post_type = 'activity';
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
				/*// console.log("Code = " + r.responseCode);
				// console.log("Response = " + r.response);
				// console.log("Sent = " + r.bytesSent);*/
				var results = JSON.parse(r.response);
				if(results.statuscode == window.CODE_SUCCESS){
					var img = {};
					img.src = imgPath + results.data;
					img.img_path = results.data.substr(results.data.lastIndexOf('/')+1);
					$scope.article.imgs.push(img);
					$scope.$apply();
					// // console.log(r);
				}
			}

			function fail(error) {
				alert("An error has occurred: Code = " + error.code);
				// console.log("upload error source " + error.source);
				// console.log("upload error target " + error.target);
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

		$scope.postActivity = function() {
			// console.log($scope.article);

			if (!($scope.article.title && $scope.article.title.length > 0)) {
				$CommonFactory.showAlert("请指定活动主题");
				return;
			}

			if (!($scope.article.content && $scope.article.content.length > 0)) {
				$CommonFactory.showAlert("请指定活动内容");
				return;
			}
			//holding_org

			if (!($scope.article.holding_org && $scope.article.holding_org.length > 0)) {
				$CommonFactory.showAlert("请输入活动举办单位名称");
				return;
			}

			if (!($scope.article.activity_start_time && $scope.article.activity_start_time.length > 0)) {
				$CommonFactory.showAlert("请指定活动开始时间");
				return;
			}

			if (!($scope.article.activity_end_time && $scope.article.activity_end_time.length > 0)) {
				$CommonFactory.showAlert("请指定活动结束时间");
				return;
			}

			if ($scope.article.allow_register) {
				if (!($scope.article.registration_end_time && $scope.article.registration_end_time.length > 0)) {
					$CommonFactory.showAlert("请指定活动报名截止时间");
					return;
				}
			}

			if (($scope.article.activity_start_time && $scope.article.activity_start_time.length > 0)){
				var startTimeDate = new Date($scope.article.activity_start_time.replace(/\-/g, "/"));
				if (startTimeDate < Date.now()) {
					$CommonFactory.showAlert("开始时间不能小于当前时间");
				}
			}

			if (($scope.article.activity_start_time && $scope.article.activity_start_time.length > 0) && ($scope.article.activity_end_time && $scope.article.activity_end_time.length > 0)){
				if ($scope.compareTime($scope.article.activity_start_time, $scope.article.activity_end_time)) {
					$CommonFactory.showAlert("开始时间不能大于结束时间");
					return;
				}
			}
			if ($scope.article.registration_end_time && $scope.article.registration_end_time.length > 0) {
				var registration_end_time = new Date($scope.article.registration_end_time.replace(/\-/g,"/"));
				if (registration_end_time < Date.now()) {
					$CommonFactory.showAlert("活动报名截止时间不能小于当前时间");
					return;
				}
			}
			if ($scope.compareTime($scope.article.registration_end_time,$scope.article.activity_start_time)) {
				$CommonFactory.showAlert("活动报名截止时间不能大于活动开始时间");
				return;
			}
			if (!($scope.article.real_activity_detail_address && $scope.article.real_activity_detail_address.length > 0)) {
				$CommonFactory.showAlert("请指定活动详细地址");
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
				'accesstoken' : accesstoken,
				'title' : $scope.article.title,
				'content' : $scope.article.content,
				'party_thumb' : imgPath,
				'address' : $scope.article.real_activity_detail_address,
				// 'apply_limit' : $scope.article.allow_register,
				'apply_limit' : $scope.article.person_number ? $scope.article.person_number : 0,
				'apply_end_time' : $scope.article.registration_end_time,
				'apply_status' : $scope.article.allow_register,
				'longitude' : $scope.article.longitude,
				'latitude' : $scope.article.latitude,
				'start_time' : $scope.article.activity_start_time,
				'end_time' : $scope.article.activity_end_time,
				'holding_org' : $scope.article.holding_org
			};
			$CommonFactory.showLoading();
			PostService.postActivity(data, function(res){
				$CommonFactory.hideLoading();
				if(res.statuscode == CODE_SUCCESS){
					// $localStorage.set("communityPage",1)
					// $state.go('tab.community',{refresh:'dynamic'});
					$localStorage.SearchPage = 1;
					$state.go("businessallposts",{refresh:'businessallposts'});
					$scope.article = null;
					TransferPostDataService.setArticle(null);
				}else{
					$CommonFactory.showAlert('系统错误');
				}
			});
		};

		//选择素材方法 item:素材类型 1 需求 2 产品 3 活动
		$scope.goSelectMaterial = function(item){
			TransferPostDataService.setArticle($scope.article);
			// console.log($scope.article.material);
			//$state.go('postmateriallist',{'type':1,'material_id':typeof($scope.article.material) == "undefined"?null:$scope.article.material.material_id});
			$state.go('postmateriallist',{'type':item});
		};

		$ionicModal.fromTemplateUrl('templates/community/post_select_dynamic_material_type.html',{
			scope: $scope,
			animation: "slide-in-left",
		}).then(function(modal){
			$scope.modal = modal;
		});

		$scope.openModal = function() {
			$scope.modal.show();
		};

		$scope.closeModal = function () {
			$scope.modal.hide();
		};

		$scope.$on('$destory', function(){
			$scope.modal.remove();
		});

		// $scope.goSelectMaterial = function(){
		// 	// console.log(0);
		// }
		//选择图片指令
		$scope.cameraOptions = {
			quality: 50,
			//sourceType: pictureSource.SAVEDPHOTOALBUM,
			maximumImagesCount:9,
			width: 1280,
			height: 852,
			post_type: 6
		};
		//选择时间事件
		$scope.showDate = function(type) {
			$CommonFactory.showDatePicker(function(date){
				switch (type) {
					case 'activity_start' :
						$scope.article.activity_start_date = date;
						$CommonFactory.showTimePicker(function(time){
							$scope.article.activity_start_time = date + " " + time;
						})
						break;
					case 'activity_end' :
						$scope.article.activity_end_date = date;
						$CommonFactory.showTimePicker(function(time){
							$scope.article.activity_end_time = date + " " + time;
						})
						break;
					case 'registration_end' :
						$scope.article.registration_end_date = date;
						$CommonFactory.showTimePicker(function(time){
							$scope.article.registration_end_time = date + " " + time;
						})
						break;
				}
			});
		};

		//选择城市事件modal

		$ionicModal.fromTemplateUrl('select-city-modal.html', {
			scope: $scope,
			animation: 'slide-in-up',
			backdropClass:'templates'
		}).then(function(modal){
			$scope.selectCityModal = modal;
		});
		$scope.selectCity = function() {
			$scope.selectCityModal.show();

			//如果已经有选择的城市，需要渲染已经选择的项

			if ($scope.article.selectCityResult.length > 0) {
				//如果只有1级省份，应该是只有北京，上海，天津，重庆
				if ($scope.article.selectCityResult.indexOf('-') != -1) {
					;
				}
			} else {
				$scope.selectItems = $scope.provinceData;
			}
		};

		//关闭城市选择modal
		$scope.closeSelectCityModal = function() {
			$scope.selectCityModal.hide();
		};
		//城市选择modal。点击选择header事件
		$scope.clickLi = function(item) {
			if (item.level == 1) {
				if ($scope.selectedItems) {
					for (var i = 0; i < $scope.selectedItems.length; i++) {
						$scope.selectedItems[i].clicked = false;
						if (i > 0) {
							$scope.selectedItems[i] = {'id':-1, 'name':'请选择', 'clicked': false, 'level' : (i+1)};
						}
					}
				}
				item.clicked = true;
				$scope.selectItems = $scope.provinceData;
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

		$scope.selectedItems = []; //已选择的省份和城市

		$scope.selectedItems.push({'id':-1, 'name':'请选择', 'clicked': true, 'level' : 1});

		$scope.selectItems = []; //待选择的省份或者城市的列表

		$scope.article.selectCityResult = ''; //最终选择的城市结果

		var position = {'top':0};

		//获取省份信息
		$scope.getProvinceData = function() {

			var data = {};

			PostService.getProvinceData(data, function(res){
				if (res.data && res.data.length > 0) {
					for (var i = 0; i < res.data.length; i++) {
						res.data[i].clicked = false;
						res.data[i].level = 1;
					}
				}
				$scope.provinceData = res.data;
			});

		};
		$scope.getProvinceData();

		//根据省份获取城市信息

		$scope.getCityData = function() {
			var data = {};
			PostService.getCityData(data, function(res){
				$scope.cityData = res.data;
				// for (var i = 0; i < $scope.cityData.length; i++) {
				// 	$scope.cityData[i].level = 2;
				// 	$scope.cityData[i].clicked = false;
				// }
			});
		};

		$scope.getCityData();

		//选择列表
		$scope.selectItem = function(item) {
			position = $ionicScrollDelegate.$getByHandle('selectCityScroll').getScrollPosition();
			//取消列表中所有的选中状态
			if ($scope.selectItems && $scope.selectItems.length > 0) {
				for (var i = 0; i < $scope.selectItems.length; i++) {
					$scope.selectItems[i].clicked = false;
				}
			}
			if (item.level == 1) { //选省份
				// 如果是北京，上海，天津，重庆 直接选择，关闭弹出框，不再进行城市的选择
				if (item.id == "110000" || item.id == "120000" || item.id == "310000" || item.id == "500000") {
					$scope.selectedItems = [{'id':item.id, 'name':item.name, 'clicked':true, 'level' : 1}];
					item.clicked = true;
					$scope.article.selectCityResult = item.name;
					$scope.selectCityModal.hide();
					return;
				} else {

					if ($scope.selectedItems.length == 1) {
						$scope.selectedItems = [{'id':item.id, 'name':item.name, 'clicked':false, 'level' : 1},
						{'id':-1, 'name':'请选择', 'clicked': true, 'level' : 2}];
					} else {
						$scope.selectedItems[0] = {'id':item.id, 'name':item.name, 'clicked':false, 'level' : 1};
						$scope.selectedItems[1].clicked = true;
					}
					//根据省份选择城市，更新带选择项目列表
					if ($scope.cityData) {
						$scope.selectItems = $scope.cityData[item.id];
						for (var i = 0; i < $scope.selectItems.length; i++) {
							$scope.selectItems[i].clicked = false;
							$scope.selectItems[i].level = 2;
						}
						//scroll to top
						$timeout(function(){
							// console.log('scroll to top');
							$ionicScrollDelegate.$getByHandle('selectCityScroll').scrollTo(0,0);
						},500);
					}
					//scroll to top

					//$ionicScrollDelegate.$getByHandle('selectCityScroll').scrollTop();
					return;
				}


			} else if (item.level == 2) { //选城市
				for (var i = 0; i < $scope.selectItems.length; i++) {
					$scope.selectItems[i].clicked = false;
				}
				item.clicked = true;

				if ($scope.selectedItems.length == 1) {
					$scope.selectedItems[0].clicked = false;
				}
				$scope.selectedItems[1] = {'id':item.id, 'name':item.name, 'clicked':true, 'level' : 2};
				//组装选择的城市
				$scope.article.selectCityResult = '';
				for (var i = 0 ; i < $scope.selectedItems.length; i++) {
					if (i != $scope.selectedItems.length - 1) {
						$scope.article.selectCityResult += ($scope.selectedItems[i].name + '-')
					} else {
						$scope.article.selectCityResult += $scope.selectedItems[i].name;
					}

				}
				$scope.selectCityModal.hide();
				return;
			}

		};



		//百度API
		//默认经纬度
		var latitude = 30.555211;//纬度
		var longitude = 104.07271;//经度

		//实际定位的位置
		if ($rootScope.locationInfo && !$rootScope.isEmptyObject($rootScope.locationInfo)) {
			if ($rootScope.locationInfo.latitude && $rootScope.locationInfo.longitude) {
				latitude = $rootScope.locationInfo.latitude;
				longitude = $rootScope.locationInfo.longitude;
			}
		}

		var map = new BMap.Map("city_map");
		var ac = new BMap.Autocomplete({
			"input" : "detail_address_input",
			"location" : map
		});
		/*map.addControl(new BMap.NavigationControl());
		map.addControl(new BMap.ScaleControl());
		map.addControl(new BMap.OverviewMapControl());
		map.addControl(new BMap.MapTypeControl());
		map.addControl(new BMap.GeolocationControl());
		map.enableScrollWheelZoom(true);*/


		/*var myGeo = new BMap.Geocoder();
		myGeo.getPoint("成都市", function(point){
			  if (point) {
				  map.centerAndZoom(point, 16);
				  map.addOverlay(new BMap.Marker(point));
			  }
	  	}, "四川省成都市");*/

		//浏览器定位
		// var geolocation = new BMap.Geolocation();
		// geolocation.getCurrentPosition(function (r) {
		// 	if (this.getStatus() == BMAP_STATUS_SUCCESS) {
		// 		var mk = new BMap.Marker(r.point);
		// 		map.addOverlay(mk);
		// 		map.panTo(r.point);
		// 		//alert('您的位置：' + r.point.lng + ',' + r.point.lat);
		// 	}
		// 	else {
		// 		alert('failed' + this.getStatus());
		// 	}
		// }, {enableHighAccuracy: true})

		//检测$scope.article.selectCityResult,在没有选择城市的前提下不能填写详细地址。
		$scope.$watch('article.selectCityResult', function(newValue, oldValue) {
			if ($scope.article && newValue != oldValue) {
				$scope.article.activity_detail_address = '';
				if ($scope.article.selectCityResult && $scope.article.selectCityResult.length > 0) {
					$scope.citySelected = true;
					//城市选择后，更新地图到选择的城市
					// 根据城市名更新地图

					var locate = new BMap.LocalSearch(map, {
						onSearchComplete : renderMap
					});
					locate.search($scope.article.selectCityResult);
					// 获取城市名
					var arr = $scope.article.selectCityResult.split('-');
					var city_name = arr[arr.length-1];
					var province_name = '';
					if (arr.length > 1) {
						province_name = arr[0];
					}
					// console.log(province_name);
					// console.log(city_name);
					function renderMap () {
						var pp = locate.getResults().getPoi(0).point;

						map.centerAndZoom(pp,15); //初始化地图
						map.setCurrentCity(city_name);
						map.addControl(new BMap.NavigationControl());
						map.addControl(new BMap.ScaleControl());
						map.addControl(new BMap.OverviewMapControl());


						//自动提醒
						ac.setLocation(map);
						ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
							var str = "";
							var _value = e.fromitem.value;
							var value = "";
							if (e.fromitem.index > -1) {
								value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
							}
							str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

							value = "";
							if (e.toitem.index > -1) {
								_value = e.toitem.value;
								value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
							}
							str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
							G("searchResultPanel").innerHTML = str;
						});

						var myValue;
						ac.addEventListener("onconfirm", function(e) {	//鼠标点击下拉列表后的事件
							var _value = e.item.value;
							myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
							G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
							$scope.article.real_activity_detail_address = province_name + myValue;
							setPlace();
						});

						function setPlace(){
							map.clearOverlays();	//清除地图上所有覆盖物
							function myFun(){
								var pp = local.getResults().getPoi(0).point;	//获取第一个智能搜索的结果
								map.centerAndZoom(pp, 18);
								// console.log(pp);
								map.addOverlay(new BMap.Marker(pp));	//添加标注
								//获取地理位置
								$scope.article.longitude = pp.lng;
								$scope.article.latitude = pp.lat;
							}
							var local = new BMap.LocalSearch(map, { //智能搜索
								onSearchComplete: myFun
							});
							local.search(myValue);
						}

					}


					// var geolocationControl = new BMap.GeolocationControl();
					// geolocationControl.location();
					// geolocationControl.addEventListener("locationSuccess", function (e) {
					// 	// 定位成功事件
					// 	map.centerAndZoom(e.point, 15);
					// 	map.setCurrentCity(e.addressComponent.city);
					// 	map.addControl(geolocationControl);
					// 	map.addControl(new BMap.NavigationControl());
					// 	map.addControl(new BMap.ScaleControl());
					// 	map.addControl(new BMap.OverviewMapControl());
					// 	var address = "";
					// 	address += e.addressComponent.province;
					// 	address += e.addressComponent.city;
					// 	address += e.addressComponent.district;
					// 	address += e.addressComponent.street;
					// 	address += e.addressComponent.streetNumber;

					// 	var mk = new BMap.Marker(e.point);
					// 	map.addOverlay(mk);
					// 	map.panTo(e.point);
					// 	// console.log("位置更新成功:" + "\n\r" + address);
					// });
					// geolocationControl.addEventListener("locationError", function (e) {
					// 	// 定位失败事件
					// 	alert(e.message);
					// 	map.centerAndZoom(new BMap.Point(longitude, latitude), 15);
					// 	map.setCurrentCity("成都市");
					// 	map.addControl(geolocationControl);
					// 	map.addControl(new BMap.NavigationControl());
					// 	map.addControl(new BMap.ScaleControl());
					// 	map.addControl(new BMap.OverviewMapControl());
					// });
				} else {
					$scope.citySelected = false;
				}
			}
		});
		function G(id) {
			return document.getElementById(id);
		}

		//活动开始时间 活动结束时间判断
		$scope.$watchGroup(["article.activity_start_time","article.activity_end_time"], function() {
			if ($scope.article) {
				if (($scope.article.activity_start_time && $scope.article.activity_start_time.length > 0)){
					var startTimeDate = new Date($scope.article.activity_start_time.replace(/\-/g, '/'));
					if (startTimeDate < Date.now()) {
						$CommonFactory.showAlert("开始时间不能小于当前时间");
					}
				}
				if (($scope.article.activity_start_time && $scope.article.activity_start_time.length > 0) && ($scope.article.activity_end_time && $scope.article.activity_end_time.length > 0)){
					if ($scope.compareTime($scope.article.activity_start_time, $scope.article.activity_end_time)) {
						$CommonFactory.showAlert("开始时间不能大于结束时间");
					}
				}
			}

		});
		//时间大于比较
		$scope.compareTime = function(start, end) {
			var startDate = new Date(start.replace(/\-/g, '/'));
			var endDate = new Date( end.replace(/\-/g, '/'));
			if ((startDate && startDate.getTime()) && (endDate && endDate.getTime())) {
				if (startDate.getTime() >= endDate.getTime()) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}

		//活动开始时间 活动报名时间判断
		$scope.$watchGroup(["article.activity_start_time","article.registration_end_time"], function() {
			if ($scope.article) {

				if (($scope.article.activity_start_time && $scope.article.activity_start_time.length > 0) && ($scope.article.registration_end_time && $scope.article.registration_end_time.length > 0)){
					var registration_end_time = new Date($scope.article.registration_end_time.replace(/\-/g,"/"));
					if (registration_end_time < Date.now()) {
						$CommonFactory.showAlert("活动报名截止时间不能小于当前时间");
						return;
					}
					if ($scope.compareTime($scope.article.registration_end_time,$scope.article.activity_start_time)) {
						$CommonFactory.showAlert("活动报名截止时间不能大于活动开始时间");
						return;
					}
				}
			}
		});

		/*$scope.$watch('article.registration_end_time',function(newValue, oldValue){
			if (newValue != oldValue) {
				if ($scope.article.registration_end_time && $scope.article.registration_end_time.length > 0) {
					var registration_end_time = new Date($scope.article.registration_end_time);
					if (registration_end_time < Date.now()) {
						$CommonFactory.showAlert("活动报名截止时间不能小于当前时间");
					}
				}
			}
		});*/



}]);
