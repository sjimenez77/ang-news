'use strict';

app.controller('ProfileCtrl', function($scope, $routeParams, Profile, Comment, Auth) {

    var uid = $routeParams.userId;

    $scope.user = Auth.user;
    $scope.signedIn = Auth.signedIn;
    $scope.profile = Profile.get(uid);

    Profile.getPosts(uid).then(function(posts) {
        $scope.posts = posts;
    });

    Profile.getComments(uid).then(function(comments) {
        $scope.comments = comments;
    });

    $scope.deleteComment = function (comment) {
        Comment.deleteComment(comment);
    };
});