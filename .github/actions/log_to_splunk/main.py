import os
import requests
import json

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

    url = "{url}/repos/{repo}/actions/runs/{run_id}/jobs".format(url=GITHUB_API_URL,repo=GITHUB_REPOSITORY,run_id=GITHUB_RUN_ID)

    try:
        x = requests.get(url, auth=('username',GITHUB_TOKEN))

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

    response = json.loads(x.text)

    print(response)

if __name__ == '__main__':
    main()
