/**
 * 企业编辑控制器
 */
app.controller('CompanyEidtCtrl',
	['$scope', '$rootScope', "$state", '$window', '$timeout', 'CompanyService', '$CommonFactory', '$stateParams', 'CommonService', '$filter', '$localStorage', '$ionicActionSheet', '$cordovaCamera', '$CommonFactory', '$ionicModal',
	function ($scope, $rootScope, $state, $window, $timeout, CompanyService, $CommonFactory, $stateParams, CommonService, $filter, $localStorage, $ionicActionSheet, $cordovaCamera, $CommonFactory, $ionicModal) {
	var accesstoken = $rootScope.getAccessToken();
	$scope.comObj = $rootScope.comObj;
	if (!$scope.comObj) {
		$scope.comObj = {};
	}
	$scope.comObj.business_label = [];	
	if ($localStorage.getObject('com_business_label_localstorage')) {
		$scope.comObj.business_label = $localStorage.getObject('com_business_label_localstorage');
	}
	$scope.change=0;
	var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
	var img = $scope.img = [];
	
	//跳转存表单数据
	$scope.goSelectPage = function(url){
		$localStorage.setObject("comObj_localstorage",$scope.comObj);
		$state.go(url);
	}
	//根据公司ID获取详情信息
	$scope.companyOnes = function(){
		var data={
			'accesstoken': accesstoken
		};
		$CommonFactory.showLoading();
		CompanyService.companyMine(data, function(response){
			$CommonFactory.hideLoading();
			if (response.statuscode == CODE_SUCCESS) {
				if (Object.getOwnPropertyNames($localStorage.getObject("comObj_localstorage")).length == 0) {
					$scope.comObj = response.data;
				} else {
					$scope.comObj = $localStorage.getObject('comObj_localstorage');
				};								
				if (!$scope.comObj.imgs) {
					$scope.comObj.imgs = [];
				};
				$scope.com_id = $scope.comObj.com_id; //公司列表传过来的ID
				$scope.comObj.city_name = localStorage.city_name;
				//localStorage.removeItem("city_name");//清除c的值
				$scope.flag = true;
				//先从localstorage里面读取business_label，如果没有的话，将company的行业标签保存到localstorage 用于后面渲染行业标签列表页面的默认选择
				if (Object.getOwnPropertyNames($localStorage.getObject("com_business_label_localstorage")).length == 0) {
					$localStorage.setObject('com_business_label_localstorage',$scope.comObj.business_label);
				} else {
					$scope.comObj.business_label = $localStorage.getObject('com_business_label_localstorage');
				}
				$scope.comObj.com_registered_assets = parseInt($scope.comObj.com_registered_assets);		
				$scope.img = JSON.parse($scope.comObj.image_path);
			}
		});
	}


	//日期插件调用
	$scope.showDate = function(){
		$CommonFactory.showDatePicker(function(date){
			$scope.comObj.com_establish_time = date;
		});
	}
	$scope.showDate1 = function(){
		$CommonFactory.showDatePicker(function(date){
			$scope.comObj.com_start_time = date;
		});
	}
	$scope.showDate2 = function(){
		$CommonFactory.showDatePicker(function(date){
			$scope.comObj.com_end_time = date;
		});
	}
	$scope.companyOnes();
	//获取行业标签
	$scope.getTagInfo=function(){
		var data={
			"accesstoken" : accesstoken
		};
		CompanyService.businessLabel(data,function(response){
			if (response.statuscode == CODE_SUCCESS) {
				$scope.tagInfo = response.data;
			}
		});
	}

	//获取地区信息
	$scope.getArea = function(){
		var data = {
			"accesstoken":accesstoken
		};
		CommonService.areaList(data,function(response){
			$scope.countryList = response.data.countryList;
			$scope.provinceListOld = response.data.provinceList;
			$scope.cityListOld = response.data.cityList;
		});
	}
	//$scope.getArea();

	//保存基础信息
	$scope.updateBase = function(){
		if(!$scope.comObj.com_name){
			$CommonFactory.showAlert("请填写名称!");
			return;
		}
		if(!$scope.comObj.com_phone){
			$CommonFactory.showAlert("请填写企业联系方式!");
			return;
		}
		if(!$scope.comObj.com_address){
			$CommonFactory.showAlert("请填写企业地址!");
			return;
		}
		if(!$scope.comObj.com_scale){
			$CommonFactory.showAlert("请填写企业规模!");
			return;
		}
		if($scope.comObj.com_phone){
			if($scope.comObj.com_phone.length!=11){
				$CommonFactory.showAlert("企业联系方式格式不对!");
				return;
			}
		}
		if($scope.comObj.com_website){
			if(!(/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/.test($scope.comObj.com_website))){
				$CommonFactory.showAlert("企业官网格式有误！");
				return;
			}
		}

		var business_label = [];
		var business_label_id = [];
		if ($localStorage.getObject("com_business_label_localstorage")) {
			business_label = $localStorage.getObject("com_business_label_localstorage");
			angular.forEach(business_label, function(item) {
				business_label_id.push(item.business_label_id);
			});
		}

		var data = {
			'accesstoken' : accesstoken,
			'com_name' : $scope.comObj.com_name,
			'com_title_type' : $scope.comObj.com_title_type,
			'com_phone':$scope.comObj.com_phone,
			'com_address' : $scope.comObj.com_address,
			'com_website' : $scope.comObj.com_website,
			'com_locate_city' : $scope.comObj.com_locate_city,
			'country_official_code':$scope.comObj.country_official_code,
			'province_official_code':$scope.comObj.province_official_code,
			'city_official_code':$scope.comObj.city_official_code,
			'com_scale' : $scope.comObj.com_scale,
			'store_id':$scope.comObj.store_id,
			'business_label':business_label_id
		};
		CompanyService.companyUpdateMine(data,function(response){
			if(response.statuscode==1){
				$CommonFactory.showAlert("修改成功！");
				//修改成功之后清空localstorage里面的businesslabel信息
				$localStorage.removeItem("com_business_label_localstorage");
				$localStorage.removeItem("comObj_localstorage");
				$state.go('tab.mine',{thisItem:1});
			}
		})
	}

	//监听数据变化
	$scope.$watch('comObj', function (obh,bhg) {
			$scope.change++;
		},true);

	//保存资质信息
	$scope.updateAptitude = function(){
		if($scope.change==1){
			$CommonFactory.showAlert("未修改任何信息！");
			return ;
		}
		if(!$scope.comObj.com_establish_time){
			$CommonFactory.showAlert("请填写企业成立时间!");
			return;
		}
		if(!$scope.comObj.com_legal_representative_name){
			$CommonFactory.showAlert("请填写法人代表!");
			return;
		}
		if(!$scope.comObj.com_credit_code){
			$CommonFactory.showAlert("请填写统一社会信用代码!");
			return;
		}
		if(!$scope.comObj.com_org_code){
			$CommonFactory.showAlert("请填写组织机构代码!");
			return;
		}
		if(!$scope.comObj.com_registered_assets){
			$CommonFactory.showAlert("请填写注册资本!");
			return;
		}
		if($scope.comObj.com_establish_time) {
			com_establish_time = $scope.comObj.com_establish_time.replace(/-/g,"");
			var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
			if(com_establish_time > nowDate){
				$CommonFactory.showAlert("企业成立时间超过今天,请重新选择!");
				return;
			}
		}
		if($scope.comObj.com_start_time) {
			com_start_time = $scope.comObj.com_start_time.replace(/-/g,"");
			var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
			if(com_start_time > nowDate){
				$CommonFactory.showAlert("起始时间超过今天,请重新选择!");
				return;
			}
		}
		if($scope.comObj.com_end_time) {
			com_end_time = $scope.comObj.com_end_time.replace(/-/g,"");
			var nowDate = ($filter('date')(new Date(),'yyyy-MM-dd')).replace(/-/g,"");
			if(com_end_time < nowDate){
				$CommonFactory.showAlert("终止时间早于今天,请重新选择!");
				return;
			}
		}
		if($scope.comObj.com_start_time && $scope.comObj.com_end_time){
			start_date = ($scope.comObj.com_start_time).substring(0,10).replace(/-/g,'/');
			end_time = ($scope.comObj.com_end_time).substring(0,10).replace(/-/g,'/');
			if(start_date == end_time){
				$CommonFactory.showAlert("终止时间不能等于起始时间！");
				return;
			}
		}
		if($scope.comObj.com_start_time && $scope.comObj.com_end_time){
			start_date = ($scope.comObj.com_start_time).substring(0,10).replace(/-/g,'/');
			end_time = ($scope.comObj.com_end_time).substring(0,10).replace(/-/g,'/');
			if(start_date > end_time){
				$CommonFactory.showAlert("终止时间不能早于起始时间！");
				return;
			}
		}
		if($scope.comObj.com_credit_code){
			var code = /^([0-9ABCDEFGHJKLMNPQRTUWXY]{2})(\d{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{9})[0-9ABCDEFGHJKLMNPQRTUWXY]$/;
			if (!code.test($scope.comObj.com_credit_code)) {
				$CommonFactory.showAlert("统一社会信用代码有误！");
				return;
			}
		}
		if($scope.comObj.com_org_code){
			com_credit_code = ($scope.comObj.com_credit_code).substring(8,17);
			console.log(com_credit_code);
			if ($scope.comObj.com_org_code != com_credit_code) {
				$CommonFactory.showAlert("组织机构代码有误！");
				return;
			}
		}
		var imgPath = [];
		if($scope.img && $scope.img.length > 0){
			angular.forEach($scope.img,function(subitem){
				imgPath.push({'thumb':subitem.thumb});
			});
		}else{
			imgPath = null;
		}
		var data = {
			'accesstoken':accesstoken,
			'com_establish_time':$scope.comObj.com_establish_time,
			'com_legal_representative_name':$scope.comObj.com_legal_representative_name,
			'city_official_code':$scope.comObj.city_official_code,
			'com_credit_code':$scope.comObj.com_credit_code,
			'com_org_code' : $scope.comObj.com_org_code,
			'image_path': imgPath,
			'com_type' : $scope.comObj.com_type,
			'com_registered_assets' : $scope.comObj.com_registered_assets,
			'com_start_time' : $scope.comObj.com_start_time,
			'com_end_time' : $scope.comObj.com_end_time
		}
		CompanyService.companyUpdateMine(data,function(response){
			if(response.statuscode==CODE_SUCCESS){
				$CommonFactory.showAlert("修改成功！");
				$state.go('tab.mine',{thisItem:1});
			}
		})
	}
	$scope.ComBack = function(){
		$state.go('tab.mine',{thisItem:'1'});
		
	}

	/*上传获取资质证明图片*/ //comObj.imgs
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
	};
	/*上传获取资质证明图片结束*/

	function win(r) {
		var imageURI = commonPath.route_path + JSON.parse(r.response).data;
		var temp = {};
		temp.src = imageURI;
		temp.upload = imageURI;
		temp.thumb = imageURI;
		if($scope.img.length > 0){
			$scope.img.shift();
		}
		$scope.img.push(temp);
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

	};

	//判断一个对象是否是空对象
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function isEmptyObject(obj) {
		if (obj == null) {
			return true;
		}

		if (obj.length > 0) {
			return false;
		}

		if (obj.length === 0) {
			return true;
		}

		if (typeof obj !== "object") {
			return true;
		}

		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) {
				return false;
			}
		}

		return true;
	};
	
	//图片大图弹出层
	$ionicModal.fromTemplateUrl('modal.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
	});	
	//显示大图
	$scope.hideBigImage = function () {
		$scope.modal.hide();
	};
	//隐藏大图
	$scope.showBigImage = function (url) {
	    $scope.Url = url;
	    $scope.modal.show();
	};
	

	//页面回退
	$scope.myBack = function() {
		//要清除localstorage里面的东西business label
		$localStorage.removeItem("com_business_label_localstorage");
		$localStorage.removeItem("comObj_localstorage");
		$state.go("tab.mine",{thisItem:1});
	};
 
}]);