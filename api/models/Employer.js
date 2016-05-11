/**
 * Employer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user: {
      model: 'user',
      unique: true,
    },

    review: {
      collection: 'review',
      via: 'employer'
    },
  },
    
  beforeCreate: function(values, next) {
    // Check if user was added
    if (!values.user) {
      var err = "Failed to create Employer. Missing 'user' on request";
      sails.log.error('Employer.beforeCreate', err);
      return next(err);
    }
  
    // Check if user exists
    var query = {
      id: values.user
    };
    var userTask = User.findOne(query).populate('employer').then(function(user) {
      if (!user) {
        var msg = "Failed to create Employer. 'user' not found";
        sails.log.error('Employer.beforeCreate.findUser:', msg);
        return Promise.reject(msg);
      }
  
      return user;
    });
  
    // Check if user already has Employer
    userTask.then(function(user) {
      if (user.employer[0]) {
        var msg = 'User already has an Employer';
        sails.log.error('Employer.beforeCreate.uniqueUser:', msg);
        return Promise.reject(msg);
      }
      
      return next();
    }).catch(function(err) {
      return next(err);
    });
  }

};
