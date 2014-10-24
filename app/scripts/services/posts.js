'use strict';

app.factory('Post', function($firebase, FIREBASE_URL) {

    var ref = new Firebase(FIREBASE_URL);
    var posts = $firebase(ref.child('posts')).$asArray();

    var Post = {
        all: posts,
        create: function(post) {
            return posts.$add(post).then(function(postRef) {
                $firebase(ref.child('user_posts').child(post.creatorUID)).$push(postRef.name());
                return postRef;
            });
        },
        get: function(postId) {
            return $firebase(ref.child('posts').child(postId)).$asObject();
        },
        delete: function(post) {

            var uid = post.creatorUID;

            Post.deleteCommentsFromPost(post.$id);
            posts.$remove(post).then(function(postRef) {

                $firebase(ref.child('user_posts').child(uid))
                    .$asArray()
                    .$loaded()
                    .then(function(data) {
                        
                        for (var i = 0; i < data.length; i++) {
                            var value = data[i].$value;
                            if (value === postRef.name()) {
                                $firebase(ref.child('user_posts').child(uid)).$remove(i);
                                break;
                            }
                        }
                        
                    });

            }, function(error) {
                console.log(error.toString());
            });

        },
        deleteCommentsFromPost: function(postId) {
            var index = -1;
            var comments = $firebase(ref.child('comments'))
                .$asArray()
                .$loaded()
                .then(function (data) {
                    var index = data.$indexFor(postId);
                    data.$remove(index).then(function (ref) {
                        console.log('Comments removed form post:', ref.name());
                    });
                }, function(error) {
                    console.log(error.toString());
                });
        },
        comments: function(postId) {
            return $firebase(ref.child('comments').child(postId)).$asArray();
        }
    };

    return Post;
});