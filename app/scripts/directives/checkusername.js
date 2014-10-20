'use strict';

angular.module('angNewsApp').directive('checkUsername', function(User) {
    var usernameRegexp = /^[^.$\[\]#\/\s]+$/;

    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.push(function(viewValue) {
                if (usernameRegexp.test(viewValue)) {
                    User.findByUsername(viewValue).$loaded(function(user) {
                        if (user.$value === null) {
                            ctrl.$setValidity('taken', true);
                            ctrl.$setValidity('invalid', true);
                        } else {
                            ctrl.$setValidity('taken', false);
                            ctrl.$setValidity('invalid', true);
                        }
                    });

                    return viewValue;
                } else {
                    ctrl.$setValidity('taken', true);
                    ctrl.$setValidity('invalid', false);

                    return viewValue;
                }
            });
        }
    };
});