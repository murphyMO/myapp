/**
 * 社区-动态控制器
 */
app.controller('CommunityDynamicCtrl',
	['$scope', 'CommunityService','$rootScope','$state','$localStorage','$CommonFactory','$timeout','$ionicScrollDelegate','$cordovaToast','chatFactory','$ionicSlideBoxDelegate','$sce',
	function ($scope, CommunityService,$rootScope,$state,$localStorage,$CommonFactory,$timeout,$ionicScrollDelegate,$cordovaToast,chatFactory,$ionicSlideBoxDelegate,$sce) {
		$scope.replay_show = false;
		$scope.re = {};
		$scope.allList = [];//全部列表
		$scope.dynamicList = [];//动态列表
		$scope.topicList = [];//话题列表
		$scope.dynamicImgItems = [];
		$scope.allCurrentPage = 1; //第1页开始
		$scope.topicCurrentPage = 1; //第1页开始
		$scope.itemsPerPage = 5; //每页5条
		$scope.hasshare = false;//初始分享不显示
		$scope.accesstoken = $rootScope.getAccessToken();
		
		$scope.allIsOverLoad = false;
		$scope.topicIsOverLoad = false;
		var timeout = null; //搜索延迟
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		$scope.placeholder = "说点什么呢？";
		$scope.user = $rootScope.getCurrentUser();

		//默认发布modal hide
		$scope.post = {modalShow:false};

		$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
			$scope.accesstoken = $rootScope.getAccessToken();
			if (fromState.name == "postdynamic") {
				$scope.nowPage = $localStorage.get("communityPage");
				if ($localStorage.get("communityPage") == 0) {
					$scope.doRefresh(null);
				}
				else{
					$scope.doRefresh(9);
				}
			}
		});
		var hasMore =true;

		if ($localStorage.get("communityPage")) {
			$scope.nowPage = $localStorage.get("communityPage");
		}
		else{
			$scope.nowPage = 0
		}

		//搜索
		$scope.dynamicSearch = {
			"keyword" : ""
		}
		$scope.$watch("dynamicSearch",function(newVal,oldVal){
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				}
				timeout = $timeout(function(){

					hasMore = true;
					// 由于搜索框是同一个，需要判断是在哪个页面搜索，0--全部，1--动态，2--话题专区
					if ($scope.nowPage == 0) {
						$scope.allIsEmptyData = false;
						$scope.allIsOverLoad = false;
						$scope.allCurrentPage = 1;
						$scope.allList = [];//全部列表
						$scope.getList(null);
					}
					else if ($scope.nowPage == 1) {
						$scope.topicIsEmptyData = false;
						$scope.topicIsOverLoad = false;
						$scope.topicCurrentPage = 1;
						$scope.topicList = [];//话题列表
						$scope.getList(9);
					}
					hasMore = false;
				},500)
			}
		},true)

		//下拉刷新
		$scope.doRefresh = function(id){
			// $rootScope.getMessageDatas();
			// $rootScope.getLikeDatas();
			hasMore = true;
			// 判断是哪个页面在下拉刷新，0--全部，5--动态，9--话题专区
			if (id == null) {
				$scope.allIsEmptyData = false;
				$scope.allIsOverLoad = false;
				$scope.allCurrentPage = 1;
				$scope.allList = [];
				$scope.getList(id);
			}
			else if (id == 9) {
				$scope.topicIsEmptyData = false;
				$scope.topicIsOverLoad = false;
				$scope.topicCurrentPage = 1;
				$scope.topicList = [];
				$scope.getList(id);
			}
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}

		// 三个滑动页面公用一个方法获取列表，id--null获取全部列表，id--9获取话题列表
		$scope.getList = function(id){
			if (hasMore) {
				if (id == null) {
					$scope.currentPage = $scope.allCurrentPage;
				}
				else if (id == 9) {
					$scope.currentPage = $scope.topicCurrentPage;
				}
				var data = {
					"accesstoken" : $scope.accesstoken,
					"currentPage" : $scope.currentPage,
					"itemsPerPage" : $scope.itemsPerPage,
					"keyword" : $scope.dynamicSearch.keyword,
					"versions" : "1.0.4",
					"article_type_id" : id
				}
				CommunityService.getList(data,function(response){
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						if (id == null) {
							$scope.allIsEmptyData = true;
							$scope.allIsOverLoad = true;
						}
						else if (id == 9) {
							$scope.topicIsEmptyData = true;
							$scope.topicIsOverLoad = true;
						}
						return;
					}
					if(response.statuscode == CODE_SUCCESS){
						for (var i = 0, len = response.data.length; i < len; i++) {
							response.data[i].dynamicImgItems = [];
							response.data[i].article_cre_time = $CommonFactory.showWeiboTime(response.data[i].now_time,response.data[i].article_cre_time);
							var imgPath = "";
							switch (response.data[i].article_type_id) {
								case "1":
									imgPath = $scope.commonPath.needs_path;
									break;
								case "2":
									imgPath = $scope.commonPath.editer_uploads_path;
									break;
								case "3":
									imgPath = $scope.commonPath.companyIntr_path;
									break;
								case "4":
									imgPath = $scope.commonPath.userIntr_path;
									break;
								case "5":
									imgPath = $scope.commonPath.dynamic_path;
									break;
								case "6":
									imgPath = $scope.commonPath.party_path;
									break;
								case "8":
									imgPath = $scope.commonPath.party_path;
									break;
								case "9":
									imgPath = $scope.commonPath.dynamic_path;
									break;
							}
							if (response.data[i].article_type_id == 9) {
								$scope.topicText = response.data[i].article_content;
								for(var j = 0;j < response.data[i].topic.length;j++){
									$scope.topicTitle = "#" + response.data[i].topic[j].topic_title + "#";
									$scope.topicId = response.data[i].topic[j].topic_id;
									$scope.topicReplaceTitle ="<a class='heroBlue' ui-sref='topicdetail({topic_id : " + $scope.topicId + ",from : tab.communitydynamic})'>" + $scope.topicTitle + "</a>";
									$scope.topicId = response.data[i].topic[j].topic_id;
									var rex = new RegExp($scope.topicTitle, 'g');
									$scope.topicText = $scope.topicText.replace(rex,$scope.topicReplaceTitle)
								}
								response.data[i].article_content = $sce.trustAsHtml($scope.topicText);
							}
							for(var j = 0; j<response.data[i].article_data_photo.length; j++){
								response.data[i].dynamicImgItems.push({"src": $scope.commonPath.route_path + imgPath + response.data[i].article_data_photo[j]});
							}
							//null--全部，9--话题专区
							if (id == null) {
								$scope.allList.push(response.data[i]);
							}
							else if (id == 9) {
								$scope.topicList.push(response.data[i]);
							}
						}
					}
					//判断总数，防止无线滚动加载
					if (id == null) {
						$scope.allItemTotal = response.page_info;
						if ($scope.allCurrentPage * $scope.itemsPerPage >= $scope.allItemTotal) {
							$scope.allIsEmptyData = true;
							hasMore = false;
						}
						else {
							$scope.allCurrentPage++;
							$scope.$broadcast('scroll.infiniteScrollComplete');
							hasMore = true;
						}
					}
					else if (id == 9) {
						$scope.topicItemTotal = response.page_info;
						if ($scope.topicCurrentPage * $scope.itemsPerPage >= $scope.topicItemTotal) {
							$scope.topicIsEmptyData = true;
							hasMore = false;
						}
						else {
							$scope.topicCurrentPage++;
							$scope.$broadcast('scroll.infiniteScrollComplete');
							hasMore = true;
						}
					}
				})
			}
		};

		function getTopThree(){
			var data = {
				"accesstoken" : $scope.accesstoken,
				"currentPage" : 1,
				"itemsPerPage" : 3,
				"status" : 1,
				"recommend" : "",
				"keyword" : "",
				"type" : "",
				"topThree" : "2"
			}
			CommunityService.getTopThree(data,function(response){
				if (response.statuscode == 1) {
					$scope.getTopThreeList = response.data;
				}
			})
		}
		getTopThree();
		var nowTime = new Date();//现在时刻
		var nextTime = new Date();
		nextTime.setHours(nowTime.getHours()+1);//当前时刻的下一个整点
		nextTime.setMinutes(0);
		nextTime.setSeconds(0);
		setTimeout(nextHours,nextTime-nowTime);//用户登录后的下一个整点执行。

		function nextHours(){
		getTopThree();//在整点执行的函数，在每个整点都调用该函数
		setInterval(getTopThree,60*60*1000);//一个小时执行一次，那么下一个整点，下下一个整点都会执行
		}


		//点赞功能
		$scope.likeYou = function(type,ser,isLike){
			if($rootScope.isGuest){
				$state.go('login');
			}else{
			var data = {
				"accesstoken" : $scope.accesstoken,
				"type_id":1,
				"versions" : VERSIONS,
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
				chatFactory.sendCustomMsg(ser.article_data_user_id || ser.cre_user_id,"dianzan",temp);
			}
			CommunityService.likeYou(data,function(res){
				if(res.statuscode == 1){
					CommunityService.getOneDynamic(data,function(r){
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
			if (type == 1) {
				$scope.placeholder = "说点什么呢？";
			}
			else if (type == 2) {
				$scope.placeholder = "回复：" + $scope.serIttem.message[$scope.index].message_user_name;
			}
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
				chatFactory.sendCustomMsg($scope.serIttem.cre_user_id || $scope.serIttem.article_data_user_id,"liuyan",temp);
			}
			else if($scope.type == 2){
				//二级回复
				$scope.parentId=$scope.serIttem.message[$scope.index].message_id;

				//发送即时消息
				var temp = {};
				temp.name = $scope.serIttem.message[$scope.index].message_user_name;
				chatFactory.sendCustomMsg($scope.serIttem.message[$scope.index].message_user_id,"liuyan",temp);
			}
			var data = {
				"accesstoken" : $scope.accesstoken,
				"target_id" : $scope.serIttem.article_data_id,
				"type_id" : $scope._type,
				"message_content" : $scope.re.message_content,
				"parent_message_id" : $scope.parentId,
				"versions" : VERSIONS,
				"article_data_id" : $scope.serIttem.article_data_id
			}
			if(data.message_content == ''|| data.message_content == undefined){
				$CommonFactory.showAlert("回复内容不能为空");
				return;
			}
			CommunityService.replay(data,function(res){
				$scope.re.message_content = "";//清空输入框
				if(res.statuscode == 1){
					CommunityService.getOneDynamic(data,function(r){
					$scope.serIttem.message = r.data.message;
					})
				}
			})
		}
			//查看全部话题
		$scope.seeCom = function(){
			if($rootScope.isGuest){
				$state.go('login');
			}else{
				$state.go('topiclist');
			}
		}

		$scope.replayBlur = function(){
			$scope.replay_show = false;
		}

		//实名点击头像查看信息
		$scope.change = function(i){
			if (i.article_type_status == 1) {
				$state.go("personalmsg",{user_id:i.article_data_user_id,com_id:i.article_com_id,from:'tab.communitydynamic'})
			}
			else{
				return;
			}
		}


		//长按回复-投诉
		$scope.onHold = function(name,id){
			$scope.msg = {};
			$CommonFactory.showCustomPopup(function(){
				var data = {
					accesstoken : $scope.accesstoken,
					type_id : 5,
					target_id : id,
					report_comment : $scope.msg.message
				};
				CommunityService.report(data, function(response){
					if (response.statuscode == CODE_SUCCESS) {
						$cordovaToast.show("投诉成功，等待审核", "short", "center")
							.then(function(success) {
							// success
							}, function (error) {
							// error
						});
					}
				});
			}, $scope, '<textarea type="text" class="b-a padding-l-5" ng-model="msg.message" placeholder="投诉内容"></textarea>', '投诉 - '+'<strong>'+name+'</strong>');
		}




		if ($state.params.refresh == 'dynamic') {
			var page = $localStorage.get("communityPage");
			if (page == 0) {
				id=null
			}
			else if (page == 1) {
				id = 9
			}
			$scope.doRefresh(id);
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

		$scope.boxChanged = function(i){
			$scope.nowPage = i;
			$localStorage.set("communityPage",i);
		}
		$scope.clickAll = function(){
			$ionicSlideBoxDelegate.slide(0)
		}
		// $scope.clickDynamic = function(){
		// 	$ionicSlideBoxDelegate.slide(1)
		// }
		$scope.clickTopic = function(){
			$ionicSlideBoxDelegate.slide(1)
		}

		//选择发布类型
		$scope.selectPostType = function() {
			if($rootScope.isGuest){
				$state.go('login');
			}else{
			$scope.post.modalShow = !$scope.post.modalShow;
			//$scope.post.modalShow 初始化为false但是ios进来会闪一下，故直接display none,需要显示再来操作display---xuan
			/*if ($scope.post.modalShow) {
				angular.element(document.querySelector('.post-modal-flag')).removeClass("display-none");
			} else {
				angular.element(document.querySelector('.post-modal-flag')).addClass("display-none");
			}*/
			}
		};
		//隐藏发布类型选择modal
		$scope.hidePostModal = function() {
			$scope.post.modalShow = false;
			// angular.element(document.querySelector('.post-modal-flag')).addClass("display-none");
		};
		//发布动态事件
		$scope.postDynamic = function() {
			$scope.post.modalShow = false;
			$state.go('postdynamic');
		};

		//申请话题事件
		$scope.postTopic = function() {
			$scope.post.modalShow = false;
			$state.go('topicapply');
		};

		$scope.disableSwipeSlide = function() {
			$ionicSlideBoxDelegate.enableSlide(false);
		}
		$scope.enableSwipeSlide = function() {
			$ionicSlideBoxDelegate.enableSlide(true);
		}










	}
]);
