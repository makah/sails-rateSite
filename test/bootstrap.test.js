var sails = require('sails');

before(function before(done) {
    this.timeout(7000);

    var config = {
        environment: 'test',


        models: {
            connection: 'localDiskDb',
            migrate: 'drop'
        },

        csrf: false,

        log: {
            level: 'error'
        },

        hooks: {
            grunt: false,
            socket: false,
            pubsub: false,
            jobs: false,
        }

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
