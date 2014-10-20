'use strict';

app.controller('ProfileCtrl', function($scope, $routeParams, Post, User) {

    $scope.user = User.findByUsername($routeParams.username);

    $scope.posts = {};
    $scope.commentedPosts = {};
    $scope.comments = {};

    $scope.user.$loaded(function() {
        populatePosts();
        populateComments();
    });

    function populatePosts() {
        var posts = User.posts($routeParams.username).$asArray();

        posts.$loaded(function() {
            angular.forEach(posts, function(post) {
                $scope.posts[post.$id] = Post.find(post.$id);
            });
        });
    }

    function populateComments() {
        var comments = User.comments($routeParams.username).$asArray();

        comments.$loaded(function() {
            angular.forEach(comments, function(comment) {
                var post = Post.find(comment.$value);

                post.$loaded(function() {
                    var postComments = Post.comments(comment.$value).$asObject();

                    postComments.$loaded(function() {
                        $scope.commentedPosts[comment.$id] = post;
                        $scope.comments[comment.$id] = postComments[comment.$id];
                    });
                });
            });
        });
    }

});