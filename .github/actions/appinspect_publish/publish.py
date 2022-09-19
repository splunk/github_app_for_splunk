import os
import requests
from requests.auth import HTTPBasicAuth

APP_ID= os.environ['INPUT_APP_ID']
filepath = os.environ['INPUT_APP_FILE']
SPLUNK_USERNAME = os.environ['INPUT_SPLUNK_USERNAME']
SPLUNK_PASSWORD = os.environ['INPUT_SPLUNK_PASSWORD']
SPLUNK_VERSION = os.environ['INPUT_SPLUNK_VERSION']
VISIBILITY = os.environ['INPUT_VISIBILITY']
CIM_VERSIONS = os.environ['INPUT_CIM_VERSIONS']

api_path = 'https://splunkbase.splunk.com/api/v1/app/{}/new_release'.format(APP_ID)

auth = HTTPBasicAuth(SPLUNK_USERNAME, SPLUNK_PASSWORD)

files = {
    'files[]': open(filepath, 'rb'),
    'filename': (None, os.path.basename(filepath)),
    'splunk_versions': (None, SPLUNK_VERSION),
    'visibility': (None, VISIBILITY),
    'cim_versions': (None, CIM_VERSIONS)
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
