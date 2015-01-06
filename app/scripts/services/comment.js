'use strict';

app.factory('Comment', function($firebase, $window, FIREBASE_URL, Post, Auth, $q) {

    var ref = new Firebase(FIREBASE_URL);
    var comments = $firebase(ref.child('comments')).$asArray();
    var user = Auth.user;

    var Comment = {
        all: comments,
        create: function(postId, comment) {
            return comments.$add(comment).then(function(commentRef) {
                $firebase(ref.child('user_comments').child(comment.creatorUID)).$push(commentRef.name());
                return commentRef;
            });
        },
        get: function(commentId) {
            return $firebase(ref.child('comments').child(commentId)).$asObject();
        },
        delete: function(comment) {
            var defer = $q.defer();
            var result = null;

            // Necessary to get the correct record
            var commentToRemove = comments.$getRecord(comment.$id);

            comments.$remove(commentToRemove).then(function (refComment) {
                $firebase(ref.child('user_comments').child(user.uid))
                    .$asArray()
                    .$loaded()
                    .then(function(userComments) {
                        // Remove the comment in the user_comments collection
                        for (var i = 0; i < userComments.length; i++) {
                            var value = userComments[i].$value;
                            if (value === refComment.name()) {
                                userComments.$remove(i).then(function (refUserComment) {
                                    result = refUserComment.name();
                                });
                                break;
                            }
                        }
                        defer.resolve(result);
                    });
            }, function(error) {
                console.log(error.toString());
            });

            return defer.promise;
        }
    };

    return Comment;
});