const fs = require('fs');
const os = require('os');



module.exports = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./combos.txt', 'utf8', (err, data) => {
      if(err) return reject(err);
      data = data.split(os.EOL);
      //console.log(data);
      //console.log(data);
      resolve(data);
    })
  })
}