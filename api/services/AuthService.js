
var reCAPTCHA = require('recaptcha2');

// AuthService.js
module.exports = {

    equalUser: function(session, userId) {
        sails.log.verbose('[AuthService.equalUser() called] ' + __filename);
        
        return (userId == this.getUser(session));
    },
    
    getUser : function(session) {
        sails.log.verbose('[AuthService.getUser() called] ' + __filename);
    
        if (session && session.passport && session.passport.user)
            return session.passport.user;
        
        if (!session)
            sails.log.error("[AuthService.getUser()] Missing 'session'.")
        
        return "";
    },
    
    verifyRecaptcha: function(response, clientIP) {
        sails.log.verbose('[AuthService.verifyRecaptcha() called] ' + __filename);
        
        var recaptcha = new reCAPTCHA({
            siteKey: sails.config.recaptcha.publicKey,
            secretKey: sails.config.recaptcha.secret,
        });
        
        return recaptcha.validate(response).then(function() {
            return Promise.resolve();
        }).catch(function(errorCodes) {
            return Promise.reject(recaptcha.translateErrors(errorCodes));
        });
    }
    
    
};