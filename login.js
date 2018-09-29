const conif = require('node-console-input');
const colors = require('colors');
const fs = require('fs');
const hwid = require("machine-uuid");
const hwidcheck = require('./hwidcheck.js');
const checksettings = require('./checksettings.js');
const getcookies = require('./getcookies.js');
const getcombos = require('./getcombos.js');
const buy = require('./buy.js');
const cluster = require('cluster');

const source = require('./utils/rbxbot.js');
const rbxbot = new source();

var total = 0;
var left = 0;
var checked = 0;
var title = 'BLANK';

var setTitle = require('console-title');

setInterval(()=>{setTitle(`RbxGrabber Cracked By Pritunl & Twistyyy [v2.5] | ${checked}/${left} | [${title}: ${total}]`);});

const errmsg = 'Please send a screenshot of this error to Twistyyy#4775\n';
cluster.setMaxListeners(10000000);
const success = 'Success >> '.green.bold;
const failure = 'Failure >> '.red;
const normal = 'Normal >> '.cyan;
var start_prompt = 'RbxGrabber >> '.red.bold;
var os = require('os');

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

async function start_menu() {
  hwid()
    .then((id) => {
      //console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
      log('Started');
      log('Fucking Penguins');
      //log('Grabbed HWID >> ' + id + ' >> Checking for whitelist');
      //log('Grabbed HWID >> CENSORED >> Checking for whitelist');
    
      hwidcheck(id)
        .then(whitelisted => {
          if(whitelisted === true) {
            log('Cracked By Pritunl & Twistyyy');
            
            let cookies_file_w = fs.createWriteStream('cookies.txt',{
              flags    : 'a',
              encoding : 'utf8',
            });
            let settings_file_w = fs.createWriteStream('settings.txt',{
              flags    : 'a',
              encoding : 'utf8'
            });
            let combos_file_w = fs.createWriteStream('combos.txt',{
              flags    : 'a',
              encoding : 'utf8'
            });
            
            let gids_file_w = fs.createWriteStream('groupids.txt',{
              flags    : 'a',
              encoding : 'utf8'
            });
            
            let messages_file_w = fs.createWriteStream('messages.txt',{
              flags    : 'a',
              encoding : 'utf8'
            });
            
            var settings_template = `username=${os.EOL}password=${os.EOL}groupid=${os.EOL}assetid=${os.EOL}`;
            fs.readFile('settings.txt', 'utf8', (err, data) => {
            if(err) return log(err, 'failure');
            //console.log(data);
            var array = data.split('');
            //console.log(array.length);
            
            if(array.length === 0) {
              //console.log('work')
              fs.writeFile('settings.txt', `username=${os.EOL}password=${os.EOL}groupid=${os.EOL}assetid=${os.EOL}mcookie(Auto-Generated/Don't touch)=`, (err) => {
                if(err) return log(err, 'failure');
                return next(id);
              });
          
            
            } else {
              //console.log('no work')
              //console.log(JSON.stringify(data));
              return next(id);
            }
          })
          } else {
            log('Not Whitelisted, NOTE: PLEASE WHITELIST IT IN DMS WITH BOT!\n\n\n');
            var restart = conif.getConsoleInput(start_prompt + "type restart to restart the bot >> ", false);
            if(restart === 'restart') {
              console.log('\n\n\n\n');
              return start_menu();
            }
          }
      })
        .catch((err) => {
          log(err, 'failure');
          return setTimeout(()=>{start_menu()}, 2500);
      })
  })
    .catch((err) => {
      log(err, 'failure');
      return setTimeout(()=>{start_menu()}, 2500);
  })
}

