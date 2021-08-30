import os
import requests
import re
from datetime import datetime
import json

logfile = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), \"file.log\"),'r')
Lines = logfile.readlines()

batch = count = 0
url = \"$1services/collector/event\"
token=\"$2\"
headers = {\"Authorization\": \"Splunk \"+token}
sourcetype = \"$3\"
eventBatch = \"\"
workflowID=\"$5\"
source=\"$4\"
host=\"$HOSTNAME\"

for line in Lines:
    count+=1
    timestamp = re.search(\"\d{4}-\d{2}-\d{2}T\d+:\d+:\d+.\d+Z\",line.strip())
    timestamp = re.sub(\"\dZ\",\"\",timestamp.group())
    timestamp = datetime.strptime(timestamp,\"%Y-%m-%dT%H:%M:%S.%f\")
    timestamp = (timestamp - datetime(1970,1,1)).total_seconds()
    x = re.sub(\"\d{4}-\d{2}-\d{2}T\d+:\d+:\d+.\d+Z\",\"\",line.strip())
    x=x.strip()
    fields = {'lineNumber':count,'workflowID':workflowID}
    if x:
        batch+=1
        event={'event':x,'sourcetype':sourcetype,'source':source,'host':host,'time':timestamp,'fields':fields}
        eventBatch=eventBatch+json.dumps(event)
    else:
        print(\"skipped line \"+str(count))

    if batch>=1000:
        batch=0
        x=requests.post(url, data=eventBatch, headers=headers)
        eventBatch=\"\"

x=requests.post(url, data=eventBatch, headers=headers)
