const request = require("request");

const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((callback) => {
    request('https://api.ipify.org?format=json', (error, response, body) => {
      if (error) {
        return callback(error, null);
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }
      const ip = JSON.parse(body).ip;
      callback(null, ip);
    });
    
    fetchCoordsByIP(ip, (callback) => {
      request(`http://ip-api.com/json/${ip}`, (error, response, body) => {
        if (error) {
          callback(error, null);
          return;
        }
        
        if (response.statusCode !== 200) {
          const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
          callback(Error(msg), null);
          return;
        }
        
        let data = JSON.parse(body);
        if (data.status === 'fail') {
          callback('There is something wrong with your IP address', null);
        } else {
          let coordObj = {latitude: data.lat, longitude: data.lon};
          return callback(null, coordObj); 
        }
      });
      
      fetchISSFlyOverTimes(coords, (callback) => {
        const LAT = coords.latitude;
        const LON = coords.longitude;
        request(`http://api.open-notify.org/iss-pass.json?lat=${LAT}&lon=${LON}`, (error, response, body) => {
          if (error) {
            callback(error, null);
            return;
          }
          
          if (response.statusCode !== 200) {
            const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
            callback(Error(msg), null);
            return;
          }
          
          const data = JSON.parse(body);
          return callback(null, data.response);
        });
      
      
      });
    });
  });
};






module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };
  // const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  // request(url, (error, response, body) => {
  //   if (error) {
  //     callback(error, null);
  //     return;
  //   }

  //   if (response.statusCode !== 200) {
  //     callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
  //     return;
  //   }

  //   const passes = JSON.parse(body).response;
  //   callback(null, passes);
  // });