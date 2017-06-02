/**
 * 个人信息--区域
 */
app.factory('PersonalAreaService', ['$resource', '$window', function($resource, $window) {
    return $resource('', {}, {
        getPersonalArea:{
            method:'GET',
            url:"data/area_detail.json",
            params : {
                accesstoken: "@accesstoken"
            }
        }

    })
}]);