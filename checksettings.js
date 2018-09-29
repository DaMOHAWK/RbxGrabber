const fs = require('fs');
const os = require('os');
function c() {

}
var start_prompt = 'RbxGrabber >> '.red.bold;
c.prototype.error = (msg) => {
  console.log(start_prompt + '>> ERROR >> '.red + msg);
}
module.exports = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('settings.txt', 'utf8', (err, data) => {
      if(err) return reject(err);
      var array = data.split(os.EOL);
    //console.log(array);
    var guser = array[0].split('=')[1];
    var gpass = array[1].split('=')[1];
    var assetid = array[3].split('=')[1]; 
    //console.log(guser + gpass + assetid);
      var error = "You are missing"
      if(guser === '') {
        error += ' username '
      }
      if(gpass === '') {
        error += ' password '
      }
      if(assetid === '') {
        error += ' assetid '
      }
      if(error === "You are missing") {
        resolve();
      } else {
        reject(error + 'in your settings.txt');
      }
    })
  });
}