async function next(id) {
  console.log('\nRBXGRABBER\n'.red.bold);
  console.log('1. Check cookies in cookies.txt'.bold);
  console.log('2. Refresh cookies in combos.txt (sends to cookies.txt)'.bold);
  console.log('3. Favorite Bot an Item using your cookies'.bold);
  console.log('4. Group Bot a group using your cookies'.bold);
  console.log('5. Group Spam a group using your cookies'.bold);
  console.log('6. Message all friend chats once using your cookies'.bold);
  console.log('7. Follow bot a player using your cookies'.bold);
  console.log('\nPlease type the number you want and press enter\n\n'.white.bold);
  
  var choice = conif.getConsoleInput(start_prompt + "Choose >> ", false);
  
  var threads = conif.getConsoleInput(start_prompt + "Threads >> ", false);
  
  switch(choice) {
    case '1':
      async function cookies_func(){
        var guser = '';
        var gpass = '';
      log('Starting RbxGrabber: Cookies', 'success');
      await fs.readFile('settings.txt', 'utf8', async (err, data) => {
            if(err) throw new Error(err);
            var array = data.split(os.EOL);
            //console.log(array);
            guser = array[0].split('=')[1];
            gpass = array[1].split('=')[1];
            var assetid = array[3].split('=')[1]; 
            var mcookie = array[4].split('=')[1];
            if(guser === '' || gpass === '') {
            log('Username or password is blank', 'failure');
                return start_menu();
              }
        
            if(mcookie === '') {
              await log('Refreshing main cookie!', 'normal');
              let login = await rbxbot.login(guser, gpass, id);
              if(login.success === true) {
                var array = data.split(os.EOL);
                var mcookie = array[4].split('=');
                mcookie[1] = login.cookie;
                var cookie = mcookie.join("=");
                array[4] = cookie;
                data = array.join(os.EOL);
                fs.writeFile('settings.txt',data, async (err) => {
                  if(err) throw new Error(err);
                  await log('Successfully refreshed main cookie!');
                })
              } else {
                log('Could not refresh cookie, returning to menu', 'failure');
                return start_menu();
              }
                                     
                
            }
      })
      
      
        
      function getcookies1() {
      getcookies()
        .then((cookies) => {
          if(guser === '' || gpass === '') {
                return;
              }
          if(cookies.length >= 1) {
            left = cookies.length;
            if(title !== 'ROBUX') total = 0;
            checked = 0;
            
            let chunks = chunkify(cookies, threads);
            const path = require('path');
            cluster.setupMaster({
              exec: path.join(__dirname,'\checkcookies.js'),
            });
            var exit = false;
            var start = Date.now();
            
            var list = [];
            //var dead = [];
            var buying = false;
            title = 'ROBUX';
            var buyloop = async () => {
              if(buying === true) {
                return setTimeout(buyloop,1000);
              } else {
                if(list.length >= 1) {
                  let c = list[0];
                  buying = true;
                  let buy_await = await buy(rbxbot,c.mcookie,c.assetid,c.info,c.cookie,log);
                  if(buy_await.success === true) {
                    let update_total = require('../utils/update-total.js');
                    total += buy_await.robux;
                    update_total(buy_await.robux, id)
                      .then(() => {
                        checked++;
                        buying = false;
                        list.splice(0, 1);
                        return setTimeout(() => {buyloop();},1000);
                    })
                      .catch((err) => {
                        log(err, 'failure');
                    })
                    
                  } else {
                    checked++;
                        buying = false;
                        list.splice(0, 1);
                        return setTimeout(() => {buyloop();},1000);
                  }
                } else {
                  return setTimeout(buyloop, 1000);
                }
              }
            }
            buyloop();
            
            for (var i = 0; i < threads; i++) {
              var worker = cluster.fork();
              
              worker.setMaxListeners(10000000);
              worker.send(chunks[i]);
              
              worker.on('message', async (msg) => {
                
                
                if(msg.success === true) {
                  list.push(msg);
                } else {
                  if(msg.dead === true) {
                    //dead.push(msg.cookie);
                  }
                  checked++;
                }
                //console.log(checked + '/' + left + ' | TOTAL ROBUX GRABBED: ' + total_robux);
                
              });
              
              
          }
          
            var ended = () => {
              if(checked >= left) {
                //removeCookies(dead);
                log('Successfully checked all cookies! Time Taken: '+(Date.now() - start)+'ms' , 'success');
                log('Restarting in 60s', 'normal');
                exit = true;
                return setTimeout(()=>{cookies_func();}, 60000);
              } else {
                return setTimeout(ended, 1000);
              }
            }
            ended();
            
          } else {
            log('Add some cookies and try again!', 'failure');
            return setTimeout(() => {next(id)}, 3500);
          }
      })
        .catch((err) => {
        log('An error occured while getting cookies!', 'failure');
        return setTimeout(() => {next(id)}, 3500);
      });
      }
        await getcookies1();
      }
      await cookies_func();
      

      break;
    case '2':
      async function logincheck(){

      log('Starting RbxGrabber: Cookie Refresher', 'success');

        //console.log(combos);
        

      return await getcombos()
        .then((combos) => {
          if(combos.length >= 1) {
            let chunks = chunkify(combos, threads);
            const path = require('path');
            left = combos.length;
            checked = 0;
            if(title !== 'REFRESHED') total = 0;
            title = 'REFRESHED';
            cluster.setupMaster({
              exec: path.join(__dirname,'\login.js'),
            });
            var exit = false;
            var start = Date.now();
          
            for (var i = 0; i < threads; i++) {
              var worker = cluster.fork();

              worker.setMaxListeners(10000000);
            worker.send({combos:chunks[i],hwid:id});

              worker.on('message', async (msg) => {
                checked++;
                
                if(msg.success === true) {
                  total++;
                  await fs.appendFile('cookies.txt',msg.cookie + os.EOL, (err) => {
                    if(err) log(err, 'failure')
                    
                  })
                }
              });
              
              
          }
            cluster.on('exit', function(worker) {
                //after every bot is done
                if  (Object.keys(cluster.workers).length === 0) {
                  if(exit === true) return;
                  fs.writeFile('combos.txt', '', (err) => {
                  log('Successfully refreshed all combos! Time Taken: '+(Date.now() - start)+'ms' , 'success');
                  log('Returning to menu in 5 seconds', 'normal');
                  exit = true;
                  return setTimeout(()=>{start_menu();}, 5000);
                  })
                }

              });
          
            
          } else {
            log('Add some cookies and try again!', 'failure');
            return setTimeout(() => {next(id)}, 3500);
          }
          })
        .catch((err) => {
        log('An error occured while getting combos!', 'failure');
        return setTimeout(() => {next(id)}, 3500);
      });
        
      }
      logincheck();
      break;
    case '3':
      function favorite(){
      var assetid = conif.getConsoleInput(start_prompt + "AssetId >> ", false);
      log('Starting RbxGrabber: Favorites', 'success');
      getcookies()
        .then((cookies) => {
          if(cookies.length >= 1) {
            let chunks = chunkify(cookies, threads);
            const path = require('path');
            cluster.setupMaster({
              exec: path.join(__dirname,'/favorite.js'),
            });
            var exit = false;
            var start = Date.now();
            if(title !== 'FAVORITES') total = 0;
            title = 'FAVORITES';
            
            left = cookies.length;
            for (var i = 0; i < threads; i++) {
              var worker = cluster.fork();
              
              worker.setMaxListeners(10000000);
            worker.send({cookies:chunks[i],assetid: assetid, hwid: id});
              
              worker.on('message', async (msg) => {
                checked++;
                
                if(msg.success === true)total++;
              });
              
              cluster.on('exit', function(worker) {
                //after every bot is done
                if  (Object.keys(cluster.workers).length === 0) {
                  if(exit === true) return;
                  log('Successfully favorited game with all cookies! Time Taken: '+(Date.now() - start)+'ms' , 'success');
                  log('Returning to menu in 5 seconds', 'normal');
                  exit = true;
                  return setTimeout(()=>{start_menu();}, 5000);
                }

              });
          }
          
            
          } else {
            log('Add some cookies and try again!', 'failure');
            return setTimeout(() => {next(id)}, 3500);
          }
      })
        .catch((err) => {
        log('An error occured while getting cookies!', 'failure');
        return setTimeout(() => {next(id)}, 3500);
      });
      }
      favorite();
      break;
    case "4":
      function group(){
      var groupid = conif.getConsoleInput(start_prompt + "GroupId >> ", false);
      log('Starting RbxGrabber: Group Bot', 'success');
      getcookies()
        .then((cookies) => {
          if(cookies.length >= 1) {
            let chunks = chunkify(cookies, threads);
            const path = require('path');
            left = cookies.length;
            checked = 0;
            if(title !== 'JOINS') total = 0;
            title = 'JOINS';
            cluster.setupMaster({
              exec: path.join(__dirname,'\group.js'),
            });
            var exit = false;
            var start = Date.now();
            for (var i = 0; i < threads; i++) {
              var worker = cluster.fork();
              
              worker.setMaxListeners(10000000);
            worker.send({cookies:chunks[i],groupid: groupid});
              
              worker.on('message', async (msg) => {
                checked++;
                total++;
              });
              
              cluster.on('exit', function(worker) {
                //after every bot is done
                if  (Object.keys(cluster.workers).length === 0) {
                  if(exit === true) return;
                  log('Successfully botted group with all cookies! Time Taken: '+(Date.now() - start)+'ms' , 'success');
                  log('Returning to menu in 5 seconds', 'normal');
                  exit = true;
                  return setTimeout(()=>{start_menu();}, 5000);
                }

              });
          }
          
            
          } else {
            log('Add some cookies and try again!', 'failure');
            return setTimeout(() => {next(id)}, 3500);
          }
      })
        .catch((err) => {
        log('An error occured while getting cookies!', 'failure');
        return setTimeout(() => {next(id)}, 3500);
      });
      }
      group();
      break;
    case "5":
      async function group_spam(){
      var groupids = [];
        var messages = [];
      await fs.readFile('groupids.txt', 'utf8', (err, data) => {
        if(err) {
          log(err, 'failure');
          return start_menu();
        }
        if(data === '') {
          log('Please add some groupids first before using this', 'normal');
          return setTimeout(start_menu, 2500);
        }
        groupids = data.split(os.EOL);
        fs.readFile('messages.txt', 'utf8', (err, data) => {
          if(err) {
          log(err, 'failure');
          return start_menu();
        }
        if(data === '') {
          log('Please add some groupids first before using this', 'normal');
          return setTimeout(start_menu, 2500);
        }
          messages = data.split(os.EOL);
        })
        
        
      })
        

      
      log('Starting RbxGrabber: Raid Bot', 'success');
      async function the() {
      getcookies()
        .then((cookies) => {
          if(cookies.length >= 1) {
            let chunks = chunkify(cookies, threads);
            const path = require('path');
            cluster.setupMaster({
              exec: path.join(__dirname,'\group_spam.js'),
            });
            left = cookies.length;
            checked = 0;
            if(title !== 'MESSAGES') total = 0;
            title = 'MESSAGES';
            var exit = false;
            var start = Date.now();
            for (var i = 0; i < threads; i++) {
              var worker = cluster.fork();

              worker.setMaxListeners(10000000);
            worker.send({cookies:chunks[i],groupids: groupids, messages: messages});
              
              worker.on('message', async (msg) => {
                if(msg.success === true) total++;
                checked++;
              });
              
              

              
          }
          
            cluster.on('exit', function(worker) {
                //after every bot is done
                if  (Object.keys(cluster.workers).length === 0) {

                  log('Successfully spammed group with all cookies! Time Taken: '+(Date.now() - start)+'ms' , 'success');
                  log('Restarting in 5 seconds', 'normal');

                  return setTimeout(()=>{the();}, 5000);
                }
              });
          } else {
            log('Add some cookies and try again!', 'failure');
            return setTimeout(() => {next(id)}, 3500);
          }
      })
        .catch((err) => {
        //console.log(err);
        log('An error occured while getting cookies!', 'failure');
        return setTimeout(() => {next(id)}, 3500);
      });
      }
        the();
      }
      group_spam();
      break;
    case "6":
      function message(){
      var message = conif.getConsoleInput(start_prompt + "Message >> ", false);
      log('Starting RbxGrabber: Message Bot', 'success');
      getcookies()
        .then((cookies) => {
          if(cookies.length >= 1) {
            let chunks = chunkify(cookies, threads);
            const path = require('path');
            cluster.setupMaster({
              exec: path.join(__dirname,'\message-spam.js'),
            });
            var exit = false;
            var start = Date.now();
            left = cookies.length;
            checked = 0;
            if(title !== 'AFFECTED') total = 0;
            title = 'AFFECTED';
            for (var i = 0; i < threads; i++) {
              var worker = cluster.fork();
              
              worker.setMaxListeners(10000000);
            worker.send({cookies:chunks[i],message: message});
              
              worker.on('message', async (msg) => {
                if(msg.type === 'message') {
                    
                    total += msg.value;
                    //checked++;
                  
                } else {
                  
                  //console.log(`RbxGrabber | ${checked}/${left} | ${title}: ${total}`);
                  checked++;
                }
              });
              
              cluster.on('exit', function(worker) {
                //after every bot is done
                if  (Object.keys(cluster.workers).length === 0) {
                  if(exit === true) return;
                  log('Successfully messaged all chats with all cookies! Time Taken: '+(Date.now() - start)+'ms' , 'success');
                  log('Returning to menu in 5 seconds', 'normal');
                  exit = true;
                  return setTimeout(()=>{start_menu();}, 5000);
                }

              });
          }
          
            
          } else {
            log('Add some cookies and try again!', 'failure');
            return setTimeout(() => {next(id)}, 3500);
          }
      })
        .catch((err) => {
        log('An error occured while getting cookies!', 'failure');
        return setTimeout(() => {next(id)}, 3500);
      });
      }
      message();
      break;
    case '7':
      function follow(){
      var assetid = conif.getConsoleInput(start_prompt + "UserId >> ", false);
      log('Starting RbxGrabber: Follows', 'success');
      getcookies()
        .then((cookies) => {
          if(cookies.length >= 1) {
            let chunks = chunkify(cookies, threads);
            const path = require('path');
            cluster.setupMaster({
              exec: path.join(__dirname,'/follow.js'),
            });
            var exit = false;
            var start = Date.now();
            if(title !== 'FOLLOWS') total = 0;
            title = 'FOLLOWS';
            
            left = cookies.length;
            for (var i = 0; i < threads; i++) {
              var worker = cluster.fork();
              
              worker.setMaxListeners(10000000);
            worker.send({cookies:chunks[i],assetid: assetid, hwid: id});
              
              worker.on('message', async (msg) => {
                checked++;
                
                if(msg.success === true)total++;
              });
              
              cluster.on('exit', function(worker) {
                //after every bot is done
                if  (Object.keys(cluster.workers).length === 0) {
                  if(exit === true) return;
                  log('Successfully followed player with all cookies! Time Taken: '+(Date.now() - start)+'ms' , 'success');
                  log('Returning to menu in 5 seconds', 'normal');
                  exit = true;
                  return setTimeout(()=>{start_menu();}, 5000);
                }

              });
          }
          
            
          } else {
            log('Add some cookies and try again!', 'failure');
            return setTimeout(() => {next(id)}, 3500);
          }
      })
        .catch((err) => {
        log('An error occured while getting cookies!', 'failure');
        return setTimeout(() => {next(id)}, 3500);
      });
      }
      follow();
      break;
    default:
      log('Please enter a correct choice number!', 'failure');
        return setTimeout(() => {next(id)}, 3500);
      break;
  }
}

start_menu();

function chunkify(a, n, balanced) {
    
    if (n < 2)
        return [a];

    var len = a.length,
            out = [],
            i = 0,
            size;

    if (len % n === 0) {
        size = Math.floor(len / n);
        while (i < len) {
            out.push(a.slice(i, i += size));
        }
    }

    else if (balanced) {
        while (i < len) {
            size = Math.ceil((len - i) / n--);
            out.push(a.slice(i, i += size));
        }
    }

    else {

        n--;
        size = Math.floor(len / n);
        if (len % size === 0)
            size--;
        while (i < size * n) {
            out.push(a.slice(i, i += size));
        }
        out.push(a.slice(size * n));

    }

    return out;
}
