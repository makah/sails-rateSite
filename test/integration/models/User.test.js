'use strict';

var _ = require("lodash");

var sinon = require('sinon');

describe('UserModel', function() {
    
    var defaultUser = {
        name: 'Mr.Jones',
        email: 'a@b.co',
        password: '111222333',
        "g-recaptcha-response": 'valid',
    };
    
    describe('#find()', function() {
        it('should check find function', function(done) {
            User.find().then(function(results) {
                // some tests
                done();
            })
            .catch(done);
        });
    });
    
});