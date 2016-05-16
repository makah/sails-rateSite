
module.exports = function(agenda) {
    var job = {
        name: 'RecalculateEmployeeRating',

        frequency: 'every 12 hours',
        
        options: {
            priority: 'low'
        },

        // execute job
        run: function(job, done) {
            var jobName = ((job && job.attrs) ? job.attrs.name : 'emptyName') || 'emptyName';
            sails.log.verbose('[Jobs.' + jobName + ' called] ' + __filename);
            
            RatingService.recalculateAllCache().then(function(){
                sails.log.verbose('Job ' + jobName + ' ran.');
            }).catch(function(err){
                sails.log.verbose('Job ' + jobName + ' ran. Error:' + err);
            }).asCallback(done);
        },
    };
    
    return job;
};
