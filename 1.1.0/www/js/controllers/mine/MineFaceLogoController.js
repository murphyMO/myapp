/**
 * 个人头像logo控制器
 */
app.controller('MineFaceLogoCtrl',
	['$scope', '$window', '$rootScope', '$localStorage', 'MineService','$state', '$timeout',
	function ($scope, $window, $rootScope, $localStorage, MineService,$state, $timeout) {

		$scope.com_log_path = $localStorage.getObject(KEY_COMMON_PATH);
		var accesstoken = $rootScope.getAccessToken();
		var userObj = $rootScope.getCurrentUser();
		
		//图片选取的弹出框imgCrop组件
		$scope.myImage='';
		$scope.myCroppedImage='';
		$scope.cropType="square";
		
		//文件选择
		var handleFileSelect=function(evt) {
			var file=evt.currentTarget.files[0];
			var reader = new FileReader();

			reader.onload = function (evt) {
				$scope.$apply(function($scope){
					$scope.myImage=evt.target.result;
				});
			};
			reader.readAsDataURL(file);
			$scope.reader = reader;
		};
		angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);


		
		$timeout(function () {
			$scope.myCroppedImage = $scope.path + userObj.photo;
		}, 500);
		
		//保存logo
		$scope.saveFaceLogo = function(){
			if (!$scope.myCroppedImage) {
				$.toast("请上传个人头像", "text");
				return;
			}
			var data = {
				accesstoken: accesstoken,
				face:$scope.myCroppedImage
			};
			//调用头像修改接口
			MineService.setHeadImg(data,function(response){
				$.toast(response.message, "text");
				userObj.photo = response.data.one_inch_photo_url;
				$rootScope.setCurrentUser(userObj);
				$state.go("app.mineindex");
			});
		}



$scope.imgChange = function (element) {
	if (!element.files[0]) {
		console.log("未选择图片！");
		return;
	}
	$scope.$apply(function(scope) {
		var photofile = element.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var prev_img = document.getElementById("face");
			prev_img.src = e.target.result;
			console.log(prev_img.src.length);
			$scope.userInfo.headImage = reduceImage.compress(prev_img, 50).src;
			console.log($scope.userInfo.headImage);
			console.log($scope.userInfo.headImage.length);
		};
		reader.readAsDataURL(photofile);
	});
};


var reduceImage = {
	/** 
	 * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed 
	 * @param {Image} source_img_obj The source Image Object 
	 * @param {Integer} quality The output quality of Image Object 
	 * @return {Image} result_image_obj The compressed Image Object 
	 */
	compress: function(source_img_obj, quality, output_format){
		var mime_type = "image/jpeg";
		if(output_format!=undefined && output_format=="png"){
			mime_type = "image/png";
		}
		var cvs = document.createElement('canvas');
		//naturalWidth真实图片的宽度
		//cvs.width = source_img_obj.naturalWidth;
		//cvs.height = source_img_obj.naturalHeight;
		var xRate = 200 / source_img_obj.naturalWidth;
		var yRate = 200 / source_img_obj.naturalHeight;
		cvs.width = 200;
		cvs.height = 200;
		var cvsContext = cvs.getContext('2d');
		cvsContext.scale(xRate, yRate);
		var ctx = cvsContext.drawImage(source_img_obj, 0, 0);
		var newImageData = cvs.toDataURL(mime_type, quality/200);
		var result_image_obj = new Image();
		result_image_obj.src = newImageData;
		return result_image_obj;
	}
};


}]);