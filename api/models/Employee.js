/**
 * Employee.js
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

    workingRegion: 'string',

    cachedRating: 'float',
    cachedRatingCount: 'integer',

    review: {
      collection: 'review',
      via: 'employee'
    },
  },

  beforeCreate: function(values, next) {
    
    // Add default value to Cached Rating
    values.cachedRating = 0;
    values.cachedRatingCount = 0;

    // Check if user was added
    if (!values.user) {
      var err = "Failed to create Employee. Missing 'user' on request";
      sails.log.error('Employee.beforeCreate', err);
      return next(err);
    }
    
    // Check if user exists
    var query = {id: values.user};
    var userTask = User.findOne(query).populate('employee').then(function(user){
      if(!user){
        var msg = "Failed to create Employee. 'user' not found";
        sails.log.error('Employee.beforeCreate.findUser:', msg);
        return Promise.reject(msg);
      }
      
      return user;
    });
    
    // Check if user already has employee
    userTask.then(function(user){
      if(user.employee[0]){
        var msg = 'User already has an Employee';
        sails.log.error('Employee.beforeCreate.uniqueUser:', msg);
        return Promise.reject(msg);
      }
        
      return next();
    }).catch(function(err){
      return next(err);
    });
  },


  afterCreate: function(newEmployee, next) {
    var updateValue = { employee: newEmployee.id };
    User.update(newEmployee.user, updateValue).then(function(user){
      return next();
    }).catch(function(err){
      sails.log.error('Employee.afterCreate: Update User after creating Employee - error:', err);
      return next(err);
    });
  }
};
