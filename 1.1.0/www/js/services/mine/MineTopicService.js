/**
 * 我的话题
 * 2016/10/12
 */
app.factory('MineTopicService', ['$resource', '$window', function($resource, $window) {
	return $resource('', {}, {
		//获取我的话题
		getMineTopicList:{
			method:'GET',
			url : $window.platformServer + "topic-datas?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				type: "@type",
				currentPage: "@currentPage",
				itemsPerPage: "@itemsPerPage",
				recommend: "@recommend"
			}
		},
		//获取话题详细信息
		getTopicDetail:{
			method:'GET',
			url : $window.platformServer + "topic-datas/:topic_id?accesstoken=:accesstoken",
			params : {
				accesstoken: "@accesstoken",
				topic_id: "@topic_id",
				type: "@type"
			}
		}
	})
}]);
