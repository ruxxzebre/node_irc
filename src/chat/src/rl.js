const readline = require('readline');
const prompt = require('prompt');
const { completer, checkCompletions } = require('./commands');
const { RequestObject } = require('./constructors');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function asyncQuestion(prefix) {
  return new Promise((resolve) => {
    rl.question(prefix, (line) => {
      resolve(line);
    });
  });
}

async function readInputMessage(callback) {
  const question = () => {
    prompt.get('[YOU]', (err, result) => {
      const message = result['[YOU]'];
      const command = completer(message);
      if (command[0]) checkCompletions(command[1]);
      const response = RequestObject('message', { message }, true);
      callback(response);
      question();
    });
  };
  prompt.start();
  question();
}

module.exports = rl;
module.exports.asyncQuestion = asyncQuestion;
module.exports.readInputMessage = readInputMessage;
