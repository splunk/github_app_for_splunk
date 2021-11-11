# Sending GitHub Enterprise Server Logs to Splunk

GitHub Enterprise Server comes with syslog-ng built in to send data to platforms like Splunk: https://docs.github.com/en/enterprise-server@3.3/admin/user-management/monitoring-activity-in-your-enterprise/log-forwarding. Following those directions will allow you to easily onboard logs to Splunk. However, The GitHub App for Splunk comes with enhancements for those logs that will allow you to search more efficently.

## Sources and Transformations

 The syslog feed from GitHub Enterprise Server contains ALL application logs including audit logs, web server logs, database logs, etc. Being able to differentiate the logs is critical. This app includes the ability to overwrite the source of events with the log type out of the box. However, for this to happen, you must use the sourcetype of `GithubEnterpriseServerLog` or duplicate that stanza from the default `props.conf` file into a custom stanza in your local copy. When setting up a TCP input you have the ability to force that specific sourcetype. This will enable easy filtering of log files to their specific process.

## Default `props.conf`

```
[GithubEnterpriseServerLog]
DATETIME_CONFIG =
LINE_BREAKER = ([\r\n]+)
NO_BINARY_CHECK = true
category = Application
pulldown_type = true
TIME_FORMAT =
TZ =
EXTRACT-audit_event = github_audit\[\d+\]\:\s(?<audit_event>.*)
EXTRACT-audit_fields = \"(?<_KEY_1>.*?)\"\:\"*(?<_VAL_1>.*?)\"*,
EXTRACT-github_log_type = \d+\:\d+\:\d+\s\d+\-\d+\-\d+\-\d+\s(?<github_log_type>.*?)\:
EXTRACT-github_document_id = \"_document_id\"\:\"(?<document_id>.*?)\"
FIELDALIAS-source = github_log_type AS source
```
