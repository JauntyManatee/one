app.factory('InstagramFactory', ['$http', function ( $http ) {

  var getInstaFeed = function ( ) {
    return $http({
      method: 'GET',
      url: '/instagram/feed'
    });
  };

  return {
    getInstaFeed: getInstaFeed
  };
}])
  .filter('instaLinky',['$filter', function($filter) {
    return function(text, target) {
      if (!text) return text;

      var replacedText = $filter('linky')(text, target);
      var targetAttr = "";
      if (angular.isDefined(target)) {
          targetAttr = ' target="' + target + '"';
      }
      // replace #hashtags and send them to twitter
      var replacePattern1 = /(^|\s)#(\w*[a-zA-Z_]+\w*)/gim;
      replacedText = text.replace(replacePattern1, '$1<a href="https://instagram.com/explore/tags/$2"' + targetAttr + '>#$2</a>');
      // replace @mentions but keep them to our site
      var replacePattern2 = /(^|\s)\@(\w*[a-zA-Z_]+\w*)/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="https://instagram.com/$2"' + targetAttr + '>@$2</a>');
      return replacedText;
    };
  }
]);
  