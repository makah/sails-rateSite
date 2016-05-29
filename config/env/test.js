

module.exports = {
  
  models: {
    connection: 'memoryDb',
  },
  
  csrf: false,
  
  hooks: {
    grunt: false,
    socket: false,
    pubsub: false,
    jobs: false,
  }
};
