
var Promise = require('bluebird');

// RatingService.js
module.exports = {

    updateEmployee: function(rateValue, employeeId) {
        sails.log.verbose('[RatingService.updateEmployee() called] ' + __filename);
        
        var query = {id: employeeId};
        var employeeTask = Employee.findOne(query).then(function(employee){
          if(!employee){
            var msg = "Failed to update Employee rate. 'employee' not found";
            sails.log.error('RatingService.updateEmployee.findEmployee:', msg);
            return Promise.reject(new Error(msg));
          }
          
          return employee;
        });
         
        var updateValueTask = employeeTask.then(function(employee){
            var qnt = employee.cachedRatingCount;
            var totalRating = employee.cachedRating * qnt + rateValue;
            var totalQuantity = qnt + 1;
            
            sails.log.verbose('[RatingService.updateEmployee.updateValue] cachedRatingCount:' + employee.cachedRatingCount
                    + ' before cachedRating:' + employee.cachedRating + 'new rateValue:' + rateValue);
            
            return {
                cachedRating: totalRating / totalQuantity,
                cachedRatingCount: totalQuantity
            };
        });
        
        
        return updateValueTask.then(function(query){
            return Employee.update(employeeId, query);
        });
    },
    
};
