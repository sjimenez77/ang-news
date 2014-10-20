'use strict';

app.factory('Post', function($firebase, FIREBASE_URL, User) {
    var ref = new Firebase(FIREBASE_URL + 'posts');

    var posts = $firebase(ref).$asArray();

    var Post = {
        all: posts,
        create: function(post) {
            if (User.signedIn()) {
                var user = User.getCurrent();

                post.owner = user.username;

                return posts.$add(post).then(function(ref) {
                    var postId = ref.name();

                    User.posts(user.username).$set(postId, postId);

                    return postId;
                });
            }
        },
        find: function(postId) {
            return $firebase(ref.child(postId)).$asObject();
        },
        delete: function(postId) {
            if (User.signedIn()) {
                var post = Post.find(postId);

                post.$loaded().then(function(postLoaded) {
                    var user = User.findByUsername(post.owner), 
                    	index = posts.$indexFor(postLoaded.$id);

                    posts.$remove(index).then(function() {
                    	User.posts(user.username).$remove(postLoaded.$id);
                    }, function(error) {
                        console.log(error.toString());
                    });
                });
            }
        },
        comments: function(postId) {
            return $firebase(new Firebase(FIREBASE_URL + 'comments/' + postId));
        },
        addComment: function(postId, comment) {
            if (User.signedIn()) {
                var user = User.getCurrent();

                comment.username = user.username;

                Post.comments(postId).$push(comment).then(function(ref) {
                    var commentId = ref.name();

                    User.comments(user.username).$set(commentId, postId);
                });
            }
        },
        deleteComment: function(postId, comment) {
            if (User.signedIn()) {
                var user = User.findByUsername(comment.username);
                var commentId = comment.$id;

                Post.comments(postId).$remove(commentId).then(function() {
                    User.comments(user.username).$remove(commentId);
                });
            }
        }
    };

    return Post;
});