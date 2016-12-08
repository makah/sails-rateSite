/* global sails */
module.exports = function(req, res, next) {
    sails.log.verbose('[Policy.isAuthenticated() called] ' + __filename);

    if (req.isAuthenticated()) {
        return next();
    }
    
    return res.send({err: 'You are not permitted to perform this action', ok: false});
};
