/*
*	图片加载错误时显示默认图片
*/
var commonDirective = angular.module('CommonDirective',[]);
/**
 * 图片错误加载指令
 */
commonDirective.directive('errSrc', function() {
	return {
		link: function(scope, element, attrs) {
			element.bind('error', function() {
				if (attrs.src != attrs.errSrc || attrs.imageLazySrc != attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});
			attrs.$observe('ngSrc', function(value) {
				if (!value && attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});
			attrs.$observe('imageLazySrc', function(value) {
				if (!value && attrs.errSrc) {
					attrs.$set('src', attrs.errSrc);
				}
			});
		}
	}
});
/*
*	公司名片指令
*/
commonDirective.directive('companyBusinessCard', function() {
	return {
		restrict : 'AE',
		replace : 'true',
		templateUrl : 'templates/contact/company_business_card.html',
		scope : {
			companyinfo:'=companyinfo'
		}
	}
});
/*
*	个人名片指令
*/
commonDirective.directive('personalBusinessCard', function() {
	return {
		restrict : 'AE',
		replace : 'true',
		templateUrl : 'templates/contact/personal_business_card.html',
		scope : {
			personinfo:'=personinfo'
		}
	}
});
/*
*	产品名片指令
*/
commonDirective.directive('productCard', function() {
	return {
		restrict : 'AE',
		replace : 'true',
		templateUrl : 'templates/contact/product_intr_card.html',
		scope : {
			productinfo:'=productinfo'
		}
	}
});
/*
*	系统消息指令
*/
commonDirective.directive('systemMessageCard', function() {
	return {
		restrict : 'AE',
		replace : 'true',
		templateUrl : 'templates/contact/system_message_card.html',
		scope : {
			systemmessage:'=systemmessage'
		}
	}
});
/*
*	上传图片指令
*/
commonDirective.directive('uploadImage',['$ionicActionSheet', '$localStorage', '$cordovaCamera', '$rootScope', function($ionicActionSheet, $localStorage, $cordovaCamera, $rootScope){
	var accesstoken = $rootScope.getAccessToken();
	var uri = window.platformServer+'commons/common-upload?accesstoken='+accesstoken;
	var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
	console.log(commonPath);
	var imgPath = commonPath.route_path;
	return {
		restrict : 'E',
		scope : {
			'uploadImages': '=',
			'cameraOptions' : '=',
			'template' : '@'
		},
		template : '<i class="icon ion-ios-camera-outline"></i>',
		replace : true,
		link : link
	};

	function link(scope, element, attrs) {
		element.on('click', showSelect);
		if (scope.template && scope.template.length > 0) {
			element.removeClass('ion-ios-camera-outline').addClass(scope.template);
		}
		var hideSheet;
		

	
		function showSelect() {
			hideSheet = $ionicActionSheet.show({
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
		}
		//点击拍照或者选择相册事件
		function selectImg(index) {
			scope.cameraOptions.destinationType =  Camera.DestinationType.FILE_URI;
			scope.cameraOptions.sourceType =  index;
			if(index == 0){
				window.imagePicker.getPictures(
					function(results) {
						for (var i = 0; i < results.length; i++) {
							uploadImg(uri, results[i]);
						}
						hideSheet();
					}, function (error) {
						hideSheet();
					},scope.cameraOptions);
				$cordovaCamera.cleanup();
			}
			if(index == 1){
				scope.cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
				$cordovaCamera.getPicture(scope.cameraOptions).then(function(imageURI){
						uploadImg(uri, imageURI);
						hideSheet();
						$cordovaCamera.cleanup();
					},function(err){
						hideSheet();
					});
				
			}
		};

		function win(r) {
			/*console.log("Code = " + r.responseCode);
			console.log("Response = " + r.response);
			console.log("Sent = " + r.bytesSent);*/
			var results = JSON.parse(r.response);
			if(results.statuscode == window.CODE_SUCCESS){
				var img = {};
				img.src = imgPath + results.data;
				img.img_path = results.data.substr(results.data.lastIndexOf('/')+1);
				scope.uploadImages.push(img);
				scope.$apply();
			}
		};

		function fail(error) {
			alert("An error has occurred: Code = " + error.code);
			console.log("upload error source " + error.source);
			console.log("upload error target " + error.target);
		};

		

		function uploadImg(uri, fileURL) {
			var options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
			options.mimeType="text/plain";

			var headers={'headerParam':'headerValue'};

			options.headers = headers;

			var params = {'type': scope.cameraOptions.post_type};
			options.params = params;
			var ft = new FileTransfer();

			/*ft.onprogress = function(progressEvent) {
				if (progressEvent.lengthComputable) {
					loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
				} else {
					loadingStatus.increment();
				}
			};*/
			ft.upload(fileURL, uri, win, fail, options);

		}
	}

}]);

/*
*	上传头像指令
*/
commonDirective.directive('userimg',['$ionicActionSheet', '$localStorage', '$cordovaCamera', '$rootScope', function($ionicActionSheet, $localStorage, $cordovaCamera, $rootScope){
	var accesstoken = $rootScope.getAccessToken();
	var uri = window.platformServer+'commons/common-upload?accesstoken='+accesstoken;
	var commonPath = $localStorage.getObject(KEY_COMMON_PATH);
	var imgPath = commonPath.route_path;
	return {
		restrict : 'E',
		scope : {
			'uploadImages': '=',
			'cameraOptions' : '=',
			
		},
		link : link
	};

	function link(scope, element, attrs) {
		element.on('click', showSelect);
		var hideSheet;
		

	
		function showSelect() {
			hideSheet = $ionicActionSheet.show({
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
		}
		//点击拍照或者选择相册事件
		function selectImg(index) {
			scope.cameraOptions.destinationType =  Camera.DestinationType.FILE_URI;
			scope.cameraOptions.sourceType =  index;
			if(index == 0){
				window.imagePicker.getPictures(
					function(results) {
						for (var i = 0; i < results.length; i++) {
							scope.$emit('user-img', results[i]);
							uploadImg(uri, results[i]);
						}
						hideSheet();
					}, function (error) {
						hideSheet();
					},scope.cameraOptions);
				$cordovaCamera.cleanup();
			}
			if(index == 1){
				scope.cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
				$cordovaCamera.getPicture(scope.cameraOptions).then(function(imageURI){
						scope.$emit('user-img', imageURI);
						uploadImg(uri, imageURI);
						hideSheet();
						$cordovaCamera.cleanup();
					},function(err){
						hideSheet();
					});
				
			}
		};

		function win(r) {
			/*console.log("Code = " + r.responseCode);
			console.log("Response = " + r.response);
			console.log("Sent = " + r.bytesSent);*/
			var results = JSON.parse(r.response);
			if(results.statuscode == window.CODE_SUCCESS){
				var img = {};
				img.src = imgPath + results.data;
				img.img_path = results.data.substr(results.data.lastIndexOf('/')+1);
				scope.uploadImages = results.data.substr(results.data.lastIndexOf('/')+1);
				scope.$apply();
			}
		};

		function fail(error) {
			alert("An error has occurred: Code = " + error.code);
			console.log("upload error source " + error.source);
			console.log("upload error target " + error.target);
		};

		

		function uploadImg(uri, fileURL) {
			var options = new FileUploadOptions();
			options.fileKey="file";
			options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
			options.mimeType="text/plain";

			var headers={'headerParam':'headerValue'};

			options.headers = headers;

			var params = {'type': scope.cameraOptions.post_type};
			options.params = params;
			var ft = new FileTransfer();

			/*ft.onprogress = function(progressEvent) {
				if (progressEvent.lengthComputable) {
					loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
				} else {
					loadingStatus.increment();
				}
			};*/
			ft.upload(fileURL, uri, win, fail, options);

		}
	}

}]);



/*
	编译ng-bind-html中的html
*/
commonDirective.directive('compileTemplate', ['$compile','$parse',function($compile, $parse){
	return {
		link: function(scope, element, attr){
			var parsed = $parse(attr.ngBindHtml);
			function getStringValue() { return (parsed(scope) || '').toString(); }

			//Recompile if the template changes
			scope.$watch(getStringValue, function() {
				$compile(element, null, -9999)(scope);
			});
		}
	}
}]);

/**
 * 获取焦点
 */
commonDirective.directive('autoFocusWhen', ['$timeout' ,function($timeout) {
	return {
		restrict: 'A',
//		scope: {
//			autoFocusWhen: '='
//		},
		link: function(scope, element) {
			scope.$watch('replay_show', function(newValue) {
				if (newValue) {
					$timeout(function() {
						element[0].focus();
					}, 100);
				}
			});
//			element.on('blur', function() {
//				scope.$apply(function() {
//					scope.autoFocusWhen = false;
//				})
//			});
		}
	}
}]);

/**
 * 去焦点
 */
commonDirective.directive('autoBlurWhen', ['$timeout' ,function($timeout) {
	return {
		restrict: 'A',
		link: function(scope, element) {
			scope.$watch('isVoice', function(newValue) {
				if (!newValue) {
					$timeout(function() {
						element[0].blur();
					}, 200);
				}
			});
		}
	}
}]);

/**
 * 背景图片错误
 */

 commonDirective.directive('backgroundErrSrc', function() {
	return {
		link: function(scope, element, attrs) {
			if (!attrs.dbUrl) {
				attrs.$observe('backgroundErrSrc', function(value){
					element.css({'background-image': 'url(' + attrs.backgroundErrSrc + ')',
						'background-size' : 'cover',
						'background-repeat': 'no-repeat',
						'background-position' : 'center'
					});
				});
			} else {
				var image = new Image();
				image.src = attrs.dbUrl;
				image.onerror = function() {
					attrs.$observe('backgroundErrSrc', function(value){
						element.css({'background-image': 'url(' + attrs.backgroundErrSrc + ')',
							'background-size' : 'cover',
							'background-repeat': 'no-repeat',
							'background-position' : 'center'
						});
					});
				}
			}
			
		}
	}
});

commonDirective.directive('nodeMarquee', function($interval,$ionicModal) {
	return {
		restrict : 'E',
		scope:{
			noticeAry:"=noticeAry"
		},
		replace:true,
		templateUrl: 'templates/marquee.html',
		controller: function($scope, $element){
			//查看公告详情
			$scope.notice={};
			$scope.clickNotice = function(n){
				$scope.notice.comments = n.comments;
				$scope.notice.cre_time = n.cre_time;
				$scope.openNoticeModal();
			}

			// 首页公告详情弹出框
			$ionicModal.fromTemplateUrl('templates/modal/notice_modal.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.noticeModal = modal;
			});
			$scope.openNoticeModal = function() {
				$scope.noticeModal.show();
			};
			$scope.closeNoticeModal = function() {
				$scope.noticeModal.hide();
			};
		},
		link : function(scope, element, attrs){

		}
	}
});




/**
 * ng-repeat渲染页面完成指令
 */
commonDirective.directive('repeatFinish',function(){
	return {
		link: function(scope,element,attr){
			if(scope.$last == true){
				//向父控制器传递事件
				scope.$emit('to-repeat-parent');
//				//向子控制器传递事件
//				scope.$broadcast('to-child');
			}
		}
	}
})

// textarea高度自动增加
commonDirective.directive('elastic', [
	'$timeout',
	function($timeout) {
		return {
			restrict: 'A',
			link: function($scope, element) {
				$scope.initialHeight = $scope.initialHeight || element[0].style.height;
				var resize = function() {
					element[0].style.height = $scope.initialHeight;
					element[0].style.height = "" + element[0].scrollHeight + "px";
				};
				element.on("input change", resize);
				$timeout(resize, 0);
			}
		};
	}
]);