import { debug, error, getInput, info, setFailed, warning } from '@actions/core';
import * as fs from 'fs';
import { getReport, getStatus, login, submit, SubmitResponse } from './api';

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

async function appInspect({
    user,
    password,
    filePath,
    includedTags,
    excludedTags,
}: {
    filePath: string;
    user: string;
    password: string;
    includedTags?: string[];
    excludedTags?: string[];
}): Promise<void> {
    info(`Submitting file ${filePath} to appinspect API...`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} does not exist`);
    }
    const token = await login(user, password);

    const submitRes: SubmitResponse = await submit({
        filePath,
        token,
        includedTags,
        excludedTags,
    });

    const reqId = submitRes.request_id;
    info(`Submitted and received reqId=${reqId}`);
    info('Waiting for appinspect job to complete...');
    while (true) {
        await sleep(10_000);
        const status = await getStatus({ request_id: reqId, token });
        debug(`Got status ${status.status}`);
        if (status.status === 'SUCCESS') {
            break;
        } else if (status.status === 'PROCESSING') {
            debug('Appinspect job is still processing');
        } else {
            throw new Error(`Unexpected status ${status.status}`);
        }
    }

    info(`Retrieving report for reqId=${reqId}`);
    const reportDoc = await getReport({ request_id: reqId, token });
    if (reportDoc.reports.length !== 1) {
        warning(`Received ${reportDoc.reports.length} report documents. Expected 1.`);
    }
    const report = reportDoc.reports[0];

    info(`Received report for app: ${report.app_name} ${report.app_version} [${report.app_hash}]`);
    info(
        `Tags: ${report.run_parameters.included_tags.join(
            ','
        )} - excluded: ${report.run_parameters.excluded_tags.join(',')}`
    );

    info(`Summary: ${JSON.stringify(report.summary, null, 2)}`);

    for (const group of report.groups) {
        for (const check of group.checks) {
            switch (check.result) {
                case 'error':
                case 'failure':
                    error(
                        `${check.result.toUpperCase()}: ${check.name}\n${check.description}\n${(
                            check.messages || []
                        )
                            .map((m) => m.message)
                            .join('\n')}\nTags: ${check.tags.join(',')}`
                    );
                    break;
                case 'warning':
                    warning(
                        `Warning: ${check.name}\n${check.description}\n${(check.messages || [])
                            .map((m) => m.message)
                            .join('\n')}\nTags: ${check.tags.join(',')}`
                    );
                    break;
                case 'manual_check':
                    debug(`Check ${check.name} requires a manual check`);
                    break;
                case 'success':
                case 'not_applicable':
                    // ignore
                    break;
                default:
                    throw new Error(`Unexpected check result: ${check.result}`);
            }
        }
    }

    if (report.summary.error === 0 && report.summary.failure === 0) {
        info('Appinspect completed without errors or failures');
    }
}

const splitTags = (value: string | null | undefined): string[] | undefined => {
    if (value) {
        return value.trim().split(/\s*,\s*/);
    }
};

async function run(): Promise<void> {
    try {
        const filePath: string = getInput('filePath');
        const user = getInput('splunkUser');
        const password = getInput('splunkPassword');
        const includedTags = splitTags(getInput('includedTags'));
        const excludedTags = splitTags(getInput('includedTags'));

        await appInspect({ user, password, filePath, includedTags, excludedTags });
    } catch (error) {
        setFailed(error.message);
    }
}

run();
