/**
 * 社区-动态控制器
 */
app.controller('CommunityDynamicCtrl',
	['$scope', 'CommunityService','$rootScope','$state','$localStorage','$CommonFactory','$timeout','$ionicScrollDelegate','$cordovaToast','chatFactory','$ionicSlideBoxDelegate','$sce',
	function ($scope, CommunityService,$rootScope,$state,$localStorage,$CommonFactory,$timeout,$ionicScrollDelegate,$cordovaToast,chatFactory,$ionicSlideBoxDelegate,$sce) {

		$scope.nowPage = 0;


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

		

		


	

		$scope.scrollTop = function() {
			$ionicScrollDelegate.scrollTop(1000);
		};


		$scope.boxChanged = function(i){
			$scope.nowPage = i;
			$localStorage.set("communityPage",i);
		}
		$scope.clickAll = function(){
			$ionicSlideBoxDelegate.slide(0)
		}

		$scope.clickTopic = function(){
			$ionicSlideBoxDelegate.slide(1)
		}

	}
]);
