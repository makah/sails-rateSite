
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
    
    recalculateAllCache: function() {
        sails.log.verbose('[RatingService.recalculateAllCache() called] ' + __filename);


        var employeesTask = Employee.find().populate('review').then(function(employees) {
            if (!employees || employees.length <= 0) {
                var msg = "Failed to find Employee. 'employee' not found";
                sails.log.error('RatingService.recalculateAllCache.findAll:', msg);
                return Promise.reject(new Error(msg));
            }

            return employees;
        });
        
        return employeesTask.then(function(employees){
            var promises = [];
            
            for (var i = employees.length - 1; i >= 0; i--) {
                var employee = employees[i];
                promises.push(recalculateCache(employee));
            }
            
            return Promise.all(promises);
        });
    },
    
    
};

function recalculateCache(employee) {
    if(!employee || !employee.review || employee.review.length <= 0 ){
        var msg = "Missing param employee. 'employee' or 'employee.review' not found";
        sails.log.error('RatingService.recalculateCache.params:', msg);
        return Promise.reject(new Error(msg));
    }
    
    sails.log.silly('[RatingService.recalculateCache:', employee.id);
    
    var reviewCount = employee.review.length;
    var total = 0;
    for (var i = employee.review.length - 1; i >= 0; i--) {
        var review = employee.review[i];
        
        total += review.rating;
    }
    
    var query = {
        cachedRatingCount: reviewCount,
        cachedRating: total/reviewCount
    };
    return Employee.update(employee.id, query);
}