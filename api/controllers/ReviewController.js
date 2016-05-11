/**
 * ReviewController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	userReview: function(req, res){
		var params = req.params.all();
		sails.log.info('ReviewController.userReview: ', 'Params', params);
		return res.view('review/userReview', params);
	}
};

