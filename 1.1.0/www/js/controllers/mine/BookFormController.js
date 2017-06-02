/**
 * 登记表格控制器
 */
app.controller('bookFormCtrl',
	['$scope','$rootScope','$CommonFactory', '$state','BookFormService', '$cordovaToast', '$localStorage',
		function ($scope, $rootScope, $CommonFactory, $state, BookFormService, $cordovaToast, $localStorage) {
			$scope.accesstoken = $rootScope.getAccessToken();

			$scope.bookForm = {};
			$scope.bookForm.bookMatter = "";
			$scope.mattersInfo = $localStorage.getObject("MattersInfo");
			for (var i in $scope.mattersInfo) {
				$scope.bookForm[i] = $scope.mattersInfo[i];
			}

//			console.log($scope.bookForm);
//			if ($scope.bookForm == "{}" || !$scope.bookForm) {
//				$scope.bookForm = {};
//				$scope.bookForm.bookMatter = "";
//			}

			/*if(!$scope.bookForm){
				$scope.bookForm={};
			}
			if($localStorage.getObject("MattersInfo")){
				$scope.bookForm.bookMatter = $localStorage.getObject("MattersInfo");
			}*/

			//保存登记信息
			$scope.saveBookFormClick = function() {
				if ($scope.bookForm.bookName) {
					var len = 0;
					for (var i = 0; i < $scope.bookForm.bookName.length; i++) {
						var c = $scope.bookForm.bookName.charCodeAt(i);
						//单字节加1 
						if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
							len++;
						}
						else {
							len += 2;
						}
					}
					if (len>10) {
						$CommonFactory.showAlert("最多只能输入10个字符")
						return;
					}
				}
				

				var phoneReg = /^1[34578]\d{9}$/;
				var emailReg = /^([a-zA-Z0-9_-])+.+@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
				if (!$scope.bookForm.bookName) {
					$CommonFactory.showAlert("请填写姓名！");
					return;
				}
				else if(!$scope.bookForm.bookPhone){
					$CommonFactory.showAlert("请输入手机号！");
					return;
				}
				else if (!phoneReg.test($scope.bookForm.bookPhone)) {
					$CommonFactory.showAlert('手机号格式不正确');
					return;
				}
				else if (!emailReg.test($scope.bookForm.bookEmail)) {
					$CommonFactory.showAlert("邮箱格式不正确!");
					return;
				}
				else if (!$scope.bookForm.bookCompanyName) {
					$CommonFactory.showAlert("请输入企业名称!");
					return;
				}
				else if (!$scope.bookForm.bookJob) {
					$CommonFactory.showAlert("请输入你的职位!");
					return;
				}
				else if (!$scope.bookForm.bookMatter) {
					$CommonFactory.showAlert("请选择你的合作事项!");
					return;
				}
				else if (!$scope.bookForm.extra) {
					$CommonFactory.showAlert("请输入备注信息!");
					return;
				}
				else{
					var data = {
						accesstoken : $scope.accesstoken,
						user_name : $scope.bookForm.bookName,
						telephone : $scope.bookForm.bookPhone,
						comment : $scope.bookForm.extra,
						com_name : $scope.bookForm.bookCompanyName,
						email : $scope.bookForm.bookEmail,
						cooperation_matters : $scope.bookForm.bookMatter,
						position : $scope.bookForm.bookJob
					}
					BookFormService.bookForm(data,function(res){
						if (res.statuscode == 1) {
							$scope.bookForm={};
							$localStorage.MattersInfo = "";
							console.log("asdjhashdj");
							$CommonFactory.showAlert("登记成功，工作人员稍后与您联系", "提示", "确定")
							$localStorage.removeItem("MattersInfo");
							$state.go("tab.business");
							/*.then(function(success) {
							//success
							$state.go("tab.business");
							}, function (error) {
							//error
						});*/
						}
					})
				}
			}
			//选择合作事项
			$scope.selectMatters = function() {
				//将选择的对象存储到本地中
				$localStorage.setObject("MattersInfo", $scope.bookForm);
				$state.go("cooperationmatters");
			}

			$scope.back = function(){
				$localStorage.removeItem("MattersInfo");
				$state.go("detailintroduction");
			}

		}]);