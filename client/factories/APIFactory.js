app.factory('APIfactory',['$http', function ($http) {

  var getIG = function () {
    return $http({
      
    });
  };

  return {
    getIG: getIG
  };
}]);