'use strict';

app.controller('PostsCtrl', function($scope, $location, Post, Auth) {

    if ($location.path() === '/') {
        $scope.posts = Post.all;
    }

    $scope.user = Auth.user;
    $scope.signedIn = Auth.signedIn;
    
    $scope.post = {
        url: 'http://',
        'title': ''
    };

    $scope.deletePost = function(post) {
        Post.delete(post);
    };
});