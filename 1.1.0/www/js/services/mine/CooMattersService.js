/**
 * 合作事项
 */
app.factory('CooMattersService', ['$resource', '$window', function($resource, $window) {
    return $resource('', {}, {
        getCooMatters:{
            method:'GET',
            url:"data/coo_matters.json",
            params : {
                accesstoken: "@accesstoken"
            }
        }
    })
}]);