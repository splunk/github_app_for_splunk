import os
import requests
import json
import zipfile
import io
import glob
import re
from datetime import datetime

def main():

    GITHUB_REF=os.environ["GITHUB_REF"]
    GITHUB_REPOSITORY=os.environ["GITHUB_REPOSITORY"]
    GITHUB_RUN_ID=os.environ["GITHUB_RUN_ID"]
    GITHUB_API_URL=os.environ["GITHUB_API_URL"]
    GITHUB_WORKFLOWID=os.environ["INPUT_WORKFLOWID"]
    GITHUB_TOKEN = os.environ.get("INPUT_GITHUB-TOKEN")

    SPLUNK_HEC_URL=os.environ["INPUT_SPLUNK-URL"]+"services/collector/event"
    SPLUNK_HEC_TOKEN=os.environ["INPUT_HEC-TOKEN"]
    SPLUNK_SOURCE=os.environ["INPUT_SOURCE"]
    SPLUNK_SOURCETYPE=os.environ["INPUT_SOURCETYPE"]

    batch = count = 0
    eventBatch = ""
    headers = {"Authorization": "Splunk "+SPLUNK_HEC_TOKEN}
    host="$HOSTNAME"

    url = "{url}/repos/{repo}/actions/runs/{run_id}/logs".format(url=GITHUB_API_URL,repo=GITHUB_REPOSITORY,run_id=GITHUB_WORKFLOWID)
    print(url)

    try:
        x = requests.get(url, stream=True, auth=('token',GITHUB_TOKEN))

    except requests.exceptions.HTTPError as errh:
        output = "GITHUB API Http Error:" + str(errh)
        print(f"Error: {output}")
        print(f"::set-output name=result::{output}")
        return
    except requests.exceptions.ConnectionError as errc:
        output = "GITHUB API Error Connecting:" + str(errc)
        print(f"Error: {output}")
        print(f"::set-output name=result::{output}")
        return
    except requests.exceptions.Timeout as errt:
        output = "Timeout Error:" + str(errt)
        print(f"Error: {output}")
        print(f"::set-output name=result::{output}")
        return
    except requests.exceptions.RequestException as err:
        output = "GITHUB API Non catched error conecting:" + str(err)
        print(f"Error: {output}")
        print(f"::set-output name=result::{output}")
        return

    print(x.headers)
    print(x.status_code)

    z = zipfile.ZipFile(io.BytesIO(x.content))
    z.extractall('/app')

    batch = count = 0
    headers = {"Authorization": "Splunk "+SPLUNK_HEC_TOKEN}

    for name in glob.glob('/app/*.txt'):
        logfile = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), name.replace('./','')),'r')
        Lines = logfile.readlines()
        for line in Lines:
            if line:
                count+=1
                timestamp = re.search("\d{4}-\d{2}-\d{2}T\d+:\d+:\d+.\d+Z",line.strip())
                timestamp = re.sub("\dZ","",timestamp.group())
                timestamp = datetime.strptime(timestamp,"%Y-%m-%dT%H:%M:%S.%f")
                timestamp = (timestamp - datetime(1970,1,1)).total_seconds()
                x = re.sub("\d{4}-\d{2}-\d{2}T\d+:\d+:\d+.\d+Z","",line.strip())
                x=x.strip()
                fields = {'lineNumber':count,'workflowID':GITHUB_WORKFLOWID}
                if x:
                    batch+=1
                    event={'event':x,'sourcetype':SPLUNK_SOURCETYPE,'source':SPLUNK_SOURCE,'host':host,'time':timestamp,'fields':fields}
                    eventBatch=eventBatch+json.dumps(event)
                else:
                    print("skipped line "+str(count))

                if batch>=1000:
                    batch=0
                    x=requests.post(SPLUNK_HEC_URL, data=eventBatch, headers=headers)
                    eventBatch=""

        x=requests.post(SPLUNK_HEC_URL, data=eventBatch, headers=headers)

if __name__ == '__main__':
    main()
