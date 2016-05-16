
// Needs to be Logged
module.exports = function(req, res, next) {
    sails.log.verbose('[DEBUG POLICY called] ' + __filename);
    
    /* Example:
    req.session = {passport: {user: 29}};
    req.body.employee = '29';
    */
    
    return next();
    
};

