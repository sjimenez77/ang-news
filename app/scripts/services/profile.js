'use strict';

app.factory('Profile', function($window, FIREBASE_URL, $firebase, Post, Comment, $q) {
    
    var ref = new $window.Firebase(FIREBASE_URL);

    var profile = {
        get: function(userId) {
            return $firebase(ref.child('profile').child(userId)).$asObject();
        },
        getPosts: function(userId) {
            var defer = $q.defer();

            $firebase(ref.child('user_posts').child(userId))
                .$asArray()
                .$loaded()
                .then(function(data) {
                    var posts = {};

                    for (var i = 0; i < data.length; i++) {
                        var value = data[i].$value;
                        posts[value] = Post.get(value);
                    }
                    defer.resolve(posts);
                });

            return defer.promise;
        },
        getComments: function(userId) {
            var defer = $q.defer();

            $firebase(ref.child('user_comments').child(userId))
                .$asArray()
                .$loaded()
                .then(function(data) {
                    var comments = {};

                    for (var i = 0; i < data.length; i++) {
                        var value = data[i].$value;
                        comments[value] = Comment.get(value);
                    }
                    defer.resolve(comments);
                });

            return defer.promise;    
        }
    };

    return profile;
});