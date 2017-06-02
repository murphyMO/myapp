/**
 * 社区-话题发布控制器
 */
app.controller('TopicPostController',
	['$scope', '$rootScope', '$state', '$localStorage', '$CommonFactory', '$timeout',  '$cordovaToast', 'TopicService', 'TransferPostDataService', '$window',
	function ($scope, $rootScope, $state, $localStorage, $CommonFactory, $timeout, $cordovaToast, TopicService, TransferPostDataService, $window) {
		//用户凭证
		$scope.accesstoken = $rootScope.getAccessToken();

		//话题对象声明
		//鼠标位置记录
		$scope.topic;
		$scope.topic = TransferPostDataService.getTopic();
		if ($scope.topic) {
			if ($scope.topic.selectedTopicText) {
				insertTopicText($scope.topic.selectedTopicText);
			}
		} else {
			$scope.topic = {
				'textarea_back' : '', 
				'textarea_front' : '', 
				'pos' : 0,
				'topicListFrom' : 'topicpost',
				'content': ''
			};
		}
		

		//#位置
		$scope.currentIndexOfPoundSign = -1;

		//last focused dom
		$scope.lastFocused;

		//判断浏览器
		$scope.browser = 'ff';



		//返回事件
		$scope.back = function() {
			$scope.topic = null;
			TransferPostDataService.setTopic($scope.topic);
			window.history.back();
		};

		//检测输入#弹出话题选择列表, get position of current #
		$scope.checkInputLetter = function(obj) {
			if (obj.keyCode == 51 && obj.key == '#') {
				$scope.openTopicList();
			}
		};

		//点击#按钮事件
		$scope.clickPoundSignButton = function() {
			//设置焦点到content.
			if (!$scope.topic.lastFocused) {
				var element = $window.document.getElementById("topic_content");
				$scope.topic.lastFocused = element;
				$scope.getPositionsInfo();
			} else {
				$scope.getPositionsInfo();
			}
			$scope.openTopicList();
		};

		//弹出话题选择列表
		$scope.openTopicList = function() {
			if (!$rootScope.isEmptyObject($scope.topic)) {
				//$localStorage.topic = $scope.topic;
				TransferPostDataService.setTopic($scope.topic);
			}
			/*$localStorage.topicPositionInfo = $scope.topic;
			$localStorage.topicListFrom = "topicpost";*/
			$state.go('topiclist');
		};

		//insert topic 
		function insertTopicText (text) {
			var textarea = $scope.topic.lastFocused;
			if (textarea == undefined) {
				return;
			}
			var browser = $scope.topic.browser;

			// if the selected topic text already exists in the topic content. then set the cursor to the end of the selected topic text

			if ($scope.topic.content.indexOf(text) != -1) {
				$scope.topic.pos = $scope.topic.content.indexOf(text) + text.length;
			} else {
				textarea.value = $scope.topic.textarea_front + text + $scope.topic.textarea_back;
				$scope.topic.content = textarea.value;
				$scope.topic.pos = $scope.topic.pos + text.length;
			}
			// console.log($scope.topic.pos);
			if (browser == "ie") { 
				textarea.focus();
				var range = document.selection.createRange();
				range.moveStart ("character", -textarea.value.length);
				range.moveStart ("character", $scope.topic.pos);
				range.moveEnd ("character", 0);
				range.select();
			} else if (browser == "ff") {
				textarea.selectionStart = $scope.topic.pos;
				textarea.selectionEnd = $scope.topic.pos;
				textarea.focus();
			}

			// textarea.scrollTop = scrollPos;
		};
		/*$scope.insertTopicText = function(text) {
			var textarea = $scope.lastFocused;
			if (textarea == undefined) {
				return;
			}
			textarea.value = $scope.topic.textarea_front + text + $scope.topic.textarea_back;
			$scope.topic.pos = $scope.topic.pos + text.length;
			if (browser == "ie") { 
				textarea.focus();
				var range = document.selection.createRange();
				range.moveStart ("character", -textarea.value.length);
				range.moveStart ("character", $scope.topic.pos);
				range.moveEnd ("character", 0);
				range.select();
			}
			else if (browser == "ff") {
				textarea.selectionStart = $scope.topic.pos;
				textarea.selectionEnd = $scope.topic.pos;
				textarea.focus();
			}
			textarea.scrollTop = scrollPos;
		};*/
		// click event to get cursor position
		$scope.click= function() {
			$scope.getPositionsInfo();
		}

		//获取鼠标在字符串的位置
		$scope.getPositionsInfo = function() {
			$scope.lastFocused = document.activeElement;
			$scope.topic.lastFocused = $scope.lastFocused;
			var textarea = $scope.lastFocused;
			if (textarea == undefined) {
				return;
			}
			var scrollPos = textarea.scrollTop;
			var browser  = $scope.browser = ((textarea.selectionStart || textarea.selectionStart == "0") ? "ff" : (document.selection ? "ie" : false ) );
			$scope.topic.browser = browser;
			if (browser == "ie") { 
				textarea.focus();
				var range = document.selection.createRange();
				range.moveStart ("character", -textarea.value.length);
				$scope.topic.pos = range.text.length;
			} else if (browser == "ff") { 
				$scope.topic.pos = textarea.selectionStart
			};
			if (textarea.value) {
				$scope.topic.textarea_front = (textarea.value).substring(0, $scope.topic.pos);
				$scope.topic.textarea_back = (textarea.value).substring($scope.topic.pos, textarea.value.length);
			} else {
				$scope.topic.textarea_front = '';
				$scope.topic.textarea_back = '';
			}
			
		};
	}
]);
