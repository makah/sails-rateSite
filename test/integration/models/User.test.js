/* global sails User Employer */
'use strict';

var _ = require("lodash");
var sinon = require('sinon');
var expect = require('chai').expect;
var fixtures = require('sails-fixtures');

function clearDB(done){
    sails.once('hook:orm:reloaded', done);
    sails.emit('hook:orm:reload');
}

describe('UserModel', function() {

    describe('#find()', function() {
        
        before(function(done) {
            // Mocking reCAPTCHA
            sinon.stub(sails.services.authservice, 'verifyRecaptcha', function(response, clientIP) {
                return response == 'valid' ? Promise.resolve() : Promise.reject();
            });
            
            var config = {dir: './test/fixtures/UserTest/'};
            fixtures.init(config, done);
        });
        
        after(function(done){
            sails.services.authservice.verifyRecaptcha.restore();
            
            clearDB(done);
        });
        
        
        it('should check find function', function(done) {
            User.find().then(function(users) {
                expect(users).to.have.length(5);
                expect(users).to.not.be.empty;
                for (var i = users.length; i--; ) {
                    expect(users[i].name).to.match(/Mr\.Jones-\d+/g);
                }
                
                done();
            })
            .catch(done);
        });
    });
    
    describe('#reCAPTCHA()', function(done) {
        var defaultUser = {
            name: 'Mr.Jones',
            email: 'a@b.co',
            password: '111222333',
            "g-recaptcha-response": 'valid',
        };
        
        before(function() {
            // Mocking reCAPTCHA
            sinon.stub(sails.services.authservice, 'verifyRecaptcha', function(response, clientIP) {
                return response == 'valid' ? Promise.resolve() : Promise.reject();
            });
        });
        
        after(function(done) {
          // Restores our mock to the original service
          sails.services.authservice.verifyRecaptcha.restore();
          return clearDB(done);
        });
        
        it('should check if reCAPTCHA is running without error when Service returns ok', function(done){
            var usr = _.clone(defaultUser);
            
            User.create(usr).then(function(results) {
                done();
            })
            .catch(function(err){
                done(err);
            });
        });
        
        it('should check if reCAPTCHA is running without error when Service returns fail', function(done){
            var usr = _.clone(defaultUser);
            usr["g-recaptcha-response"] = 'invalid';
            
            User.create(usr).then(function(results) {
                done("[Test Fail] No error raised!");
            })
            .catch(function(err){
                done(err.code === 'E_UNKNOWN'? undefined : err);
            });
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
            return sinon.stub(sails.services.authservice, 'verifyRecaptcha', function(response, clientIP) {
                return Promise.resolve();
            });
        });
        
        beforeEach(function(done){
            clearDB(done);
        });
        
        after(function(done) {
          sails.services.authservice.verifyRecaptcha.restore();
          User.destroy({}).exec(function(){
              Employer.destroy({}).exec(done);
          });
          
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
                User.find().exec(function(err, usr){
                    if(err){
                        done(err);
                    }
                    
                    expect(usr).to.have.length(i);
                    done();
                });
            });
        });
        
    });
    
    describe('#create, find and remove', function(){});

});