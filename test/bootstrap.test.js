var sails = require('sails');

before(function before(done) {
    this.timeout(7000);

    /**  The configuration exported in config/local.js takes precedence 
     * over config/env/test.js configuration files, but config params takes precedence
     * over everything, thats why I'm using this config also
     **/
    var config = {
        log: {
            level: 'silent'
        },
    };

    sails.lift(config, function(err, server) {
        if (err)
            return done(err);

        // here you can load fixtures, etc.
        done(err, sails);
    });
});

after(function(done) {
    sails.lower(done);
});
