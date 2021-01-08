function completer(line) {
  const completions = '.help .error .exit .quit .q'.split(' ');
  const hits = completions.filter((c) => c.startsWith(line));
  // Show all completions if none found
  return [hits.length ? hits : null, line];
}

function checkCompletions(line) {
  const exit = () => {
    console.log('Goodbye...');
    process.exit(0);
  };
  switch (line) {
    case ('.help'): console.log('Help Message'); break;
    case ('.error'): console.log('Error Message'); break;
    case ('.exit'): exit(); break;
    case ('.quit'): exit(); break;
    case ('.q'): exit(); break;
    default: console.log('Nice');
  }
}

module.exports.completer = completer;
module.exports.checkCompletions = checkCompletions;
