'use strict';

angular.module('angNewsApp').directive('postTitle', function(Post) {
	return {
		restrict: 'E',
		template: '<a ng-href="#/posts/{{ postId }}">{{ postTitle }}</a>',
		replace: true,
		link: function(scope, elm, attrs) {
			var postId = attrs.postId;
			var post = Post.get(postId);

			scope.postId = postId;
			scope.postTitle = post.title;
		}
	};
});