'use strict';

app.controller('PostViewCtrl', function($scope, $routeParams, Post, Comment, Auth) {

    $scope.post = Post.get($routeParams.postId);
    Post.comments($routeParams.postId).then( function (comments) {
        $scope.comments = comments;
    });

    $scope.user = Auth.user;
    $scope.signedIn = Auth.signedIn;

    $scope.addComment = function() {
        if (!$scope.commentText || $scope.commentText === '') {
            return;
        }

        var comment = {
            text: $scope.commentText,
            creator: $scope.user.profile.username,
            creatorUID: $scope.user.uid,
            postId: $scope.post.$id 
        };

        Comment.create($routeParams.postId, comment);
        $scope.comments.push(comment);
        $scope.commentText = '';
    };

    $scope.deleteComment = function(comment, index) {
        Comment.delete(comment).then( function () {
            $scope.comments.splice(index, 1);
        });
    };

});