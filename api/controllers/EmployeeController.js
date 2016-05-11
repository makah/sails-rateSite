/**
 * EmployeeController
 *
 * @description :: Server-side logic for managing employees
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
    
    search: function(req, res){
        var params = req.params.all();
        sails.log.info('EmployeeController.search: ', 'Params', params);
        
        var options = {
            search: params.search,
            maxCount: 5,
            orderBy: {
                value: 'cachedRating',
                order: 'desc'
            }
        };
        
        SearchService.employee(options).then(function(result){
           res.render('static/searchEmployee', {employees: result});
        }).catch(function(err){
            return res.send(err);
        });
    },
    
};

