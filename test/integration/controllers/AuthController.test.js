/* global sails */
var request = require('supertest');
var fixtures = require('sails-fixtures');
var sinon = require('sinon');

function clearDB(done){
    sails.once('hook:orm:reloaded', done);
    sails.emit('hook:orm:reload');
}

describe('AuthController', function() {

  describe('#invalid resetPassword()', function() {
    it('should send a non-registered email', function(done) {
      var usr = { email: 'Zerg@st.com' };

      request(sails.hooks.http.app)
        .post('/requestPasswordReset')
        .send(usr)
        .expect(302)
        .expect('Location', '/forgotPassword')
        .end(done);
    });
  });

  describe('#resetPassword()', function() {
    
     before(function() {
       // Mocking reCAPTCHA
       sinon.stub(sails.services.authservice, 'verifyRecaptcha', function(response, clientIP) {
         return response == 'valid' ? Promise.resolve() : Promise.reject();
       });
     });
     
     after(function(){
            sails.services.authservice.verifyRecaptcha.restore();
     });
    
    beforeEach(function(done) {
      var config = {dir: './test/fixtures/UserTest/'};
      fixtures.init(config, done);
    });

    afterEach(function(done) {
      clearDB(done);
    });

    it('should send an e-mail', function(done) {
      var usr = { email: 'mr2@blo.co' };

      request(sails.hooks.http.app)
        .post('/requestPasswordReset')
        .send(usr)
        .expect(302)
        .expect('Location', '/')
        .end(done);
    });
  });






});