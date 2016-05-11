
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
    
};