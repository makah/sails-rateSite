
// Needs to be Logged
module.exports = function(req, res, next) {
    sails.log.verbose('[Policy.insertUserId() called] ' + __filename);
    
    if (req.session && req.session.passport && req.session.passport.user) {
        req.body.user = req.session.passport.user;
        return next();
    }
    
    var err = 'Missing userId Passport session';
    if(!req.session.flash) 
        req.session.flash = {}; 
        
    req.session.flash.error = [err];
    sails.log.error('Policy.insertUserId', err);
    return res.redirect(307, '/');
};

