const request = require('request-promise-native');

const fetchMyIP = function () {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  let ip = JSON.parse(body).ip;
  return request(`http://ip-api.com/json/${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  let LAT = JSON.parse(body).lat;
  let LON = JSON.parse(body).lon;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${LAT}&lon=${LON}`)
}

const nextISSTimesForMyLocation = function() {
  
  return fetchMyIP() 
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((body) => {
      const { response } = JSON.parse(body);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };