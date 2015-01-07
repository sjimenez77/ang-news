'use strict';

app.factory('Auth', function($firebase, $firebaseAuth, FIREBASE_URL, $rootScope) {
    var ref = new Firebase(FIREBASE_URL);
    var auth = $firebaseAuth(ref);

    var Auth = {
        register: function(user) {
            return auth.$createUser(user.email, user.password);
        },
        login: function(user) {
            return auth.$authWithPassword(user);
        },
        logout: function() {
            auth.$unauth();
        },
        resolveUser: function() {
            return auth.$waitForAuth();
        },
        signedIn: function() {
            return !!Auth.user.provider;
        },
        createProfile: function(user) {
            var profile = {
                username: user.username,
                md5_hash: user.md5_hash
            };

            var profileRef = $firebase(ref.child('profile'));
            return profileRef.$set(user.uid, profile);
        },
        user: {}
    };

    auth.$onAuth(function(user) {
        if (user) {
            angular.copy(user, Auth.user);
            Auth.user.profile = $firebase(ref.child('profile').child(Auth.user.uid)).$asObject();

            console.log(Auth.user);
        } else {
            console.log('logged out');

            if (Auth.user && Auth.user.profile) {
                Auth.user.profile.$destroy();
            }
            angular.copy({}, Auth.user);
        }
    });

    return Auth;
});