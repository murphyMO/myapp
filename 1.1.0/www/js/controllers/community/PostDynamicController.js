/**
 * 发布类型列表控制器
 */
app.controller('PostDynamicCtrl',
	['$scope', '$rootScope', '$window', '$timeout', '$localStorage', '$ionicHistory','$state', '$ionicActionSheet','$cordovaCamera', '$ionicModal', 'TransferPostDataService', 'CommunityService', '$CommonFactory', 'TopicService', '$stateParams', '$location',
	function ($scope, $rootScope, $window, $timeout, $localStorage, $ionicHistory, $state, $ionicActionSheet, $cordovaCamera, $ionicModal, TransferPostDataService, CommunityService, $CommonFactory, TopicService, $stateParams, $location) {
		$scope.user = $rootScope.getCurrentUser();
		// return event
		$scope.myGoBack = function() {
			//$state.go('tab.communitydynamic');
			window.history.back();
			TransferPostDataService.setArticle(null);
			$scope.article = null;
		};

		//用户凭证
		var accesstoken = $rootScope.getAccessToken();
		//accesstoken = 'sXhEEWG79rxeybBRCopJdEd_UmWnhtQD';

		//获取是否显示推荐
		$scope.showRecommend = ($stateParams.from == null) ? true : false;

		//页面元素绑定的对象
		$scope.article = TransferPostDataService.getArticle();
		if(!$scope.article){
			$scope.article = {
				'textarea_back' : '',
				'textarea_front' : '',
				'pos' : 0,
				'topicListFrom' : 'postdynamic',
				'content': '',
				'browser' : 'ff',
				'poundfromInput' : false // the # sign from textarea or click the # directly
			};
			$scope.article.imgs = [];
		} else {
			if ($scope.article.selectedTopicText) {
				getPositionsInfo();
				insertTopicText($scope.article.selectedTopicText);
				// empty the selectedTopicText
				$scope.article.selectedTopicText = '';
			}
		}

		//从话题详情跳转来的页面初始
		/*if($stateParams.from){
			insertTopicText($stateParams.topic_title);
			$scope.article.selectedTopicText = '';
		}*/
		$scope.article.post_type = 'dynamic';

		//#位置
		$scope.currentIndexOfPoundSign = -1;

		//last focused dom
		$scope.lastFocused;

		//检测输入#弹出话题选择列表, get position of current #
		$scope.checkInputLetter = function(obj) {
			/*if ((obj.keyCode == 51 && obj.key == '#') || (obj.keyCode == 229 && obj.key == 'Process')) {
				$scope.article.poundfromInput = true;
				$scope.getPositionsInfo();
				$scope.openTopicList();
			}*/
			if ((obj.shiftKey && obj.keyCode == 51) || (obj.shiftKey && obj.keyCode == 229)) {
				$scope.article.poundfromInput = true;
				$scope.getPositionsInfo();
				$scope.openTopicList();
			}
		};

		//点击#按钮事件
		$scope.clickPoundSignButton = function() {
			//设置焦点到content.
			/*if (!$scope.article.lastFocused) {
				var element = $window.document.getElementById("article_content");
				$scope.article.lastFocused = element;
				$scope.getPositionsInfo();
			} else {
				$scope.getPositionsInfo();
			}*/
			$scope.article.poundfromInput = false;
			$scope.getPositionsInfo();
			$scope.openTopicList();
		};

		//弹出话题选择列表
		$scope.openTopicList = function() {
			if (!$rootScope.isEmptyObject($scope.article)) {
				TransferPostDataService.setArticle($scope.article);
			}
			$state.go('topiclist');
		};

		//insert topic
		function insertTopicText (text) {
			// var textarea = $scope.article.lastFocused;
			var textarea = $window.document.getElementById("article_content");
			if (textarea == undefined) {
				return;
			}
			var browser = $scope.article.browser;

			// if the selected topic text already exists in the topic content. then set the cursor to the end of the selected topic text

			if ($scope.article.content.indexOf(text) != -1) {
				$scope.article.pos = $scope.article.content.indexOf(text) + text.length;
			} else {
				$scope.article.content = $scope.article.textarea_front + text + $scope.article.textarea_back;
				$scope.article.pos = $scope.article.pos + text.length;
			}
			// console.log($scope.article.pos);
			/*if (browser == "ie") {
				textarea.focus();
				var range = document.selection.createRange();
				range.moveStart ("character", -$scope.article.content.length);
				range.moveStart ("character", $scope.article.pos);
				range.moveEnd ("character", 0);
				range.select();
			} else if (browser == "ff") {
				textarea.selectionStart = $scope.article.pos;
				textarea.selectionEnd = $scope.article.pos;
				textarea.focus();
			} else {
				textarea.selectionStart = $scope.article.pos;
				textarea.selectionEnd = $scope.article.pos;
				textarea.focus();
			}*/

			// textarea.scrollTop = scrollPos;
		};
		var focusCount = 0;
		window.addEventListener('native.keyboardshow', keyboardShowHandler);

		function keyboardShowHandler(e){
			if($state.current.name == "postdynamic" && focusCount==0){
				var textarea = $window.document.getElementById("article_content");
				textarea.selectionStart = $scope.article.content.length;
				textarea.selectionEnd = $scope.article.content.length;
				focusCount ++;
			}
			return true;
		}
		// click event to get cursor position
		$scope.click= function() {
			$scope.getPositionsInfo();
		}

		//获取鼠标在字符串的位置
		$scope.getPositionsInfo = function() {
			// $scope.lastFocused = document.activeElement;

			// var textarea = $scope.lastFocused;
			var textarea = $window.document.getElementById("article_content");
			if (textarea == undefined) {
				return;
			}
			// $scope.article.lastFocused = textarea;
			var scrollPos = textarea.scrollTop;
			// var browser  = $scope.article.browser = ((textarea.selectionStart || textarea.selectionStart == "0") ? "ff" : (document.selection ? "ie" : false ) );
			var browser = (("selectionStart" in textarea) ? "ff" : (document.selection ? "ie" : false ) );
			$scope.article.browser = browser;
			if (browser == "ie") {
				textarea.focus();
				var range = document.selection.createRange();
				range.moveStart ("character", -$scope.article.content.length);
				if ($scope.article.poundfromInput) {
					$scope.article.pos = range.text.length - 1;
				} else {
					$scope.article.pos = range.text.length;
				}

			} else if (browser == "ff") {
				if ($scope.article.poundfromInput) {
					$scope.article.pos = textarea.selectionStart - 1;
				} else {
					$scope.article.pos = textarea.selectionStart;
				}
			} else {
				if ($scope.article.poundfromInput) {
					$scope.article.pos = textarea.selectionStart - 1;
				} else {
					$scope.article.pos = textarea.selectionStart;
				}
			};
			if ($scope.article.content) {
				$scope.article.textarea_front = ($scope.article.content).substring(0, $scope.article.pos);
				if ($scope.article.poundfromInput) {
					$scope.article.textarea_back = ($scope.article.content).substring($scope.article.pos + 1, $scope.article.content.length);

				} else {
					$scope.article.textarea_back = ($scope.article.content).substring($scope.article.pos, $scope.article.content.length);
				}

			} else {
				$scope.article.textarea_front = '';
				$scope.article.textarea_back = '';
			}
		};


		//post dynamic
		$scope.postDynamic = function() {
			if (!$scope.article.content) {
				$CommonFactory.showAlert('请输入动态内容');
				return;
			}
			$scope.article.content = $scope.article.content.replace('<br />','/n');
			// console.log($scope.article.content);
			var imgPath = [];
			if($scope.article.imgs && $scope.article.imgs.length > 0){
				angular.forEach($scope.article.imgs,function(subitem){
					imgPath.push(subitem.img_path);
				});
			}else{
				imgPath = null;
			}
			var selectedTopicArr = [];
			if ($scope.article.selectedTopic) {
				var len = $scope.article.selectedTopic.length;
				for (var i = 0; i < len; i++) {
					// 2016.10.14 fix bug start: need also remove the selected topic from the selectedTopicArr - wangdi.
					// if the #topictitle# exists in the article content, then push the topic id to selectedTopicArr...
					var topicText = "#" + $scope.article.selectedTopic[i].topic_title + "#";
					if ($scope.article.content.indexOf(topicText) != -1) {
						selectedTopicArr.push($scope.article.selectedTopic[i].topic_id);
					}
					// 2016.10.14 fix bug end: need also remove the selected topic from the selectedTopicArr - wangdi.
				}
			}
			var data = {
				'accesstoken' : accesstoken,
				'article_data_title' : $scope.article.title,
				'article_content' : $scope.article.content,
				'article_data_photo' : imgPath,
				'article_type_id' : selectedTopicArr.length > 0 ? 9 : 5,
				'article_type_status' : $scope.data.article_type_status,
				'topic_id' : selectedTopicArr.length > 0 ? selectedTopicArr : null
			};
			$CommonFactory.showLoading();
			CommunityService.postArticle(data, function(res){
				if(res.statuscode == CODE_SUCCESS){
					if(selectedTopicArr.length > 0) {

						$localStorage.set("communityPage",1);
						$state.go('tab.communitydynamic');
						// $window.location.reload(true);
						// $window.location.href = "/tab/dynamic";
						// $state.go('tab.communitydynamic',{},{reload:true});

						// $window.location.reload(true);
						$CommonFactory.hideLoading();
						/*$state.go('tab.communitydynamic',{},{notify:false});
						$window.location.reload(true);
						$CommonFactory.hideLoading();*/


					} else {
						$localStorage.set("communityPage",0);
						$state.go('tab.communitydynamic');
						// $window.location.reload(true);
						// $window.location.href = "/tab/dynamic";
						// $state.go('tab.communitydynamic',{},{reload:true});
						// $window.location.reload(true);
						$CommonFactory.hideLoading();
						/*$state.go('tab.communitydynamic',{},{notify:false});
						$window.location.reload(true);
						$CommonFactory.hideLoading();*/
					}

					$scope.article = null;
					TransferPostDataService.setArticle(null);

				}else{
					$CommonFactory.hideLoading();
					$CommonFactory.showAlert('系统错误');
				}
			});

		};
		//选择图片指令
		$scope.cameraOptions = {
			quality: 50,
			maximumImagesCount:9,
			width: 1280,
			height: 852,
			post_type: 5
		};

		//发布类型选择
		$scope.items = [
		{
			"id": "1",
			"name": "实名发布"
		},
		{
			"id": "2",
			"name": "匿名发布"
		}];

		$scope.data = {};
		$scope.data.article_type_status = $scope.items[0].id;  //需要第几个值

		//get recommend topic list
		$scope.getRecommendTopic = function() {
			var data = {
				'accesstoken' : accesstoken,
				'currentPage' : 1,
				'itemsPerPage' : 3,
				'status' : 1,
				'recommend' : 1,
				'sortkey' : 'cre_time',
				'sortstatus' : 'desc'
			};
			$CommonFactory.showLoading();
			TopicService.getRecommendTopic(data, function(res) {
				$CommonFactory.hideLoading();
				if (res.statuscode == CODE_SUCCESS) {
					$scope.recommendTopicList = res.data;
				}
			});
		};

		$scope.getRecommendTopic();

		//select recommend topic which listed at bottom of post dynamic page
		$scope.selectTopic = function(item) {
			/*if (!$scope.article.lastFocused) {
				var element = $window.document.getElementById("article_content");
				$scope.article.lastFocused = element;
				$scope.getPositionsInfo();
			} else {
				$scope.getPositionsInfo();
			}*/
			$scope.article.poundfromInput = false;
			$scope.getPositionsInfo();
			var article = $scope.article;

			if (!article.selectedTopic) {
				article.selectedTopic = [];
			}
			if (!checkObjInArr(item, article.selectedTopic)) {
				article.selectedTopic.push(item);
			}

			insertTopicText( "#" + item.topic_title + "# " );

		};

		// check whether the selected topic already exists in the selected topic arr
		function checkObjInArr(obj, arr) {
			var exists = false;
			var len = arr.length;
			for (var i = 0; i < len; i++) {
				if (arr[i].topic_id == obj.topic_id) {
					exists = true;
					return exists;
				}
			}
			return exists;
		};

		// if change the text value in the textarea, should update the $scope.article.textarea_front and $scope.article.textarea_back etc
		var timeoutPromise;
		$scope.$watch('article.content', function(newValue, oldValue) {
			$timeout.cancel(timeoutPromise);
			timeoutPromise = $timeout(function() {
				if ($state.current && $state.current.name == 'postdynamic') {
					$scope.getPositionsInfo();
				}
			}, 500);
		});

		//
		//获取鼠标在字符串的位置
		function getPositionsInfo () {
			// $scope.lastFocused = document.activeElement;

			// var textarea = $scope.lastFocused;
			var textarea = $window.document.getElementById("article_content");
			if (textarea == undefined) {
				return;
			}
			// $scope.article.lastFocused = textarea;
			var scrollPos = textarea.scrollTop;
			// var browser  = $scope.article.browser = ((textarea.selectionStart || textarea.selectionStart == "0") ? "ff" : (document.selection ? "ie" : false ) );
			var browser = (("selectionStart" in textarea) ? "ff" : (document.selection ? "ie" : false ) );
			$scope.article.browser = browser;
			if (browser == "ie") {
				textarea.focus();
				var range = document.selection.createRange();
				range.moveStart ("character", -$scope.article.content.length);
				if ($scope.article.poundfromInput) {
					$scope.article.pos = range.text.length - 1;
				} else {
					$scope.article.pos = range.text.length;
				}

			} else if (browser == "ff") {
				if ($scope.article.poundfromInput) {
					$scope.article.pos = textarea.selectionStart - 1;
				} else {
					$scope.article.pos = textarea.selectionStart;
				}

			};
			if ($scope.article.content) {
				$scope.article.textarea_front = ($scope.article.content).substring(0, $scope.article.pos);
				if ($scope.article.poundfromInput) {
					$scope.article.textarea_back = ($scope.article.content).substring($scope.article.pos + 1, $scope.article.content.length);

				} else {
					$scope.article.textarea_back = ($scope.article.content).substring($scope.article.pos, $scope.article.content.length);
				}

			} else {
				$scope.article.textarea_front = '';
				$scope.article.textarea_back = '';
			}
		};
}]);
