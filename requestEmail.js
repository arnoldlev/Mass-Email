#Lambda Function to request an email service using REST API
var AWS = require('aws-sdk');
const http = require('https'); // or https 


const defaultOptions = {
    host: '<api link>',
    port: 443, // or 443 for https
    headers: {
        'Content-Type': 'application/json',
    }
}

const post = (path, payload) => new Promise((resolve, reject) => {
    const options = { ...defaultOptions, path: path, method: 'POST' };
    const req = http.request(options, res => {
        let buffer = "";
        res.on('data', chunk => buffer += chunk)
        res.on('end', () => resolve(JSON.parse(buffer)))
    });
    req.on('error', e => reject(e.message));
    req.write(JSON.stringify(payload));
    req.end();
});


exports.handler = async (event, context, callback) => new Promise( async (resolve, reject) => {
    
    const data = { "title": event["title"], "body": event["body"] }
    const token = await post("/dev/sendemails", data );

    return token;
});
