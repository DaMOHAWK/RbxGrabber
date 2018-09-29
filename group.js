
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
  let groupids = json.groupids;
  let messages = json.messages;
  var i = 0;
  
  async function loop(){
    if(cookies.length > i) {
      try{
        let message = messages[random(0, messages.length - 1)];
        let cookie = cookies[i];
        let groupid = groupids[random(0, groupids.length -1)];
        //console.log(cookie);
        if(cookie === ''){ throw new Error('Cookie is dead.')}
        let login = await rbxbot.cookie_login(cookie);
        if(login.success === false) {
          
            throw new Error(login.error);
          
        }
        //console.log(groupid);
        let group = await rbxbot.join_group(groupid);
        if(group.success === false) {
          if(group.error.indexOf('a member of group:'+groupid) >= 0) {
            
          }else{
            throw new Error(group.error);
          }
        }
          if(group.pending) {
            log('Requested to join group!', 'success');
            i++;
            return loop();
          } else { 
            log('Successfully joined group!', 'success');
            let grouppost = await rbxbot.group_post(groupid, message);
            if(grouppost.success === false) throw new Error(grouppost.error);
            log('Successfully posted message', 'success');
            
            let leaveaf = await rbxbot.leave_group(groupid);
            if(leaveaf.success === false) throw new Error(leaveaf.error);
            log('Successfully left Group', 'success');
            
          }
          i++;
          process.send('group');
          return loop();
        
      }catch(err){

        if(err.message === 'SyntaxError: Unexpected token < in JSON at position 0') {
          await log('Cookie is dead.', 'failure');
          i++;
          return loop();
        }
        
        if(err.message.indexOf(`groups`) >= 0) {
          
          var msg = err.message.split(' is already a');
          var msg1 = msg[0].split('Error: User:');
          var userid = msg1[1];
          //console.log(msg1)
          if(!userid){
            i++;
            return loop;
          }
          let groups_in = await rbxbot.get_groups_ply(userid);
          if(groups_in.success === false) await log(groups_in.error, 'failure');
          groups_in = JSON.parse(groups_in.groups);
          //console.log(groups_in[0].Id);
          if(groups_in.length < 0) {
            i++;
            return loop();
          }
          let leave = await rbxbot.leave_group(groups_in[0].Id);
          if(leave.success === false) {
            
            await log(leave.error, 'failure');
            i++;
            return loop();
          }
          
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