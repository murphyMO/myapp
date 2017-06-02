/**
 * 用户请求服务
 */
app.factory('UserService', ['$resource', '$window', function ($resource, $window) {
	return $resource('', {}, {
		userDatas: {
			method: 'GET',
			url: $window.platformServer + "user-datas",
			params: {
				accesstoken: '@accesstoken',
				justidname: '@justidname'
			}
		},
		//获取个人信息
		getPersonMessage:{
			method: 'GET',
			url: $window.platformServer + "user-datas/get-setting?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},
		getDeptName:{
			method: 'GET',
			url: $window.platformServer + "dept-datas/view-junior?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},
		//设置个人信息
		setPersonMessage:{
			method: 'POST',
			url: $window.platformServer + "user-datas/setting?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken',
				_csrf: '@_csrf',
				short_name: '@short_name',
				qq: '@qq',
				sex: '@sex',
				email: '@email',
				weixin_name: '@weixin_name',
				id_card_number: '@id_card_number',
				locate_city: '@locate_city',
				birthday: '@birthday',
				superior_id: '@superior_id'
			}
		},
		setDeptName:{
			method: 'POST',
			url: $window.platformServer + "dept-datas/view-junior?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken',
				locate_dept: '@locate_dept',
			}
		},

		//用户个人信息
		userMine: {
			method: 'GET',
			url: $window.platformServer + "user-datas/mine",
			params: {accesstoken: '@accesstoken'}
		},

		userMineUpdate: {
			method: 'POST',
			url: $window.platformServer + "user-datas/mine"
		},
		userOnes: {
			method: 'GET',
			url: $window.platformServer + "user-datas/:id",
			params: {id: '@id', accesstoken: '@accesstoken'}
		},
		userCreate: {
			method: 'POST',
			url: $window.platformServer + "user-datas?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken',
				_csrf: '@_csrf',
				full_name: '@full_name',
				mobile: '@mobile',
				sex: '@sex',
				dept_id: '@dept_id',
				post_name: '@post_name',
				superior_id: '@superior_id'
			}
		},
		userUpdate: {
			method: 'PUT',
			url: $window.platformServer + "user-datas/:id?accesstoken=:accesstoken",
			params: {
				id: "@id",
				accesstoken: '@accesstoken',
				_csrf: '@_csrf',
				sex: '@sex',
				dept_id: '@dept_id',
				superior_id: '@superior_id'
			}
		},
		userProfileUpdate: {
			method: 'PUT',
			url: $window.platformServer + "user-datas/setting?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken'
				, _csrf: '@_csrf'
				, post_name: '@post_name'
				, first_name: '@first_name'
				, last_name: '@last_name'
				, sex: '@sex'
				, weixin_name: '@weixin_name'
			}
		},
		userPwdUpdate: {
			method: 'PUT',
			url: $window.platformServer + "user-datas/setting?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken'
				, _csrf: '@_csrf'
				, old_pw: '@old_pw'
				, new_pw: '@new_pw'
			}
		},
		userDelete: {
			method: 'DELETE',
			url: $window.platformServer + "user-datas/delete"
		},
		userRangViewSetting: {
			method: 'POST',
			url: $window.platformServer + "user-datas/range-view-setting",
			params: {
				accesstoken: '@accesstoken'
				, _csrf: '@_csrf'
				, log_view_user_id: '@log_view_user_id'
				, task_view_user_id: '@task_view_user_id'
				, approval_view_user_id: '@approval_view_user_id'
				, share_view_user_id: '@share_view_user_id'
			}
		},
		userRangViewShow: {
			method: 'GET',
			url: $window.platformServer + "user-datas/range-view-show",
			params: {accesstoken: '@accesstoken'}
		},
		userTodoUpdate: {
			method: 'POST',
			url: $window.platformServer + "to-do-datas",
			params: {accesstoken: '@accesstoken'}
		},
		userTodoDatas: {
			method:'GET',
			url: $window.platformServer + "user-datas/todo-list?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},
		//获取用户的兴趣爱好
		getUserInterst:{
			method:'GET',
			url:$window.platformServer + "user-datas/get-user-interest?accesstoken=:accesstoken",
			params:{accesstoken:'@accesstoken'}
		},
		//删除兴趣爱好
		deleteOneInterest:{
			method:'GET',
			url:$window.platformServer + "user-datas/delete-one-interest",
			params:{
				accesstoken:'@accesstoken',
				interest_id:'@interest_id'
			}
		},
		//添加兴趣爱好
		createInterest:{
			method:'POST',
			url:$window.platformServer + "user-datas/create-interest",
			params:{
				accesstoken:'@accesstoken',
				interest_name:'@interest_name'
			}
		},
		//关注公司关注个人
		follow : {
			method:'POST',
			url: $window.platformServer + "fans-datas/concern?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken'
			}
		},
		//获取是否关注
		confirmFollow : {
			method:'GET',
			url: $window.platformServer + "fans-datas/confirm?accesstoken=:accesstoken",
			params: {
				accesstoken: '@accesstoken',
				id : '@id'
			}
		},
		//上传图片
		uploadImg : {
			method : 'POST',
			url : $window.platformServer + 'user-datas/upload-image?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken'
			}
		},
		//获取用户图片
		getUserImg : {
			method : 'GET',
			url : $window.platformServer + 'user-datas/view-image?accesstoken=:accesstoken',
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//获取用户图片审核状态
		getUserImgState : {
			method : 'GET',
			url : $window.platformServer + 'megviis/check?accesstoken=:accesstoken',
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//上传图片前
		uploadBefore : {
			method : 'POST',
			url : $window.platformServer + 'user-datas/upload-image-before?accesstoken=:accesstoken',
			params : {
				accesstoken : '@accesstoken'
			}
		},
		//获取会员权限
		userTypeDatas : {
			method : 'GET',
			url : $window.platformServer + "user-type-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取会员权限详细信息
		userTypeDetailDatas : {
			method : 'GET',
			url : $window.platformServer + "user-member-datas/get-user-member?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken"
			}
		},
		//获取是否是管理员
		userIsManager: {
			method: 'GET',
			url: $window.platformServer + "user-datas/mine?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},
		//上传用户反馈
		uploadInfo : {
			method : 'POST',
			url : $window.platformServer + 'feedback-info-datas?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
				'feel': '@feel',
				'fluency':'@fluency',
				'interface':'@interface',
				'perfect_degree':'@perfect_degree',
				'userful_section':'@userful_section',
				'remove_section':'@remove_section',
				'optimization_suggestions':'@optimization_suggestions',
				'mobile':'@mobile',
				'name':'@name',
				'user_type':'@user_type',
				'com_name' : '@com_name',
				'style' : '@style',
				'offer_help' : '@offer_help'
			}
		},
		//上传反馈表2
		uploadInfo2 : {
			method : 'POST',
			url : $window.platformServer + 'feedback-info-datas/create-feedback?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
				'mobile':'@mobile',
				'name':'@name',
				'com_name' : '@com_name'
			}
		},
		//侠客寓出租
		chuzu : {
			method : 'POST',
			url : $window.platformServer + 'feedback-info-datas/create-lease?accesstoken=:accesstoken',
			params: {
				accesstoken: '@accesstoken',
				'mobile':'@mobile',
				'name':'@name',
				'com_name' : '@com_name',
				'lease_time' : '@lease_time'
			}
		},
		//获取人脸识别上传资格status 
		faceStatus: {
			method: 'GET',
			url: $window.platformServer + "megviis/status?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},
		//后端执行人脸识别上传
		faceUpload: {
			method: 'GET',
			url: $window.platformServer + "megviis/index?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},
		//告诉后端上传图片完成，请发送推送消息
		getNewUserType: {
			method: 'GET',
			url: $window.platformServer + "user-datas/upload-image-end?accesstoken=:accesstoken",
			params: {accesstoken: '@accesstoken'}
		},
		//删除人脸识别照片或者身份证照片
		photoDelete: {
			method: 'DELETE',
			url: $window.platformServer + "user-datas/delete-image"
		}
	})
}]);