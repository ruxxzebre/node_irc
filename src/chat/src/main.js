const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:3001');
const { resolve } = require('path');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

function completer(line) {
    const completions = '.help .error .exit .quit .q'.split(' ');
    const hits = completions.filter((c) => c.startsWith(line));
    // Show all completions if none found
    return [hits.length ? hits : null, line];
}

function checkConnection() {
    return new Promise(async (resolve, reject) => {
        socket.on('error', (e) => {
            reject([false, `${e.code} ERROR. I'm leaving...`]);
        });
        socket.on('open', (e) => {
            resolve([true, `Connection works!`]);
        });
    });
}

function checkCompletions(line) {
    const exit = () => {
        console.log('Goodbye...'); 
        process.exit(0);
    };
    switch(line) {
        case('.help'): console.log('Help Message'); break;
        case('.error'): console.log('Error Message'); break;
        case('.exit'): exit(); break; 
        case('.quit'): exit(); break;
        case('.q'): exit(); break;
    }
}

async function isAuthenticated() {
    const request = requestModel('isAuthenticated');
    socket.send(request);
    // MAKE authchecking with HTTP
    // think what to move to HTTP protocol

    // const response = await asyncCatchEvent('message');
    // //send request to server
    // return true;
}

function requestModel(action, ...args) {
    const request = { action, data: {} };
    switch (action) {
        case ('login'):
            request.data.login = args[0];
            request.data.password = args[1];
            break;
        case ('anonymousLogin'):
            request.data.anonymousLogin = args[0];
            break;
        case ('signUp'):
            request.data.login = args[0];
            request.data.password = args[1];
            request.data.email = args[2] && null;
            break;
        case ('isAuthenticated'):
            break;
        case ('message'):
            request.data.message = args[0];
            break;
        default:
            throw new Error('Invalid action...');
    }
    return request;
}

function asyncQuestion(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (line) => {
            resolve(line);             
        });
    });
}

function asyncCatchEvent(event) {
    return new Promise((resolve) => {
        socket.on(event, (input) => {
            resolve(input.data);
        });
    });
}

function authUser() {
    return new Promise((res, rej) => {
        rl.question('1. Login\n2. Sign Up\n', async (line) => {
            if (line === '1') {
                const login = await asyncQuestion('Login: ');
                const password = await asyncQuestion('Password: ');
                const credentials = requestModel('login', login, password);
                console.log(credentials);
            }
        });
    });
}

function readInputMessage() {
    checkConnection().then(() => {
        if (!isAuthenticated()) {
            authUser().then((status) => status && readInputMessage());
            return;
        }
        rl.question('YOU: ', (message) => {
            const command = completer(message);
            if (command[0]) checkCompletions(command[1]);
            readInputMessage();
        });
    }).catch(e => !e[0] && process.exit(1));
}

console.log('Welcome, my friend!');
readInputMessage();



// socket.onmessage = (event) => {
//     const message = event.data.split(':'[1]);
//     //console.log(`message: ${event.data}`);
// }