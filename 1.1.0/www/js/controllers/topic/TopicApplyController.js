/**
 * 社区-话题申请控制器
 */
app.controller('TopicApplyController',
	['$scope', '$rootScope', '$state', '$localStorage', '$CommonFactory', '$timeout',  '$cordovaToast', 'TopicService',
	function ($scope, $rootScope, $state, $localStorage, $CommonFactory, $timeout, $cordovaToast, TopicService) {
		//用户凭证
		$scope.accesstoken = $rootScope.getAccessToken();
		$scope.user = $rootScope.getCurrentUser();
		//声明话题对象
		$scope.topic = {};

		//话题标题是否重复
		var topic_title_duplicate = false;

		//判断话题名称是否重复
		$scope.checkTopicNameValid = function() {
			var data = {
				'accesstoken' : $scope.accesstoken,
				'topic_title' : $scope.topic.name
			};
			//验证话题名称是否重复
			TopicService.checkTopicNameValid(data, function(res){
				if (res.statuscode == CODE_SUCCESS){
					topic_title_duplicate = false;
				}else{
					topic_title_duplicate = true;
				}
			});
		};

		//申请话题方法
		$scope.applyTopic = function() {
			if (!$scope.topic.name) {
				$CommonFactory.showAlert('请输入话题名称');
				return;
			}
			if (!$scope.topic.desc) {
				$CommonFactory.showAlert('请输入话题描述');
				return;
			}
			$scope.checkTopicNameValid();
			if (topic_title_duplicate) {
				$CommonFactory.showAlert('话题标题已经存在，请重新输入');
				return;
			}

			var data = {
				'accesstoken' : $scope.accesstoken,
				'topic_title' : $scope.topic.name,
				'topic_content' : $scope.topic.desc
			};
			//确认文本
			var confirmText = '你的话题已经申请成功，小师妹会在一个小时内（工作时间）进行审核，审核结果会以消息的形式发送至您的联系页面中。' + '<br /> 如还有问题，请联系小师妹400-900-9088';
			$CommonFactory.showLoading();
			TopicService.applyTopic(data, function(res){
				$CommonFactory.hideLoading();
				if (res.statuscode == CODE_SUCCESS) {
					$CommonFactory.showBaseConfirm(function() {
						$scope.back();
					}, confirmText);
				}
			});

		};

		// back event
		$scope.back = function() {
			if ($state.params.from) {
				$state.go($state.params.from);
			} else {
				window.history.back();
			}
		}
	}
]);
