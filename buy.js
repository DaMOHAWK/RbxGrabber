var os = require('os');
const colors = require('colors');
const fs = require('fs');
const success = 'Success >> '.green.bold;
const failure = 'Failure >> '.red;
const normal = 'Normal >> '.cyan;
var start_prompt = 'RbxGrabber >> '.red.bold;
var log = (msg, type='') => {
  switch(type){
    case "success":
      console.log('RbxGrabber >> '.red.bold + success + msg);
      break;
    case "failure":
      console.log('RbxGrabber >> '.red.bold + failure + msg);
      break;
    case "normal":
      console.log('RbxGrabber >> '.red.bold + normal + msg);
      break;
    default:
      console.log('RbxGrabber >> '.red.bold + normal + msg);
      break;
  }
}

process.setMaxListeners(10000000);

module.exports = async (rbxbot,mcookie,assetid,info,cookie,log) => {
  async function loop() {
  try{
              var login1 = await rbxbot.cookie_login(cookie);
              if(login1.success === false) throw new Error(login1.error);
              //var tries = 0;
              
                let info1 = await rbxbot.user_info();
                if(info1.success === false) throw new Error(info1.error);
                info1 = JSON.parse(info1.info);
                let price = info1.RobuxBalance;
    if(price < 5) {
      return {success:false};
    }
              let mlogin = await rbxbot.cookie_login(mcookie);
              if(mlogin.success === false) throw new Error(mlogin.error);
              //console.log(price);
              
              let configure = await rbxbot.configurePrice(parseInt(assetid), price);
              console.log(configure);
              if(configure.success === false) throw new Error(configure.error);
              await log('Successfully configured asset!', 'success');
    
              
              //console.log(info1);
              
              async function buy() {  
              
              
                var login = await rbxbot.cookie_login(cookie);
                if(login.success === false) throw new Error(login.error);
                var tries = 0;
                

                let buy1 = await rbxbot.buy(parseInt(assetid), price);
                if(buy1.success === false) {
                  //console.log(buy1);
                  if(tries <= 15) {
                    var mlogin = await rbxbot.cookie_login(mcookie);
              if(mlogin.success === false) throw new Error(mlogin.error);
              let configure = await rbxbot.configurePrice(parseInt(assetid), price);
              if(configure.success === false) throw new Error(configure.error);
                    tries++;
                    return await buy();
                  } else {
                    tries = 0;
                    await log('Failed to buy in 15 tries, skipping', 'normal');
                    return await {success:false};
                  }
                };
                tries = 0;
                await log('Successfully bought shirt for ' + price, 'success');
                

                return {success:true, robux: price};
              }
                return await buy();
              }catch(err){
        if(err.message === 'Unexpected token < in JSON at position 4') {
          await log('Cookie is dead.', 'failure');
          return({success: false});
        }
        await log(err.message, 'failure');
        return({success: false});
      }
  }
  return await loop();
}

process.on('message', async (cookies) => {
  const source = require('../utils/rbxbot.js');
  const rbxbot = new source();
  //const removeCookie = require('./removecookie.js');
  
  var i = 0;
  
  async function loop(){
    if(cookies.length > i) {
      try{
        let cookie = cookies[i];
        if(cookie === '') throw new Error('Cookie is blank');
        let login = await rbxbot.cookie_login(cookie);
        if(login.success === false) {
          throw new Error(login.error);
        }
        let info = await rbxbot.user_info();
        if(info.success === false) throw new Error(info.error);
        info = JSON.parse(info.info);
        
        if(info.RobuxBalance >= 5) {
          await fs.readFile('settings.txt', 'utf8', async (err, data) => {
            if(err) throw new Error(err);
            var array = data.split(os.EOL);
            //console.log(array);
            var guser = array[0].split('=')[1];
            var gpass = array[1].split('=')[1];
            var assetid = array[3].split('=')[1]; 
            var mcookie = array[4].split('=')[1];
            
            let rdel = await rbxbot.delete(assetid);
            if(rdel.success === true) {
              process.send({success: true, mcookie: mcookie, assetid: assetid, info: info, cookie: cookie});
              i++;
              return loop();
            } else {
              throw new Error(rdel.error);
            }
          });
          //console.log(info.RobuxBalance);
        } else {
          //console.log(info.RobuxBalance);
          await log('User has less than 5 robux!', 'normal');
          process.send({success: false});
          i++;
          return loop();
        }
      }catch(err){
        if(err.message === 'Unexpected token < in JSON at position 4') {
          await log('Cookie is dead.', 'failure');
          i++;
          
          process.send({success: false, dead: true, cookie: cookies[i]});
          return loop();
        }
        await log(err.message, 'failure');
        i++;
        process.send({success: false});
        return loop();
      }
    } else {
      return process.exit(1);
    }
  }
  loop();
})

