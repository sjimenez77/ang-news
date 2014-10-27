'use strict';

app.factory('Comment', function($firebase, $window, FIREBASE_URL, Post, Auth, $q) {

    var ref = new $window.Firebase(FIREBASE_URL);
    var user = Auth.user;

    var Comment = {
        create: function(postId, comment) {
            return Post.comments(postId).$add(comment).then(function(commentRef) {
                $firebase(ref.child('user_comments').child(comment.creatorUID)).$push(commentRef.name());
                return commentRef;
            });
        },
        get: function(commentId) {
            var defer = $q.defer();
            var posts = Post.all;
            var result = {};
         
            if (posts.length > 0) {
                angular.forEach(posts, function(post) {
                    var comments = Post.comments(post.$id);
                    comments.$loaded().then(function (data) {
                        angular.forEach(data, function (comment) {
                            console.log(comment);
                            if (comment.$id === commentId) {
                                // Return the post and its comment 
                                result = {post: post, comment: comment};
                                defer.resolve(result);
                            }
                        });
                    });
                });
            }

            return defer.promise;
        },
        deleteComment: function(commentParam) {
            var defer = $q.defer();
            var posts = Post.all;
            var commentId = commentParam.$id;
            var result = null;

            if (posts.length > 0) {
                angular.forEach(posts, function(post) {
                    var comments = Post.comments(post.$id);
                    comments.$loaded().then(function (commentsLoaded) {
                        angular.forEach(commentsLoaded, function (comment) {
                            if (comment.$id === commentId) {
                                // Remove the comment
                                commentsLoaded.$remove(comment).then(function (refComment) {
                                    var userComments = $firebase(ref.child('user_comments').child(user.uid)).$asArray();
                                    result = refComment.name();
                                    userComments.$loaded().then(function(userCommentsLoaded) {
                                            
                                            for (var i = 0; i < userCommentsLoaded.length; i++) {
                                                var value = userCommentsLoaded[i].$value;
                                                if (value === result) {
                                                    userCommentsLoaded.$remove(i);
                                                    break;
                                                }
                                            }
                                            
                                        });

                                    defer.resolve(result);
                                        
                                }, function(error) {
                                    console.log(error.toString());
                                });
                            }
                        });
                    });
                });
            }

            return defer.promise;
        }
    };

    return Comment;
});