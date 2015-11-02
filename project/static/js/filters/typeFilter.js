app.filter('typeFilter', ['PostType', function (PostType) {
  return function ( input ) {
    var output = [];
    angular.forEach(input, function ( post ) {
      if ( PostType[post.type] === false) {
        if (post.type === 'instagram') {
          window.instgrm.Embeds.process();
        }
        output.push(post);
      }
    });
    return output;
  };
}]);