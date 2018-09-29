const request = require('request');

module.exports = (hwid) => {
  return new Promise((resolve, reject) => {
    var options = {
      uri: `http://teamnil.pw/APIs/secret/HWIDcheck?hwid=${hwid}`,
      method: 'POST'
      
    }
    request(options, (err, res, body) => {
      var json = JSON.parse(body);
      
      if(json.success === true) {
        if(json.whitelisted === true) {
          return resolve(true)
        } else {
          return resolve(false);
        }
      } else {
        return reject(json.message);
      }
    });
  })
}