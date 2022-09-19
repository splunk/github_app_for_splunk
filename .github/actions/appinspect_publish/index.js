const core = require('@actions/core');
const github = require('@actions/github');
//const https = require('https');
const axios = require('axios').default;
const formData = require('form-data');
formData.prototype[Symbol.toStringTag] = 'FormData';
const fs = require('fs');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  //const payload = JSON.stringify(github.context.payload, undefined, 2)
  //console.log(`The event payload: ${payload}`);

  const AppID = '5596'; //core.getInput('AppID');
  const user = 'derkkila@splunk.com'; //core.getInput('User');
  const password = 'chur21Wra'; //core.getInput('Password');
  var auth= 'Basic ' + Buffer.from(user + ':' + password).toString('base64');

  var fd = new formData();

  const file=fs.readFile(process.cwd()+'\\github-app-for-splunk_123.tgz','utf8', function(err, data){
      
    // Display the file content

});

  //console.log(file);
  fd.append('my_buffer', new Buffer.alloc(10));
  fd.append('file', file,'github-app-for-splunk_123.tgz');
  fd.append('filename', 'github-app-for-splunk_123.tgz');
  fd.append('splunk_versions', '8.0,8.1,8.2,9.0');
  fd.append('visibility', 'false');

  // use axios to post a file to a URL
    axios.post('https://apps.splunk.com/rest/v1/app/'+AppID+'/new_release', fd, {
        headers: {
            'Authorization': auth,
            'Content-Type': `multipart/form-data; boundary=${fd._boundary}`,
        }
    })
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });

  
  // Print the response body to the console
  /*
  const options = {
    hostname: 'splunkbase.splunk.com',
    port: 443,
    path: `/api/v1/app/${AppID}/new_release/`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
    },
  };
  
  const req = https.request(options, res => {
    console.log(`URL: ${options.hostname}${options.path}`);
    console.log(`statusCode: ${res.statusCode}`);

    var body = '';

    res.on('data', function (chunk) {
        console.log('Body: '+chunk);
        body = ''+chunk;
    });

    if (res.statusCode != 200) {
        core.setFailed(`statusCode: ${res.statusCode}`);
        //throw `statusCode: ${res.statusCode}`;
    }
  });
  
  req.on('error', error => {
    console.error(error);
  });
  
  req.end();
    */


} catch (error) {
  console.log(error);
  core.setFailed(error.message);
}