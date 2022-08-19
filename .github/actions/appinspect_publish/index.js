const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);

  // Call an API endpoint with the payload
  const response = await fetch('https://splunkbase.splunk.com/api/v1/app/${AppID}/new_release/', {
      method: 'POST',
      body: payload
  });

} catch (error) {
  core.setFailed(error.message);
}