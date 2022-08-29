import os
import requests
from requests.auth import HTTPBasicAuth

APP_ID= os.environ['APP_ID']
filename = os.environ['APP_FILE']
filepath = os.path.join(os.environ['GITHUB_WORKSPACE'], filename)
SPLUNK_USERNAME = os.environ['SPLUNK_USERNAME']
SPLUNK_PASSWORD = os.environ['SPLUNK_PASSWORD']
SPLUNK_VERSION = os.environ['SPLUNK_VERSION']

api_path = 'https://splunkbase.splunk.com/api/v1/app/{}/new_release'.format(APP_ID)

auth = HTTPBasicAuth(SPLUNK_USERNAME, SPLUNK_PASSWORD)

files = {
    'files[]': open(filepath, 'rb'),
    'filename': (None, os.path.basename(filepath)),
    'splunk_version': (None, SPLUNK_VERSION),
    'visibility': (None, 'false'),
    'cim_versions': (None, '')
}

response = requests.post(api_path, files=files, auth=auth)

print(response.status_code)
print(response.text)

# if status code is not 200, print the response text
if response.status_code != 200:    
    response.raise_for_status()
    exit(response.status_code)
else:
    exit(0)

