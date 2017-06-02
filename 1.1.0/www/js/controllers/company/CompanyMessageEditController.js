/**
 * 企业行业标签控制器
 */
app.controller('CompanyTagCtrl', 
	['$scope', '$rootScope','$state','$stateParams','$CommonFactory','CompanyService','CommonService','$localStorage','$ionicHistory',
	function($scope, $rootScope,$state,$stateParams,$CommonFactory,CompanyService,CommonService,$localStorage,$ionicHistory){
		var accesstoken = $rootScope.getAccessToken();
		var type = $stateParams.type;
		var from = $stateParams.from;
		$scope.comObj = $localStorage.getObject('comObj_localstorage');
		$scope.editData = [];
		$scope.editData.content = $stateParams.value;
		$scope.editData.placeholder = "";
		
		//行业标签数据获取
		$scope.getBusinessLabel = function(){
			var data = {
				"accesstoken" : accesstoken
			};
			CompanyService.businessLabel(data,function(response){
				$CommonFactory.hideLoading();
				if (response.statuscode == CODE_SUCCESS) {
					$scope.tagInfo = response.data;
					for(var i=0;i<$scope.tagInfo.length;i++){
						for(var j=0;j<$scope.editData.content.length;j++){
							if ($scope.tagInfo[i].business_label_id == $scope.editData.content[j].business_label_id) {
								$scope.tagInfo[i].isSelect = true;								
								break;
							}else{
								$scope.tagInfo[i].isSelect = false;
							}
						}
					}
					consolelog($scope.editData.content);
				}
			});			
		};
		
		//地区获取
		$scope.getArea = function(){
			var data = {
				"accesstoken" : accesstoken
			};			
			CommonService.areaList(data,function(response){
				$scope.cityList = response.data.cityList;
			})			
		}		
		
		//初始化头部
		switch(type){
			case 'com_name':
				$scope.editData.title = '编辑企业名称';$scope.message = 1;break;
			case 'com_phone':
				$scope.editData.title = '编辑企业联系方式';$scope.message = 1;break;
			case 'com_address':
				$scope.editData.title = '编辑企业地址';$scope.message = 1;break;
			case 'com_website':
				$scope.editData.title = '编辑企业官网';$scope.message = 1;$scope.editData.placeholder='http://';break;
			case 'com_legal_representative_name':
				$scope.editData.title = '编辑企业法人代表';$scope.message = 1;break;
			case 'com_credit_code':
				$scope.editData.title = '编辑统一社会信用代码';$scope.message = 1;break;
			case 'com_registered_assets':
				$scope.editData.title = '编辑企业注册资本';$scope.message = 0;break;
			case 'com_type':
				$scope.editData.title = '编辑企业类型';$scope.message = 1;$scope.editData.placeholder='选填合资、独资、私营等';break;				
			case 'com_scale':
				$scope.editData.title = '编辑企业规模';$scope.message = 0;break;
			case 'com_title_type':
				$scope.editData.title = '编辑企业类型';$scope.message = 2;break;
			case 'store_id':
				$scope.editData.title = '编辑归属门店';$scope.message = 3;break;
			case 'business_label':
				$scope.editData.title = '选择行业标签';$scope.message = 4;$scope.getBusinessLabel();break;
			case 'city_name':
				$scope.editData.title = '选择城市';$scope.message = 5;$scope.getArea();break;	
		};	

		//选择标签方法
		$scope.selectTag = function(item){
			$scope.label = 0;
			$scope.editData.content = [];
			for(i=0; i < $scope.tagInfo.length; i++){
				if ($scope.tagInfo[i].isSelect == true) {
					$scope.editData.content.push($scope.tagInfo[i]);
					$scope.label++;
				}
			}	
			console.log($scope.editData.content);
			if($scope.label > 6){
				item.isSelect = false;
				$CommonFactory.showAlert("选择行业标签不能超过6个!");
				return;
			}
		};

		//选择地区方法
		$scope.selectCity = function(obj){
			$scope.editData.content = [];			
			$scope.editData.content.city_name = obj.city_name;
			$scope.editData.content.city_official_code = obj.city_official_code;
			$scope.editData.content.provience_official_code = obj.provience_official_code;
			$rootScope.city = obj.city_name;
		};
		
		//确认
		$scope.confirmClick = function(){
			if(type == 'com_phone'){
				if(($scope.editData.content.length > 0) && ($scope.editData.content.length != 11)){
					$CommonFactory.showAlert("企业联系方式格式不对!");
					return;
				}
			}
			if(type == 'com_website'){
				if(!(/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/.test($scope.editData.content))){
					$CommonFactory.showAlert("企业官网格式有误！");
					return;
				}
			}
			if(type == 'com_credit_code'){
				var code = /^([0-9ABCDEFGHJKLMNPQRTUWXY]{2})(\d{6})([0-9ABCDEFGHJKLMNPQRTUWXY]{9})[0-9ABCDEFGHJKLMNPQRTUWXY]$/;
				if (!code.test($scope.editData.content)) {
					$CommonFactory.showAlert("统一社会信用代码有误！");
					return;
				}
			}		
			$scope.updateData();
		}
		//保存数据之更新数据

		$scope.updateData = function() {
			if(type == 'city_name'){
				$scope.comObj['city_name'] = $scope.editData.content.city_name,
				$scope.comObj['city_official_code'] = $scope.editData.content.city_official_code,
				$scope.comObj['content.provience_official_code'] = $scope.editData.content.provience_official_code
			}else{
				$scope.comObj[type] = $scope.editData.content;
			}
			var business_label_id = [];
			angular.forEach($scope.comObj.business_label, function(item) {
				business_label_id.push(item.business_label_id);
			});
			var data = {
				'accesstoken' : accesstoken,
				'com_name' : $scope.comObj.com_name,
				'com_type' : $scope.comObj.com_type,
				'com_title_type' : $scope.comObj.com_title_type,
				'com_phone':$scope.comObj.com_phone,
				'com_address' : $scope.comObj.com_address,
				'com_website' : $scope.comObj.com_website,
				'com_locate_city' : $scope.comObj.com_locate_city,
				'country_official_code':$scope.comObj.country_official_code,
				'province_official_code':$scope.comObj.province_official_code,
				'city_official_code':$scope.comObj.city_official_code,
				'com_scale' : $scope.comObj.com_scale,
				'store_id':$scope.comObj.store_id,
				'business_label': business_label_id,
				'com_legal_representative_name':$scope.comObj.com_legal_representative_name,
				'com_credit_code':$scope.comObj.com_credit_code,
				'com_org_code':($scope.comObj.com_credit_code).substring(8,17),
				'com_registered_assets':$scope.comObj.com_registered_assets
			}
			
			CompanyService.companyUpdateMine(data, function(response){
				$CommonFactory.hideLoading();
				if (response.statuscode == CODE_SUCCESS) {
					$scope.backClick();
				}else{
					$CommonFactory.showAlert("操作失败，请重试!");
					return;
				}
			});		
		}
		//清空输入框数据
		$scope.deleteData = function(){
			$scope.editData.content = "";
		}
		//返回
		$scope.backClick = function(){
			$ionicHistory.goBack();
			// $localStorage.removeItem('comObj_localstorage');
			// if(from == 1){
			// 	$state.go('combasemsg');
			// }else{
			// 	$state.go('comaptitudemsg');
			// }				
		}
}]);