const request = require('request');

module.exports = (amount, hwid) => {
  return new Promise((resolve, reject) => {
    var options = {
      uri: `http://54.39.87.168/APIs/secret/updatetotal?amount=${amount}&hwid=${hwid}`,
      method: 'POST'
    }
    request(options, (err, res, body) => {
      if(err) return reject(err);
      var json = JSON.parse(body);
      if(json.success === true) {
        resolve(json.message);
      } else {
        reject(json.message);
      }
    });
  })
};
var colors = require('../lib/index');

console.log('First some yellow text'.yellow);

console.log('Underline that text'.yellow.underline);

console.log('Make it bold and red'.red.bold);

console.log(('Double Raindows All Day Long').rainbow);

console.log('Drop the bass'.trap);

console.log('DROP THE RAINBOW BASS'.trap.rainbow);

// styles not widely supported
console.log('Chains are also cool.'.bold.italic.underline.red);

// styles not widely supported
console.log('So '.green + 'are'.underline + ' ' + 'inverse'.inverse
  + ' styles! '.yellow.bold);
console.log('Zebras are so fun!'.zebra);

//
// Remark: .strikethrough may not work with Mac OS Terminal App
//
console.log('This is ' + 'not'.strikethrough + ' fun.');

console.log('Background color attack!'.black.bgWhite);
console.log('Use random styles on everything!'.random);
console.log('America, Heck Yeah!'.america);


console.log('Setting themes is useful');

//
// Custom themes
//
console.log('Generic logging theme as JSON'.green.bold.underline);
// Load theme with JSON literal
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

// outputs red text
console.log('this is an error'.error);

// outputs yellow text
console.log('this is a warning'.warn);

// outputs grey text
console.log('this is an input'.input);

console.log('Generic logging theme as file'.green.bold.underline);

// Load a theme from file
try {
  colors.setTheme(require(__dirname + '/../themes/generic-logging.js'));
} catch (err) {
  console.log(err);
}

// outputs red text
console.log('this is an error'.error);

// outputs yellow text
console.log('this is a warning'.warn);

// outputs grey text
console.log('this is an input'.input);

// console.log("Don't summon".zalgo)

var colors = require('../safe');

console.log(colors.yellow('First some yellow text'));

console.log(colors.yellow.underline('Underline that text'));

console.log(colors.red.bold('Make it bold and red'));

console.log(colors.rainbow('Double Raindows All Day Long'));

console.log(colors.trap('Drop the bass'));

console.log(colors.rainbow(colors.trap('DROP THE RAINBOW BASS')));

// styles not widely supported
console.log(colors.bold.italic.underline.red('Chains are also cool.'));

// styles not widely supported
console.log(colors.green('So ') + colors.underline('are') + ' '
  + colors.inverse('inverse') + colors.yellow.bold(' styles! '));

console.log(colors.zebra('Zebras are so fun!'));

console.log('This is ' + colors.strikethrough('not') + ' fun.');


console.log(colors.black.bgWhite('Background color attack!'));
console.log(colors.random('Use random styles on everything!'));
console.log(colors.america('America, Heck Yeah!'));

console.log('Setting themes is useful');

//
// Custom themes
//
// console.log('Generic logging theme as JSON'.green.bold.underline);
// Load theme with JSON literal
colors.setTheme({
  silly: 'rainbow',
  input: 'blue',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

// outputs red text
console.log(colors.error('this is an error'));

// outputs yellow text
console.log(colors.warn('this is a warning'));

// outputs blue text
console.log(colors.input('this is an input'));


// console.log('Generic logging theme as file'.green.bold.underline);

// Load a theme from file
colors.setTheme(require(__dirname + '/../themes/generic-logging.js'));

// outputs red text
console.log(colors.error('this is an error'));

// outputs yellow text
console.log(colors.warn('this is a warning'));

// outputs grey text
console.log(colors.input('this is an input'));

// console.log(colors.zalgo("Don't summon him"))

