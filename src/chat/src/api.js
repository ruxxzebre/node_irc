const axios = require('axios');
const rl = require('./rl');
const { asyncQuestion } = require('./rl');

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
          // strange bug, just eternal waiting, no errors, nothing
          response = await axios.get(url);
        } catch {
          console.log('Connection failed...');
          process.exit(1);
        }
        if (response.data) resolve(response.data);
        else resolve(false);
      }
    });
  });
}

module.exports.authUser = authUser;
