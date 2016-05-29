/* global sails User */
'use strict';

var _ = require("lodash");
var sinon = require('sinon');

function clearDB(done){
    sails.once('hook:orm:reloaded', done);
    sails.emit('hook:orm:reload');
}

describe('UserModel', function() {

    describe('#find()', function() {
        it('should check find function', function(done) {
            User.find().then(function(results) {
                // some tests
                done();
            })
            .catch(done);
        });
    });
    
    describe('#invalid create()', function() {
        
        var defaultUser = {
            name: 'Mr.Jones',
            email: 'a@b.co',
            password: '111222333',
            "g-recaptcha-response": 'valid',
        };
        
        before(function() {
            // Mocking reCAPTCHA
            return sinon.stub(sails.services.authservice, 'verifyRecaptcha', function(response, clientIP) {
                return Promise.resolve();
            });
        });
        
        beforeEach(function(done){
            clearDB(done);
        });
        
        after(function() {
          // Restores our mock to the original service
          sails.services.authservice.verifyRecaptcha.restore();
        });
        
        it('should check create function without password param', function(done) {
            var usr = _.clone(defaultUser);
            usr.password = undefined;
            
            User.create(usr).then(function(results) {
                done("[Test Fail] No error raised!");
            })
            .catch(function(err){
                done(err.code === 'E_UNKNOWN'? undefined : err);
            });
        });
        
        it('should check create function without email param', function(done) {
            var usr = _.clone(defaultUser);
            usr.email = undefined;
            
            User.create(usr).then(function(results) {
                done("[Test Fail] No error raised!");
            })
            .catch(function(err){
                done(err.code === 'E_VALIDATION'? undefined : err);
            });
        });
        
        it('should check create function without name param', function(done) {
            var usr = _.clone(defaultUser);
            usr.name = undefined;
            
            User.create(usr).then(function(results) {
                done("[Test Fail] No error raised!");
            })
            .catch(function(err){
                done(err.code === 'E_VALIDATION'? undefined : err);
            });
        });
        
        it('should check create function without recaptchaResponse param', function(done) {
            var usr = _.clone(defaultUser);
            usr["g-recaptcha-response"] = undefined;
            
            User.create(usr).then(function(results) {
                done("[Test Fail] No error raised!");
            })
            .catch(function(err){
                done(err.code === 'E_UNKNOWN'? undefined : err);
            });
        });
        
        it('should check create function with same email', function(done) {
            var usr1 = _.clone(defaultUser);
            var usr2 = _.clone(defaultUser);
            usr2.name = "Another Name";
            
            User.create(usr1).then(function(results) {
                User.create(usr2).then(function(results) {
                    done("[Test Fail] No error raised!");
                }).catch(function(err){
                    done(err.code === 'E_VALIDATION'? undefined : err);
                });
            });
        });
    });
     
    describe('#valid create()', function() {
        
        var defaultUser = {
            name: 'Mr.Jones-{0}',
            email: 'abX{0}@b.co',
            password: '111222333',
            "g-recaptcha-response": 'valid',
        };
        
        before(function() {
            // Mocking reCAPTCHA
            return sinon.stub(sails.services.authservice, 'verifyRecaptcha', function(response, clientIP) {
                return Promise.resolve();
            });
        });
        
        after(function() {
          // Restores our mock to the original service
          sails.services.authservice.verifyRecaptcha.restore();
          //clearDB(done);
        });
        
        it('should check create function for 3 users', function(done) {
            var users = [];
            for(var i = 0; i < 2; i++){
                var usr = _.clone(defaultUser);
                usr.name = usr.name.replace("{0}", i);
                usr.email = usr.email.replace("{0}", i);
                
                users.push(usr);
            }
            
            User.create(users).exec(function(){
                User.find().then(function(usr){
                    if(usr.length == 3)
                        done();
                    else
                        done('Length = ' + usr.length + ', should be 3');
                });
            });
        });
        
        
        
        
    });

});