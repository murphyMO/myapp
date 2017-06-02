/*
 * 企业发布管理的控制器
 */
app.controller('CompanyPostDetailController',
	['$scope', '$window', '$resource','$stateParams','$state', 'CompanyServiceService', 'BusinessService', '$rootScope', '$timeout','$localStorage','$CommonFactory',
		function ($scope, $window, $resource, $stateParams, $state, CompanyServiceService, BusinessService, $rootScope, $timeout, $localStorage, $CommonFactory) {
			$scope.accesstoken = $rootScope.getAccessToken();
			var current_user = $rootScope.getCurrentUser();
			$scope.com_service_id = $stateParams.com_service_id;
			var timeout = null; //搜索延迟
			$scope.item = {};

			$scope.path = $localStorage.getObject(KEY_COMMON_PATH);
			//$scope.userPath = $localStorage.getObject(KEY_COMMON_PATH).photo_path ;
			//$scope.messagePath = $localStorage.getObject(KEY_COMMON_PATH).com_service_thumb ;

			$scope.getCompanyServiceList = function(){
				var data = {
					"accesstoken" : $scope.accesstoken,
					"id": $scope.com_service_id

				}
				BusinessService.serviceDatasOne(data,function(res){
					//console.log( $scope.com_service_id);
					if (res.statuscode == CODE_SUCCESS){
						$scope.item = res.data;
						//console.log( $scope.item);
					}

				})
			};
			$scope.getCompanyServiceList();



			//点赞功能
			$scope.likeYou = function(ser,isLike){
				//console.log(ser);
				var data = {
					"accesstoken" : $scope.accesstoken,
					"type_id":4,
					"target_id":ser.com_service_id
				}
				if(isLike == 1){
					data.status = 0
				}
				else if(isLike == 0){
					data.status = 1
				}
				CompanyServiceService.likeYou(data,function(res){
					if(res.statuscode == 1){
						var da = {
							"accesstoken" : $scope.accesstoken,
							"id": $scope.com_service_id
						}

				BusinessService.serviceDatasOne(da,function(r){
					console.log(r);
					//$scope.getCompanyServiceList();

					if (r.statuscode == CODE_SUCCESS){
						ser.service_like_info = r.data.service_like_info
						ser.is_like = r.data.is_like

					}

				})

						/*CompanyServiceService.getOneService(da,function(r){
							console.log(r);
							if(r.statuscode == 1){
								ser.service_like_info = r.data[0].service_like_info
								ser.is_like = r.data[0].is_like
							}
						})*/
					}
				})
				//$scope.getCompanyServiceList();
			}

			//		回复
			$scope.replayShow = function(type,ser,index){
				$scope.index = index;
				$scope.type=type;
				$scope.appNav = !$scope.appNav;
				$scope.replay_show = !$scope.replay_show;
				$scope.serIttem = ser;

			}
			$scope.re={};
			$scope.sendReplay = function(){
					console.log("shadhj");
				$scope.replay_show = !$scope.replay_show;
				$scope.appNav = true;

				if($scope.type == 1){
					$scope.parentId = ""
				}
				else if($scope.type == 2){
					$scope.parentId=$scope.serIttem.service_message_info[$scope.index].message_id
				}
				
				var data = {
					"accesstoken" : $scope.accesstoken,
					"target_id" : $scope.serIttem.com_service_id,
					"type_id" : 4,
					"message_content" : $scope.re.message_content,
					"parent_message_id" : $scope.parentId
				}
				if(data.message_content == ''|| data.message_content == undefined){
				$CommonFactory.showAlert("回复内容不能为空");
				return;
				}
				CompanyServiceService.replay(data,function(res){
					if(res.statuscode == 1){
						var da = {
							"target_id":$scope.serIttem.com_service_id,
							"accesstoken" : $scope.accesstoken
						}
						$scope.getCompanyServiceList();
						/*CompanyServiceService.getOneService(da,function(r){
							console.log(r);
							$scope.serIttem.service_message_info = r.data[0].service_message_info
						})*/
					}
				})
			}
			
			document.addEventListener("backbutton", onBackKeyDown, false );
			function onBackKeyDown() {
				//匹配当前页面
				if ( $state.current.name == 'app.chat') {
					//返回事件
					$("#showPic").modal("hide");
					$scope.back();
				} else {
					window.history.back();
				}
			}

			$scope.showPic = function(i){
				$("#showPic").modal("show");
				$scope.isrc=$scope.messagePath+ i;
			}

			/*//页面返回按钮
			$scope.back = function(){
				$state.go('app.companymailling');
			}*/

			/*//引文详情
			$scope.materialDetail = function(item) {
				$state.go("app.materialDetail", {material_id: item.com_article_material_id});
			}*/



		}]);