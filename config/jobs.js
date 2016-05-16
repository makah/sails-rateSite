/**
 * Default jobs configuration
 *
 * For more information using jobs in your app, check out:
 * https://github.com/vbuzzano/sails-hook-jobs
 */

module.exports.jobs = {

  // Where are jobs files
  "jobsDirectory": "api/jobs",


  "name": "Rate Site Jobs",
  "processEvery": "1 hour",

};