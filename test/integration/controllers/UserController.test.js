/* global sails */
var request = require('supertest');

describe('UserController', function() {

  describe('#login()', function() {
    it('should receive JSON with error when try to login with incorrect email/password', function (done) {
      var usr = { email: 'Zerg@st.com', password: 'greZ' }; 
      
      request(sails.hooks.http.app)
        .post('/login')
        .send(usr)
        .expect(200)
        .expect({message: "Incorrect email.", user: false}, done);
    });
    
     it('should receive JSON with error when try to login with invalid params', function (done) {
      var usr = { name: 'Zerg', password: 'greZ' }; 
      
      request(sails.hooks.http.app)
        .post('/login')
        .send(usr)
        .expect(200)
        .expect({message: "Missing credentials", user: false}, done);
    });
  });

});