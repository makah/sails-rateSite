var Promise = require('bluebird');
var Lodash = require('lodash');

// SearchService.js
module.exports = {

    employee: function(options) {
	    sails.log.verbose('SearchService.search: ', 'options', options);
	    
        if (!options || !options.search) {
          var err = "Failed to search. Missing 'search' on request";
          sails.log.error('SearchService.search', err);
          return Promise.reject({error: err});
        }
	    
	    var maxCount = options.maxCount || 10;
	    var employeeQuery = {workingRegion: {'contains': options.search}, limit: maxCount};
	    
	    /// Note that 'employee' without any 'user' are still included -- their `user` arrays will just be empty.
	    /// http://sailsjs.org/documentation/reference/waterline-orm/queries/populate
        var userQuery = {where: {user: {'contains': options.search},limit: maxCount}};
        
        var employeesNameTask = Employee.find(employeeQuery).populate('user').then(function(employees){
            var result = [];
            for (var e in employees) {
                var employee = employees[e];
                result.push(employee);
            }
            return result;
        });
        
        var employeesRegionTask = Employee.find().populate('user', userQuery).then(function(employees){
            var result = [];
            for (var e in employees) {
                var employee = employees[e];
                result.push(employee);
            }
            return result;
        });
        
        var searchTask = Promise.props({employeesName: employeesNameTask, employeesRegion: employeesRegionTask}).then(function(r){
            var result = Lodash.concat(r.employeesName, r.employeesRegion);

            if(options.sortBy)
                _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
                result = Lodash.sortBy(result, options.orderBy.value, options.orderBy.order);
            
            //filter Employee without User
            //TODO: Learn how to do this inside the query.
            var filteredResult = Lodash.filter(result, function(e){
                return e['user']; //TODO: Understand why e.hasOwnProperty('user') is aways true
            });
            
            return filteredResult.slice(0, maxCount);
        });
        
        return searchTask;
	}
    
    
};