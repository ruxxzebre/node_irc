const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function asyncQuestion(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (line) => {
      resolve(line);
    });
  });
}

module.exports.rl = rl;
module.exports.asyncQuestion = asyncQuestion;
