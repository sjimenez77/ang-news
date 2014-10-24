'use strict';

app.factory('Comment', function($firebase, FIREBASE_URL, Post) {

    var ref = new Firebase(FIREBASE_URL);

    var Comment = {
        create: function(postId, comment) {
            return Post.comments(postId).$add(comment).then(function(commentRef) {
                $firebase(ref.child('user_comments').child(comment.creatorUID)).$push(commentRef.name());
                return commentRef;
            });
        },
        get: function(postId, commentId) {
            return Post.comments(postId).child(commentId).$asObject();
        }
    };

    return Comment;
});