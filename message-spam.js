var os = require('os');
const colors = require('colors');
const fs = require('fs');
const success = 'Success >> '.green.bold;
const failure = 'Failure >> '.red;
const normal = 'Normal >> '.cyan;
var start_prompt = 'RbxGrabber >> '.red.bold;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

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

process.on('message', async (json) => {
  const source = require('./utils/rbxbot.js');
  const rbxbot = new source();
  let cookies = json.cookies;
  let message = json.message;
  //console.log(message);
  var i = 0;
  async function loop(){
    if(cookies.length > i) {
      try{
        let cookie = cookies[i];
        //console.log(cookie);
        if(cookie === ''){ throw new Error('Cookie is dead.')}
        let login = await rbxbot.cookie_login(cookie);
        if(login.success === false) {
          throw new Error(login.error);
        }
        
        let convos = await rbxbot.getConversations();
        if(convos.success === false) {
          throw new Error(convos.error);
        }
        convos = convos.conversations;
        var c = 0;
        console.log(cookie);
        if(convos.length <= 0) throw new Error('User has no friend chats!');
        async function send(){
          if(convos.length > c) {
            try{
            let convo = convos[c];
            let sendmsg = await rbxbot.sendmsg(message, convo.id);
            if(sendmsg.success === false) throw new Error(sendmsg.error);
            
            process.send({success: true,type:'message', value: convo.participants.length - 1});
            log(`Successfully sent message to chat ${convo.title} with ${convo.participants.length - 1} members!`, 'success');
            c++;
              
            return send();
            }catch(err){
              process.send({success: false, type:'regular'});
        if(err.message === 'SyntaxError: Unexpected token < in JSON at position 0') {
          await log('Cookie is dead.', 'failure');
          i++;
          return loop();
        }
              
        if(err.message === 'Could not send message to Conversation!') {
          await log('Broken user, Skipping.', 'normal');
          i++;
          loop();
        }

        
        
        await log(err.message, 'failure');
        i++;
        return send();
            }
          } else {
            i++;
            c = 0;
            process.send({success: true,type:'regular'});
            return loop();
          }
        }
        send();
      }catch(err){
        process.send({success: false, type:'regular'});
        if(err.message === 'SyntaxError: Unexpected token < in JSON at position 0') {
          await log('Cookie is dead.', 'failure');
          i++;
          return loop();
        }

        
        
        await log(err.message, 'failure');
        i++;
        return loop();
      }
    } else {
      return process.exit(1);
    }
  }
  loop();
})