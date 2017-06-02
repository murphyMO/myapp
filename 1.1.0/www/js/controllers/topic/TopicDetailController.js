/**
 * 社区-动态控制器
 */
app.controller('TopicDetailCtrl',
	['$scope', 'TopicService','$rootScope','$state','$localStorage','$CommonFactory','$ionicScrollDelegate','$cordovaToast','chatFactory','$stateParams','$sce', 'TransferPostDataService',
	function ($scope, TopicService,$rootScope,$state,$localStorage,$CommonFactory,$ionicScrollDelegate,$cordovaToast,chatFactory,$stateParams,$sce, TransferPostDataService) {
		$scope.replay_show = false;
		$scope.appNav = true; //底部导航为true显示
		$scope.re = {};
		$scope.topicDetail=[];//总话题详情
		$scope.articleArr=[];//每条话题详情
		$scope.topicCurrentPage = 1; //第1页开始
		$scope.itemsPerPage = 5; //每页5条
		$scope.topicIsOverLoad = false;
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.topic_id = $stateParams.topic_id;
		$scope.articleArrList = [];//每条话题详情列表,//上拉加载相关
		$scope.rank=$localStorage.topicRanking;
		$scope.topicIsEmptyData = false;
		var accesstoken = $rootScope.getAccessToken();
		var hasMore =true;
		$scope.user = $rootScope.getCurrentUser();
		//var sUserAgent = navigator.userAgent.toLowerCase();

		//获取话题详情
		$scope.getTopicDetail= function(){
			if (hasMore) {
				var data = {
					"accesstoken" : accesstoken,
					'topic_id':$scope.topic_id,
					'itemsPerPage' : $scope.itemsPerPage,//上拉加载相关
					'currentPage' : $scope.topicCurrentPage//上拉加载相关
				}
				$CommonFactory.showLoading();
				TopicService.getTopicDetail(data,function(response){
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.topicIsEmptyData = false;//x
						$scope.topicIsOverLoad = true;//x
						return;
					}
					$CommonFactory.hideLoading();

					$scope.topicDetail=response.data;
					$scope.articleArr=$scope.topicDetail.articleArr.data;
					if($scope.articleArr.length==0){
						$scope.noData=true
					}
					else{
						$scope.noData=false
					}
					$scope.topic_title=$scope.topicDetail.topic_title;
					for (var i = 0, len = $scope.articleArr.length; i < len; i++) {
						$scope.topicText = $scope.articleArr[i].article_content;//$scope.articleArr[i].article_content
						for(var k = 0,length=$scope.articleArr[i].topic.length;k < length;k++){
							$scope.topicTitle = "#" + $scope.articleArr[i].topic[k].topic_title + "#";
							$scope.topicId = $scope.articleArr[i].topic[k].topic_id;
							$scope.topicReplaceTitle =$sce.trustAsHtml("<a class='heroBlue' href='#/topicdetail/"+$scope.topicId+"'>" + $scope.topicTitle + "</a>");
							var rex = new RegExp($scope.topicTitle, 'g');
							$scope.topicText = $scope.topicText.replace(rex,$scope.topicReplaceTitle)

						}
						$scope.articleArr[i].article_content = $scope.topicText;
						$scope.articleArr[i].article_cre_time=$CommonFactory.showWeiboTime($scope.articleArr[i].now_time,$scope.articleArr[i].article_cre_time);//调用类微博时间方法
						$scope.topicImgItems = [];
						$scope.articleArrList.push($scope.articleArr[i]);//上拉加载相关 articleArr in articleArrList

						for(var j = 0; j<$scope.articleArr[i].article_data_photo.length; j++){
							$scope.topicImgItems.push({"src": $scope.commonPath.route_path+$scope.commonPath.dynamic_path+$scope.articleArr[i].article_data_photo[j]});
						}
					}

					//判断总数，防止无线滚动加载
					$scope.topicItemTotal = $scope.topicDetail.articleArr.page_info;
					if ($scope.topicCurrentPage * $scope.itemsPerPage >= $scope.topicItemTotal) {
						$scope.topicIsEmptyData = false;
						hasMore = false;
					}
					else {
						$scope.topicCurrentPage++;
						$scope.topicIsEmptyData = true;
						 $scope.$broadcast('scroll.infiniteScrollComplete');
						hasMore = true;
					}
				})
			}
		};
		$scope.getTopicDetail();

		//话题下拉刷新
		$scope.topicDoRefresh = function(){
			$scope.topicIsEmptyData = false;
			$scope.topicIsOverLoad = false;
			$scope.articleArrList = [];
			$scope.topicCurrentPage = 1;
			hasMore = true;
			$scope.getTopicDetail();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}

		//点赞功能
		$scope.likeYou = function(type,ser,isLike){
			if($rootScope.isGuest){
				$state.go('login');
			}else{
			var data = {
				"accesstoken" : accesstoken,
				"type_id":1,
				"versions" : "1.0.4",
				"target_id" : ser.article_data_id,
				"article_data_id" : ser.article_data_id
			}
			if(isLike == 1){
				data.status = 0;
			}
			else if(isLike == 0){
				//点赞
				data.status = 1;
				//发送即时消息
				var temp = {};
				temp.name = ser.article_data_user_name || ser.cre_user_name;
			}
			TopicService.likeYou(data,function(res){
				if(res.statuscode == 1){
					TopicService.getOneDynamic(data,function(r){
					if(r.statuscode == 1){
						ser.like = r.data.like;
						ser.is_like = r.data.is_like;
					}
					})
				}
			})
		}
	}

		//回复
		$scope.replayShow = function(type,ser,index,_type){
			if($rootScope.isGuest){
				$state.go('login');
			}else{
			$scope.index = index;
			$scope._type = _type;
			$scope.type=type;
			$scope.replay_show = !$scope.replay_show;
			$scope.serIttem = ser;
		}
	}
		$scope.sendReplay = function(){
			$scope.replay_show = !$scope.replay_show;
			if($scope.type == 1){
				//一级回复
				$scope.parentId = "";
				//发送即时消息
				var temp = {};
				temp.name = $scope.serIttem.article_data_user_name || $scope.serIttem.cre_user_name;
			}
			else if($scope.type == 2){
				//二级回复
				$scope.parentId=$scope.serIttem.message[$scope.index].message_id;
				//发送即时消息
				var temp = {};
				temp.name = $scope.serIttem.message[$scope.index].message_user_name;
			}
			var data = {
				"accesstoken" : accesstoken,
				"target_id" : $scope.serIttem.article_data_id,
				"type_id" : $scope._type,
				"message_content" : $scope.re.message_content,
				"parent_message_id" : $scope.parentId,
				"versions" : "1.0.4",
				"article_data_id" : $scope.serIttem.article_data_id
			}
			if(data.message_content == ''|| data.message_content == undefined){
				$CommonFactory.showAlert("回复内容不能为空");
				return;
			}
			TopicService.replay(data,function(res){
				$scope.re.message_content = "";//清空输入框
				if(res.statuscode == 1){
					TopicService.getOneDynamic(data,function(r){
					$scope.serIttem.message = r.data.message;
					})
				}
			})
		}

		$scope.replayBlur = function(){
			$scope.replay_show = false;
		}

		//实名点击头像查看信息
		$scope.change = function(i){
			if (i.article_type_status == 1) {
				$state.go("personalmsg",{user_id:i.article_data_user_id,com_id:i.article_com_id})//from
			}
			else{
				return;
			}
		}

		//长按回复-投诉
		$scope.onHold = function(name,id){
			$scope.msg = {};
			$CommonFactory.showCustomPopup(function(){
				if (!$scope.msg.message || ($scope.msg.message.trim() == "")) {
					//$cordovaToast.show("举报失败,请输入举报内容","short","center");
					$CommonFactory.showAlert("举报失败,请输入举报内容")
					return;
				}
				var data = {
					accesstoken : accesstoken,
					type_id : 5,
					target_id : id,
					report_comment : $scope.msg.message
				};
				TopicService.report(data, function(response){

					if (response.statuscode == CODE_SUCCESS) {
						//$cordovaToast.show("投诉成功，等待审核", "short", "center");
						$CommonFactory.showAlert("投诉成功，等待审核");
					}
				});
			}, $scope, '<textarea type="text" class="b-a padding-l-5" ng-model="msg.message" placeholder="投诉内容"></textarea>', '投诉 - '+'<strong>'+name+'</strong>');
		}

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};

		//查看企业
		$scope.viewCompany = function(arg1) {
			if ($rootScope.getCurrentUser().user_type == 1) {
				var message = "发布是会员专享权益哦，请尽快成为会员吧！如有疑问，请咨询小师妹400-900-9088";
				$CommonFactory.showConfirm($scope.goToMemauthority, message);
				return true;
			}
			$state.go('commsg', {'com_id':arg1});
		}

		//跳转到会员购买页面
		$scope.goToMemauthority = function() {
			$state.go('memauthority');
		};

		$scope.myBack = function() {
			//javascript:history.back();
			window.history.back();
		};

		//跳转至发布话题相关动态页面
		$scope.postDynamic = function() {
			if($rootScope.isGuest){
				$state.go('login');
			}else{
			var topic_title = '#'+$scope.topic_title+'# ';
			var tempArr = [{
				'topic_id' : $scope.topic_id,
				'topic_title' : $scope.topic_title
			}];
			var article = {
				'textarea_back' : '',
				'textarea_front' : '',
				'pos' : 0,
				'topicListFrom' : 'postdynamic',
				'content': '',
				'browser' : 'ff',
				'selectedTopic' : tempArr,
				'selectedTopicText' : topic_title,
				'poundfromInput' : false // the # sign from textarea or click the # directly
			};
			article.imgs = [];
			TransferPostDataService.setArticle(article);
			$state.go('postdynamic',{'from': 1,'topic_title': topic_title});
		}
	}
}
]);
