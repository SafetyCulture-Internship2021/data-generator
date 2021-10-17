const model = {};

const users = {};
users.getUserByID = {
  service: 'users',
  method: 'GET',
  url: '/users/:id',
  rate: {
    organic_rps_range: [20, 40],
    failure_rate: 0.1,
    failure_profile: [{
      code: 404,
      ratio: 0.8
    }, {
      code: 403,
      ratio: 0.15
    }, {
      code: 500,
      ratio: 0.05
    }]
  }
}

const identity = {};
identity.signIn = {
  service: 'identity',
  method: 'POST',
  url: '/signin',
  calls: [{
    endpoint: users.getUserByID,
    ratio: 1
  }],
  rate: {
    organic_rps: [10, 50],
    failure_rate: 0.25,
    failure_profile: [{
      code: 401,
      ratio: 0.99
    }, {
      code: 500,
      ratio: 0.01
    }]
  }
};
identity.refresh = {
  service: 'identity',
  method: 'POST',
  url: '/refresh',
  calls: [{
    endpoint: users.getUserByID,
    ratio: 1
  }],
  rate: {
    organic_rps: [20, 200],
    failure_rate: 0.005,
    failure_profile: [{
      code: 401,
      ratio: 0.99
    }, {
      code: 500,
      ratio: 0.01
    }]
  }
}

const dataPoints = [];
dataPoints.push()

users.getUser = {
  calls: []
}