/**
 * 投给我的控制器
 */
app.controller('PublishForMeController',
    ['$scope', '$window', '$resource','$stateParams','$state','CompanyServiceService', '$localStorage','$rootScope', '$timeout', 'BusinessService',
    function ($scope, $window, $resource,$stateParams,$state,CompanyServiceService,$localStorage, $rootScope, $timeout, BusinessService) {

    	$scope.replay_show = false;
		$scope.appNav = true; //底部导航为true显示
		$scope.re = {};
		$scope.hasMaterial = false;
		
		$scope.article_target_id = $stateParams.article_target_id;
		$scope.article_type_id = $stateParams.article_type_id;
		
		$scope.publishList = [];//发布列表
		$scope.ImgItems = [];
		
		var timeout = null; //搜索延迟
		var accesstoken = $rootScope.getAccessToken();

		$scope.commonPath = $localStorage.getObject(KEY_COMMON_PATH);
		/*console.log($scope.commonPath)*/
	
		//下拉刷新
		$scope.publishRefresh = function(){
			$scope.publishList = [];
			$scope.CurrentPage = 1;
			$scope.getPublishForMe();
			$scope.$broadcast('scroll.refreshComplete');
		}
		
		
			
		//获取数据s
		$scope.getPublishForMe = function(){
			var data = {
				"accesstoken" : accesstoken,
				"article_target_id" : $scope.article_target_id,
				"article_type_id" : 1,
			}

			CompanyServiceService.getCompanyServiceList(data,function(response){
				//没有数据
				if (response.statuscode != CODE_SUCCESS || response.data.length == 0) {
					$scope.dynamicIsEmptyData = true;
					$scope.hasMaterial = true;
					return;
				}
				if(response.statuscode == CODE_SUCCESS){
					//console.log(response.data.data[0]);
					for (var i = 0, len = response.data.data.length; i < len; i++) {
						response.data.data[i].ImgItems = [];
						for(var j = 0; j<response.data.data[i].com_service_thumb.length; j++){
							response.data.data[i].ImgItems.push({"src": $scope.commonPath.route_path +$scope.commonPath.article_photo_path + response.data.data[i].com_service_thumb[j]});
						}
						$scope.publishList.push(response.data.data[i]);
					}
				}
				//判断总数，防止无线滚动加载
				$scope.dynamicItemTotal = response.page_info;
				if ($scope.CurrentPage * $scope.itemsPerPage > $scope.ItemTotal) {
					$scope.dynamicIsEmptyData = true;
					$scope.hasMaterial = false;
				}
				else {
					$scope.dynamicCurrentPage++;
					$scope.$broadcast('scroll.infiniteScrollComplete');
				}
			})
		};
		$scope.getPublishForMe()

		//点赞功能
		$scope.likeYou = function(id,ser,isLike){
			var data = {
					"accesstoken" : accesstoken,
					"type_id": 4,
					"target_id": id
				}
				if(isLike == 1){
					data.status = 0;
				}
				else if(isLike == 0){
					data.status = 1;
				}
			CompanyServiceService.likeYou(data,function(response){
				if (response.statuscode == CODE_SUCCESS) {
					var data2 = {
						"accesstoken" : accesstoken,
						id: id
					};
					BusinessService.serviceDatasOne(data2,function(r){
						if(r.statuscode == CODE_SUCCESS){
							ser.service_like_info = r.data.service_like_info;
							ser.is_like = r.data.is_like;
						}
					})
				}
			})
		}



		//回复
		$scope.replayShow = function(type,ser,index,_type){
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
				$scope.parentId = "";
			}
			else if($scope.type == 2){
				$scope.parentId=$scope.serIttem.service_message_info[$scope.index].message_id;
			}
			var data = {
				"accesstoken" : accesstoken,
				"target_id" : $scope.serIttem.com_service_id,
				"type_id" : $scope._type,
				"message_content" : $scope.re.message_content,
				"parent_message_id" : $scope.parentId
			}


			if(data.message_content == ''|| data.message_content == undefined){
				$CommonFactory.showAlert("回复内容不能为空");
				return;
			}
			// else{
			// 	$CommonFactory.showLoading();
			// }
			CompanyServiceService.replay(data,function(res){
				$scope.re.message_content = "";//清空输入框
				if(res.statuscode == 1){
					var data2 = {
							"accesstoken" : accesstoken,
							"id": $scope.serIttem.com_service_id
						};
					// $CommonFactory.hideLoading();
					BusinessService.serviceDatasOne(data2,function(r){
						if(r.statuscode == CODE_SUCCESS){
							console.log(r)
							$scope.serIttem.service_message_info = r.data.service_message_info;
						}
					})

				}
			})
		}




    }]);













