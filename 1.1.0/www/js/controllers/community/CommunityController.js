/**
 * 社区控制器
 */
app.controller('CommunityCtrl',
	['$scope', 'CommunityService','$rootScope','$state','$localStorage','$CommonFactory','$timeout','$ionicScrollDelegate','$cordovaToast','chatFactory', 'BusinessService',
	function ($scope, CommunityService,$rootScope,$state,$localStorage,$CommonFactory,$timeout,$ionicScrollDelegate,$cordovaToast,chatFactory, BusinessService) {
		$scope.replay_show = false;
		$scope.appNav = true; //底部导航为true显示
		$scope.re = {};
		$scope.dynamicList = [];//动态列表
		$scope.activityList = [];//活动列表
		$scope.dynamicImgItems = [];
		$scope.activityImgItems = [];
		$scope.dynamicCurrentPage = 1; //第1页开始
		$scope.activityCurrentPage = 1; //第1页开始
		$scope.dserviceCurrentPage = 1;
		$scope.itemsPerPage = 5; //每页10条
		$scope.hasshare = false;//初始分享不显示
//		var accesstoken = $localStorage.get("accesstoken");
		var accesstoken = $rootScope.getAccessToken();
		var hasMore =true;
		$scope.demandKeyword = '';
		var timeout = null; //搜索延迟
		$scope.serviceList = [];
		$scope.serviceTwoTypeList = [];
		var this_page = 1;
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);

		// 点击社区顶部导航
		$scope.clickTitle = function(i){
			this_page = i;
			$localStorage.set("thisPage",this_page)
			if (this_page == 1) {
				$state.go("tab.community")
			}
			else if (this_page == 2) {
				$state.go("tab.communitydynamic")
			}
			else if (this_page == 3) {
				$state.go("tab.communityactivity")
			}
		}


		//服务分类
		$scope.getServiceTwoTypeDatas = function(){
			var data = {
				accesstoken: accesstoken,
				//currentPage: 1,
				//itemsPerPage: 3,
				store_id: -1,
				id: 36
			}
			BusinessService.serviceTypeDatas(data, function(response){
				if (response.statuscode == CODE_SUCCESS) {
					$scope.serviceTwoTypeList = response.data;
					console.log($scope.serviceTwoTypeList.length);
					/*if($scope.serviceTypeList.length>=12){
						$rootScope.showMoreTwo = true;
					}*/
				}
			});
		};

		$scope.getServiceTwoTypeDatas();
		
		
		
		//获取服务列表
		$scope.getServiceDatas = function(){
			$localStorage.set("thisPage",this_page)
			if ($localStorage.get("thisPage") == 1) {
				var data = {
					accesstoken: accesstoken,
					currentPage: $scope.dserviceCurrentPage,
					itemsPerPage: $scope.itemsPerPage,
					store_id: $scope.currentStoreId,
					home_recommend : true
				}
				BusinessService.serviceDatas(data, function(response){
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.isEmptyData = false;
						return;
					}
					//有数据
					var tmpData = response.data;
					for (var i = 0, len = tmpData.length; i < len; i++) {
						//缩略图去第一张
						tmpData[i].com_service_thumb_img = "";
						if (tmpData[i].com_service_thumb && tmpData[i].com_service_thumb.length > 0) {
							tmpData[i].com_service_thumb_img = tmpData[i].com_service_thumb[0];
						}
						//所属岛
						tmpData[i].range_last = "";
						if (tmpData[i].range && tmpData[i].range.length > 0) {
							if (tmpData[i].range[0].store) {
								tmpData[i].range_last = tmpData[i].range[0].store;
							} else if (tmpData[i].range[0].city) {
								tmpData[i].range_last = tmpData[i].range[0].city;
							} else if (tmpData[i].range[0].province) {
								tmpData[i].range_last = tmpData[i].range[0].province;
							}
						}
						$scope.serviceList.push(tmpData[i]);
					}
					//判断总数，防止无线滚动加载
					$scope.itemTotal = response.page_info;
					if ($scope.currentPage * $scope.itemsPerPage > $scope.itemTotal) {
						$scope.isEmptyData = true;
					} else {
						$scope.dserviceCurrentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}
				});
			}

		};
		

		//分享
		$scope.openshare = function(){
			$scope.hasshare = true;
		}
		$scope.closeshare = function(){
			$scope.hasshare = false;
		}

		//搜索动态
		$scope.dynamicSearch = {
			"keyword" : ""
		}
		$scope.$watch("dynamicSearch",function(newVal,oldVal){
			if (newVal != oldVal) {
				if (timeout) {
					$timeout.cancel(timeout);
				}
				timeout = $timeout(function(){
					$scope.dynamicIsEmptyData = false;
					$scope.dynamicIsOverLoad = false;
					$scope.dynamicCurrentPage = 1;
					$scope.dynamicList=[];
					hasMore = true;
					$scope.getDynamicList();
					hasMore = false;
				},500)
			}
		},true)

		//动态下拉刷新
		$scope.dynamicDoRefresh = function(){
			$scope.dynamicIsEmptyData = false;
			$scope.dynamicIsOverLoad = false;
			$scope.dynamicList = [];
			$scope.dynamicCurrentPage = 1;
			$scope.getDynamicList();
			$scope.$broadcast('scroll.refreshComplete');
		}

		//活动下拉刷新
		$scope.activityDoRefresh = function(){
			$scope.activityIsEmptyData = false;
			$scope.activityIsOverLoad = false;
			$scope.activityList = [];
			$scope.activityCurrentPage = 1;
			$scope.getActivityList();
			$scope.$broadcast('scroll.refreshComplete');
		}

		$scope.getDynamicList = function(){
			if ($localStorage.get("thisPage") == 2) {
				if (hasMore) {
					var data = {
						"accesstoken" : accesstoken,
						"currentPage" : $scope.dynamicCurrentPage,
						"itemsPerPage" : $scope.itemsPerPage,
						"keyword" : $scope.dynamicSearch.keyword
					}

					CommunityService.getDynamicList(data,function(response){
						//console.log(response);
						//没有数据
						if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
							$scope.dynamicIsEmptyData = true;
							$scope.dynamicIsOverLoad = true;
							return;
						}
						if(response.statuscode == CODE_SUCCESS){
							for (var i = 0, len = response.data.length; i < len; i++) {
								response.data[i].dynamicImgItems = [];
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
								}
								for(var j = 0; j<response.data[i].article_data_photo.length; j++){
									response.data[i].dynamicImgItems.push({"src": $scope.commonPath.route_path + imgPath + response.data[i].article_data_photo[j]});
								}
							$scope.dynamicList.push(response.data[i]);
							}
						}
						//判断总数，防止无线滚动加载
						$scope.dynamicItemTotal = response.page_info;
						if ($scope.dynamicCurrentPage * $scope.itemsPerPage > $scope.dynamicItemTotal) {
							$scope.dynamicIsEmptyData = true;
							hasMore = false;
						}
						else {
							$scope.dynamicCurrentPage++;
							$scope.$broadcast('scroll.infiniteScrollComplete');
							hasMore = true;
						}
					})
				}
			}
		};


		//点赞功能
		$scope.likeYou = function(type,ser,isLike){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			var data = {
				"accesstoken" : accesstoken,
				"type_id":''
			}
			if (type==1) {
				data.type_id = 1;
				data.target_id = ser.article_data_id;
			}
			else if (type==2) {
				data.type_id = 2;
				data.target_id = ser.com_needs_id;
				data.com_needs_id = ser.com_needs_id;
			}
			else if (type==3) {
				data.type_id = 3;
				data.target_id = ser.party_id;
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
					if (type==1) {
						CommunityService.getOneDynamic(data,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
					else if (type==2) {
						CommunityService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
					else if (type==3) {
						CommunityService.getOneActivity(data,function(r){
							console.log(r)
						if(r.statuscode == 1){
							ser.like = r.data[0].like;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
				}
			})
		}


		$scope.CompletedEvent = function (scope) {
			console.log("Completed Event called");
		};

		$scope.ExitEvent = function (scope) {
			console.log("Exit Event called");
		};

		$scope.ChangeEvent = function (targetElement, scope) {
			console.log("Change Event called");
			console.log(targetElement);  //The target element
			console.log(this);  //The IntroJS object
		};

		$scope.BeforeChangeEvent = function (targetElement, scope) {
			console.log("Before Change Event called");
			console.log(targetElement);
		};

		$scope.AfterChangeEvent = function (targetElement, scope) {
			console.log("After Change Event called");
			console.log(targetElement);
		};

		$scope.IntroOptions = {
			steps:[
				{
					element: document.querySelector('#step1'),
					intro: "这是第一步"
				},
				{
					element: document.querySelectorAll('#step2')[0],
					intro: "这是第二步"
				},
				{
					element: '#step3',
					intro: '这是第三步'
				},
				{
					element: '#step4',
					intro: "这是第四步"
				},
				{
					element: '#step5',
					intro: '这是第五步'
				},
				{
					element: '#step6',
					intro: '这是第六步'
				}
			],
			showStepNumbers: false,//是否显示第几步
			exitOnOverlayClick: false,//默认不能点击遮罩层退出
			exitOnEsc:true,//esc退出
			nextLabel: '<strong>下一步</strong>',
			prevLabel: '<span style="color:green">上一步</span>',
			skipLabel: '跳过',
			doneLabel: '完成'
		};

		$scope.ShouldAutoStart = false;//自动触发


		//回复
		$scope.replayShow = function(type,ser,index,_type){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			
			$scope.index = index;
			$scope._type = _type;
			$scope.type=type;
			$scope.appNav = !$scope.appNav;
			$scope.replay_show = !$scope.replay_show;
			
			$scope.serIttem = ser;
		}
		$scope.sendReplay = function(){
			$scope.replay_show = !$scope.replay_show;
			$scope.appNav = true;

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
				$scope.parentId=$scope.serIttem.service_message_info[$scope.index].message_id;
				//发送即时消息
				var temp = {};
				temp.name = $scope.serIttem.service_message_info[$scope.index].message_user_name;
				chatFactory.sendCustomMsg($scope.serIttem.service_message_info[$scope.index].message_user_id,"liuyan",temp);
			}
			var data = {
				"accesstoken" : accesstoken,
				"target_id" : '',
				"type_id" : $scope._type,
				"message_content" : $scope.re.message_content,
				"parent_message_id" : $scope.parentId
			}
			if ($scope._type == 1) {
				data.target_id = $scope.serIttem.article_data_id;
			}
			else if ($scope._type == 2) {
				data.target_id = $scope.serIttem.com_needs_id;
				data.com_needs_id = $scope.serIttem.com_needs_id;
			}
			else if ($scope._type == 3) {
				data.target_id = $scope.serIttem.party_id;
			}
			if(data.message_content == ''|| data.message_content == undefined){
				$CommonFactory.showAlert("回复内容不能为空");
				return;
			}
			// else{
			// 	$CommonFactory.showLoading();
			// }
			CommunityService.replay(data,function(res){
				$scope.re.message_content = "";//清空输入框
				if(res.statuscode == 1){
					// $CommonFactory.hideLoading();
					if ($scope._type == 1) {
						CommunityService.getOneDynamic(data,function(r){
						$scope.serIttem.service_message_info = r.data[0].service_message_info;
					})
					}
					else if ($scope._type == 2) {
						CommunityService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							$scope.serIttem.service_message_info = r.data[0].service_message_info;
						}
					})
					}
					else if ($scope._type == 3) {
						CommunityService.getOneActivity(data,function(r){
						if(r.statuscode == 1){
							$scope.serIttem.service_message_info = r.data[0].service_message_info;
						}
					})
					}
				}
			})
		}

		$scope.replayBlur = function(){
			$scope.replay_show = false;
		}

		//服务向左滑
		$scope.serviceOnSwipeLeft = function(){
			$localStorage.set("thisPage",2)
			$state.go("tab.communitydynamic");
		}
		//动态向左滑
		$scope.dynamicOnSwipeLeft = function(){
			$localStorage.set("thisPage",3)
			$state.go("tab.communityactivity");
		}
		//动态向右滑
		$scope.dynamicOnSwipeRight = function(){
			$localStorage.set("thisPage",1)
			$state.go("tab.community");
		}
		//活动向右滑
		$scope.activityOnSwipeRight = function(){
			$localStorage.set("thisPage",2)
			$state.go("tab.communitydynamic");
		}





		//长按回复-投诉
		$scope.onHold = function(name,id){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			$scope.msg = {};
			$CommonFactory.showCustomPopup(function(){
				var data = {
					accesstoken : accesstoken,
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



		//活动列表
		$scope.getActivityList = function(){
			if ($localStorage.get("thisPage") == 3) {
				var data = {
					"accesstoken" : accesstoken,
					"currentPage" : $scope.activityCurrentPage,
					"itemsPerPage" : $scope.itemsPerPage
				};
				CommunityService.getActivityList(data,function(response){
					//console.log(response);
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.activityIsEmptyData = true;
						$scope.activityIsOverLoad = true;
						return;
					}
					if(response.statuscode == CODE_SUCCESS){
						for (var i = 0, len = response.data.length; i < len; i++) {
							response.data[i].activityImgItems = [];
							for(var j = 0; j<response.data[i].party_thumb.length; j++){
								response.data[i].activityImgItems.push({"src": $scope.commonPath.route_path +$scope.commonPath.article_photo_path + response.data[i].party_thumb[j]});
							}
							$scope.activityList.push(response.data[i]);
						}
					}
					//判断总数，防止无线滚动加载
					$scope.activityItemTotal = response.page_info;
					if ($scope.activityCurrentPage * $scope.itemsPerPage > $scope.activityItemTotal) {
						$scope.activityIsEmptyData = true;
					} else {
						$scope.activityCurrentPage++;
						$scope.$broadcast('scroll.infiniteScrollComplete');
					}
				})
			}

		};

		if ($state.params.refresh == 'demand') {
			$scope.demandDoRefresh();
		}
		if ($state.params.refresh == 'dynamic') {
			$scope.dynamicDoRefresh();
		}
		if ($state.params.refresh == 'activity') {
			$scope.activityDoRefresh();
		}

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};

		//参与活动
		$scope.enroll =function(item){
//			if ($rootScope.getCurrentUser().opt_permission == 0) {
//				$CommonFactory.showAlert(noMoneyMessage);
//				return;
//			}
			var data = {
				"accesstoken" : accesstoken,
				"party_id" : item.party_id,
				"target_id" : item.party_id
			};
			CommunityService.partyEnroll(data,function(response){
				if (response.statuscode == 1) {
					CommunityService.getOneActivity(data,function(r){
						console.log(r)
						if(r.statuscode == 1){
							item.is_enroll = r.data[0].is_enroll
						}
					})
				}
			})
		};

		//举报
		/*$scope.report = function() {
			$event.stopPropagation();
			console.log('report');
		}*/
		
		
		//跳转到服务列表
		$scope.toServiceListPageForCommunity = function(type) {
			var data = {
				type_id : type.id,
			};
			$state.go('businessServiceList', data);
		}
		
		//产品详情
		$scope.toBusinessProduct = function(service) {
			var data = {
				com_service_id: service.com_service_id
			};
			$state.go('businessProduct',data);
		}

	}
]);