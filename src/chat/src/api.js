const axios = require('axios');
const { rl, asyncQuestion } = require('./rl');

const { API_URL } = process.env;

function authUser() {
  return new Promise((resolve) => {
    rl.question('1. Login\n2. Sign Up\n', async (line) => {
      if (line === '1') {
        const login = await asyncQuestion('Login: ');
        // const password = await asyncQuestion('Password: ');
        let response;
        const url = `${API_URL}/authenticate?username=${login}`;
        try {
          response = await axios.get(url);
        } catch {
          console.log('Connection failed...');
          process.exit(1);
        }
        if (response.data === 'OK') resolve(true);
        else resolve(false);
      }
    });
  });
}

module.exports.authUser = authUser;
