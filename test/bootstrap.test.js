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

        console.log('\u058D Sails Lift\n');
        done(err, sails);
    });
});

after(function(done) {
    console.log('\u058D Sails Lower');
    
    sails.lower(function(){
        setTimeout(done, 1000);
    });
});
