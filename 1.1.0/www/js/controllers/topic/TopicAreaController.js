/**
 * 社区-动态控制器
 */
app.controller('TopicAreaCtrl',
	['$scope', 'TopicService','$rootScope','$state','$localStorage','$CommonFactory','$timeout','$ionicScrollDelegate','$cordovaToast','chatFactory','$ionicSlideBoxDelegate',
	function ($scope, TopicService,$rootScope,$state,$localStorage,$CommonFactory,$timeout,$ionicScrollDelegate,$cordovaToast,chatFactory,$ionicSlideBoxDelegate) {
		$scope.replay_show = false;
		$scope.appNav = true; //底部导航为true显示
		$scope.re = {};
		$scope.dynamicList = [];//动态列表
		$scope.dynamicImgItems = [];
		$scope.dynamicCurrentPage = 1; //第1页开始
		$scope.itemsPerPage = 5; //每页10条
		$scope.hasshare = false;//初始分享不显示
//		var accesstoken = $localStorage.get("accesstoken");
		var accesstoken = $rootScope.getAccessToken();
		var hasMore =true;
		$scope.dynamicIsOverLoad = false;
		var timeout = null; //搜索延迟
		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);


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
			hasMore = true;
			$scope.getDynamicList();
			hasMore = false;
			$scope.$broadcast('scroll.refreshComplete');
		}
		
		//话题时间戳
		var tody=new Date();
		var Y=tody.getFullYear();
		var M=tody.getMonth()+1;
		M=(M<10)?'0'+M:M;
		var d=tody.getDate();
		d=(d<10)?'0'+d:d;
		var h=tody.getHours();
		h=(h<10)?'0'+h:h;
		var m=tody.getMinutes();
		m=(m<10)?'0'+m:m;
		var s=tody.getSeconds();
		s=(s<10)?'0'+s:s;
		var now=Y+'-'+M+'-'+d+' '+h+':'+m+':'+s;
		var nowTime=now.split(' ');//["2016-10-11","13:08:33"]
		var A1=nowTime[0].split('-');//["2016", "10", "11"]
		var B1=nowTime[1].split(':');//["13", "08", "33"]


		var unit = ["小时","分钟","秒钟"];		
		$scope.topicTime = function(atime){
	 	//var atime="2016-10-11 00:00:00";//response.data[i].article_cre_time;
		var applyTime=atime.split(' ');//获得的时间，格式同nowTime
		var A=applyTime[0].split('-');//获得的年月日，格式同A1
		var B=applyTime[1].split(':');//获得的时分秒，格式同B1

		var sb=[];
		var byTime = [60*60*1000,60*1000,1000];  
		console.log(atime);
		if(String(A)==String(A1)){
		    var ct =(B1[0]-B[0])*60*60*1000+(B1[1]-B[1])*60*1000+(B1[2]-B[2])*1000;
		    for(var i=0;i<byTime.length;i++){  
				if(ct<byTime[i]){  
					continue;  
				}  
				var temp = Math.floor(ct/byTime[i]);  
				ct = ct%byTime[i];  
				if(temp>0)
				{  
					sb.push(temp+unit[i]);  
				}   
				if(sb.length>=1)
				{
					break;  
				}
			}
			$scope.time=sb.join("")+"前";  
		} else{
			for(var i=0;i<=3;i++){
				if(A[i]<A1[i]){
					if(A[0]==A1[0]){//年相同
						if(A[1]==A1[1]){//年月相同
							if(parseInt(A[2])==A1[2]-1){
							$scope.time='昨天'+' '+B[0]+':'+B[1];
							}
							else{
								$scope.time=A[1]+'-'+A[2];
							}
							
						}else{//年相同 月不同
						$scope.time=A[1]+'-'+A[2];}
					}else{//年不同
					$scope.time=applyTime[0];
					}
				}
			}
		}
		//console.log($scope.time);
 }
 
//$scope.topicTime();
		
		
		

		$scope.getDynamicList = function(){
			if (hasMore) {
				var data = {
					"accesstoken" : accesstoken,
					"currentPage" : $scope.dynamicCurrentPage,
					"itemsPerPage" : $scope.itemsPerPage,
					"keyword" : $scope.dynamicSearch.keyword
				}

				TopicService.getDynamicList(data,function(response){
					//没有数据
					if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
						$scope.dynamicIsEmptyData = true;
						$scope.dynamicIsOverLoad = true;
						return;
					}
					if(response.statuscode == CODE_SUCCESS){
						
						for (var i = 0, len = response.data.length; i < len; i++) {
							/*var cc=response.data[i].article_cre_time.split(' ');
							console.log(cc);*/
							$scope.topicTime(response.data[i].article_cre_time);		
							response.data[i].article_cre_time=$scope.time;
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
						console.log($scope.dynamicList);
					}
					//判断总数，防止无线滚动加载
					$scope.dynamicItemTotal = response.page_info;
					if ($scope.dynamicCurrentPage * $scope.itemsPerPage >= $scope.dynamicItemTotal) {
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
				// chatFactory.sendCustomMsg(ser.article_data_user_id || ser.cre_user_id,"dianzan",temp);
			}
			TopicService.likeYou(data,function(res){
				if(res.statuscode == 1){
					if (type==1) {
						TopicService.getOneDynamic(data,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
					else if (type==2) {
						TopicService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							ser.service_like_info = r.data[0].service_like_info;
							ser.is_like = r.data[0].is_like;
						}
					})
					}
					else if (type==3) {
						TopicService.getOneActivity(data,function(r){
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
				// chatFactory.sendCustomMsg($scope.serIttem.cre_user_id || $scope.serIttem.article_data_user_id,"liuyan",temp);
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
			TopicService.replay(data,function(res){
				$scope.re.message_content = "";//清空输入框
				if(res.statuscode == 1){
					// $CommonFactory.hideLoading();
					if ($scope._type == 1) {
						TopicService.getOneDynamic(data,function(r){
						$scope.serIttem.service_message_info = r.data[0].service_message_info;
					})
					}
					else if ($scope._type == 2) {
						TopicService.getOneDemand(data,function(r){
						if(r.statuscode == 1){
							$scope.serIttem.service_message_info = r.data[0].service_message_info;
						}
					})
					}
					else if ($scope._type == 3) {
						TopicService.getOneActivity(data,function(r){
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
				TopicService.report(data, function(response){
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
			$scope.dynamicDoRefresh();
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

		//滑动
		$scope.slideHasChanged = function(i){
			//$state.go('tab.mine',{thisItem:i});
			$scope.thisItem = i;
		}
		$scope.clickMine = function(){
			$ionicSlideBoxDelegate.slide(0)
			//$state.go('tab.mine',{thisItem:0});
			
		}
		$scope.clickCom = function(){
			$ionicSlideBoxDelegate.slide(1)
			//$state.go('tab.mine',{thisItem:1});
		}
	}
]);
