'use strict';

app.controller('ProfileCtrl', function($scope, $routeParams, $rootScope, Profile, Comment, Post, Auth) {

    var uid = $routeParams.userId;

    var getPostTitle = function(postId) {
        var post = Post.get(postId);
        return post.title;
    };

    $scope.user = Auth.user;
    $scope.signedIn = Auth.signedIn;
    $scope.profile = Profile.get(uid);

    Profile.getPosts(uid).then(function(posts) {
        $scope.posts = posts;
    });

    Profile.getComments(uid).then(function(comments) {
        $scope.comments = comments;
    });

    $scope.deleteComment = function (comment, index) {
        Comment.delete(comment).then( function () {
            $scope.comments.splice(index, 1);
        });
    };

    $scope.toggleEditMode = function (comment) {
        angular.forEach($scope.comments, function (item) {
            if (item.$id === comment.$id) {
                comment.edit = !item.edit;
            }
        });
    };

    $scope.editComment = function (comment, index) {
        angular.forEach($scope.comments, function (item) {
            if (item.$id === comment.$id) {
                comment.edit = !item.edit;
            }
        });
    };
});