# Github App for Splunk

The Github App for Splunk is a collection of out of the box dashboards and Splunk knowledge objects designed to give Github Admins and platform owners immediate visibility into Github.

This App is designed to work across multiple Github data sources however not all all required. You may choose to only collect a certain set of data and the parts of this app that utilize that set will function, while those that use other data sources will not function correctly, so please only use the Dashboards that relate to the data you are collecting.

The Github App for Splunk is designed to work with the following data sources:

* [Github Audit Log Monitoring Add-On For Splunk](./docs/ghe_audit_logs.md): Audit logs from Github Enterprise Cloud.
* [Github.com Webhooks](./docs/github_webhooks.md): A select set of webhook events like Push, PullRequest, and Repo.
* [Github Enterprise Server Syslog Forwarder](https://docs.github.com/en/enterprise-server/admin/user-management/monitoring-activity-in-your-enterprise/log-forwarding): Audit and Application logs from Github Enterprise Server.
* [Github Enterprise Collectd monitoring](./docs/splunk_collectd_forwarding_for_ghes.md): Performance and Infrastructure metrics from Github Enterprise Server.

## Dashboard Instructions

The Github App for Splunk is available for download from [Splunkbase](https://splunkbase.splunk.com/app/5596/). Once installed there are a couple steps needed to light up all the dashboards.

![Settings>Advanced Search>Search macros](./docs/images/macros.png)

1. The Github App for Splunk uses macros so that index and `sourcetype` names don't need to be updated in each dashboard panel. You'll need to update the macros to account for your selected indexes.
1. The macro `github_source` is the macro for all audit log events, whether from Github Enterprise Cloud or Server. The predefined macro includes examples of **BOTH**. Update to account for your specific needs.
1. The macro `github_webhooks` is the macro used for all webhook events. Since it is assuming a single index for all webhook events, that is the predefined example, but update as needed.
1. Finally, the macro `github_collectd` is the macro used for all `collectd` metrics sent from Github Enterprise Server. Please update accordingly.

### Integration Overview dashboard

There is an *Integration Overview* dashboard listed under *Dashboards* that allows you to monitor API rate limits, audit events fetched, or webhooks received. This dashboard is primarily meant to be used with the `Github Audit Log Monitoring Add-On for Splunk` and uses internal Splunk logs. To be able to view them you will probably need elevated privileges in Splunk that include access to the `_internal` index. Please coordinate with your Splunk team if that dashboard is desired.

### Examples

## Support

Support for Github App for Splunk is run through [Github Issues](https://github.com/splunk/github_app_for_splunk/issues). Please open a new issue for any support issues or for feature requests. You may also open a Pull Request if you'd like to contribute additional dashboards, eventtypes for webhooks, or enhancements you may have.
