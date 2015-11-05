describe("FeedController", function() {
  beforeEach(module('app'));

  var $controller;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));


  describe('$scope.toggle', function( ) {
    it('Should be a function', function( ) {
      var $scope = {};
      var controller = $controller('FeedController', { $scope: $scope });
      expect(typeof $scope.toggle).to.equal('function');
    });

    // it('Should toggle a post type', function( ) {
    //   var $scope = {};
    //   var controller = $controller('FeedController', {$scope: $scope});
    //   var PostType = {
    //     'twitter': false
    //   };
    //   $scope.postType = PostType;
    //   expect($scope.postType.twitter).to.equal(false);
    //   $scope.toggle('twitter');
    //   expect(PostType.twitter).to.equal(true);
    // });
  });
});

   // afterEach(function() { });
   // it('should fail', function() { expect(true).to.be.false; });
