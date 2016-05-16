/**
 * Review.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var Promise = require("bluebird");

module.exports = {
  attributes: {
    employer: {
      model: 'employer'
    },

    employee: {
      model: 'employee'
    },

    rating: {
      type: 'integer',
      min: 0,  //Between 1 to 4 stars
      max: 4,
    },

    comment: {
      type: 'string'
    },
  },

  beforeCreate: function(values, next) {
    sails.log.verbose('Review.beforeCreate: ', 'Values', values);
    var err;

    // Convert user to employer
    values.employer = values.user;
    values.user = undefined;

    // Check if employer was added
    if (!values.employer) {
      err = "Failed to create Review. Missing 'employer' on request";
      sails.log.error('Review.beforeCreate', err);
      return next(err);
    }

    // Check if employer exists
    var userQuery = {id: values.employer};
    var userTask = User.findOne(userQuery).then(function(user){
      if(!user){
        var msg = "Failed to create Review. 'user' not found";
        sails.log.error('Review.beforeCreate.findUser:', msg);
        return Promise.reject(new Error(msg));
      }

      return user;
    });

    // Check if employee exists
    var employeeQuery = {id: values.employee};
    var employeeTask = Employee.findOne(employeeQuery).then(function(employee){
      if(!employee){
        var msg = "Failed to create Review. 'employee' not found";
        sails.log.error('Review.beforeCreate.findUser:', msg);
        return Promise.reject(new Error(msg));
      }

      return employee;
    });

    //Check if employer already made a Review about this employee
    var reviewQuery = {employer: values.employer, employee: values.employee};
    var reviewTask = Review.findOne(reviewQuery).then(function(review){
      if(review){
        var msg = "Failed to create Review. 'employer' already did a review about this employee";
        sails.log.error('Review.beforeCreate.findReview:', msg);
        return Promise.reject(new Error(msg));
      }

      return review;
    });

    Promise.all([userTask, employeeTask, reviewTask]).then(function(){
      return next();
    }).catch(function(err){
      return next(err);
    });
  },
  
  
  afterCreate: function(newReview, next) {
    sails.log.verbose('Review.afterCreate: ', 'NewReview', newReview);

    if(!newReview.employee){
      var msg = "New Review has no Employee. 'employee' not found";
      sails.log.error('Review.afterCreate:', msg);
      return next(msg);
    }
    
    
    var query = {id: newReview.employee};
    Employee.findOne(query).then(function(employee){
      if(!employee){
        var msg = "Failed to find Employee. 'employee' not found";
        sails.log.error('Review.afterCreate.findUser:', msg);
        return next(msg);
      }
      
      return RatingService.updateEmployee(newReview.rating, employee.id).asCallback(next);
    }); 
  },

};

