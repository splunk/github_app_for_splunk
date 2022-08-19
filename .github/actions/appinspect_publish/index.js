const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);

  // Print the response body to the console
  const options = {
    hostname: 'splunkbase.splunk.com',
    port: 443,
    path: '/api/v1/app/${AppID}/new_release/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
  };
  
  const req = https.request(options, res => {
    console.log(`URL: ${options.hostname}${options.path}`);
    console.log(`statusCode: ${res.statusCode}`);
  
    res.on('data', d => {
      process.stdout.write(d);
    });
  });
  
  req.on('error', error => {
    console.error(error);
  });
  
  req.end();



} catch (error) {
  core.setFailed(error.message);
}