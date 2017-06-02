/**
 * 个人信息--城市
 */
app.factory('PersonalCityService', ['$resource', '$window', function($resource, $window) {
    return $resource('', {}, {
        getPersonalCity:{
            method:'GET',
            url:"data/area_detail.json",
            params : {
                accesstoken: "@accesstoken"
            }
        }
    })
}]);