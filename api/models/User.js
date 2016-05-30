/* global sails User Employer AuthService  */

/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {
    attributes: {
        name: {
            type: 'string',
            required: true
        },        
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            minLength: 6,
        },

        //Association One-to-One, but using 'collection' to mantain sync updating
        employer: {
            collection: 'employer',
            via: 'user'
        },
        
        employee: {
            collection: 'employee',
            via: 'user'
        },

        //Google Signin ID
        googleId: 'string',
        
        //Access token from the Google Authorization Server
        googleAccessToken: 'string',
        
        resetPasswordToken: 'string',
        resetPasswordExpires: 'date',
        
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            delete obj.googleAccessToken;
            delete obj.resetPasswordToken;
            delete obj.resetPasswordExpires;
            
            return obj;
        }
    },
    
    beforeCreate: function(values, cb) {
        if(values.googleId)
            return cb();
        
        var err = new Error(); err.status = 403;
        if (!values.password) {
            err.message = 'Missing password or single sigon';
            sails.log.error('User.beforeCreate', err);
            return cb(err);
        }
        
        var recaptchaResponse = values["g-recaptcha-response"];
        values["g-recaptcha-response"] = undefined;
        if(!recaptchaResponse){
            err.message = 'Missing reCAPTCHA response';
            sails.log.error('User.beforeCreate', err);
            return cb(err);
        }
        
        AuthService.verifyRecaptcha(recaptchaResponse).then(function(){
             encryptPassword(values, cb);
        }).catch(function(){
            err.message = 'Bot attack or dummy user';
            sails.log.error('User.beforeCreate', err);
            return cb(err);
        });
    },
    
    afterCreate: function(newUser, cb) {
        
        Employer.create({user: newUser.id})
        .exec(function(err, newEmployer) {
            if (err) {
                sails.log.error('User.afterCreate: Creating Employer - error:', err);
                return cb(err);
            }

            User.update(newUser.id, {employer: newEmployer.id})
            .exec(function(err, user) {
                if (err) {
                    sails.log.error('User.afterCreate: Update User after creating Employer - error:', err);
                    return cb(err);
                }
                
                return cb();
            });
        });
    },
    
    beforeUpdate: function(user, cb) {
        if (user.password && user.password.length < 60) {
            encryptPassword(user, cb);
        }
        else {
            return cb();
        }
    }
    
};

function encryptPassword(user, cb) {
    bcrypt.genSalt(9, function(err, salt) {
        if (err) {
            sails.log.error('User.encryptPassword.getSalt', err);
            return cb(err);
        }
        
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                sails.log.error('User.encryptPassword.hash', err);
                return cb(err);
            }
            
            user.password = hash;
            return cb();
        });
    });
}