import { info } from '@actions/core';
import FormData from 'form-data';
import * as fs from 'fs';
import fetch from 'node-fetch';

async function req<T>({
    url,
    method,
    body,
    headers,
}: {
    method: 'GET' | 'POST';
    url: string;
    headers?: { [k: string]: string };
    body?: any;
}): Promise<T> {
    const res = await fetch(url, {
        method,
        body,
        headers,
    });
    if (!res.ok) {
        try {
            const data = await res.text();
            throw new Error(`HTTP status ${res.status} from ${url}: ${data}`);
        } catch (e) {
            // ignore
        }
        throw new Error(`HTTP status ${res.status} from ${url}`);
    }
    return res.json();
}

export interface AuthResponse {
    data: {
        token: string;
    };
}

export async function login(user: string, password: string): Promise<string> {
    info(`Logging in user ${user}`);
    const basicAuth = Buffer.from(`${user}:${password}`, 'utf-8').toString('base64');
    const auth: AuthResponse = await req({
        method: 'GET',
        url: 'https://api.splunk.com/2.0/rest/login/splunk',
        headers: {
            Authorization: `Basic ${basicAuth}`,
        },
    });
    return auth.data.token;
}

export interface SubmitResponse {
    request_id: string;
    message: string;
}

export async function submit({
    filePath,
    includedTags,
    excludedTags,
    token,
}: {
    filePath: string;
    token: string;
    includedTags?: string[];
    excludedTags?: string[];
}): Promise<SubmitResponse> {
    const form = new FormData();
    form.append('app_package', fs.createReadStream(filePath));
    if (includedTags) {
        form.append('included_tags', includedTags.join(','));
    }
    if (excludedTags) {
        form.append('excluded_tags', excludedTags.join(','));
    }
    return await req({
        method: 'POST',
        url: 'https://appinspect.splunk.com/v1/app/validate',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: form,
    });
}

export interface StatusResponse {
    status: 'SUCCESS' | 'PROCESSING';
    info: {
        error: number;
        failure: number;
        skipped: number;
        manual_check: number;
        not_applicable: number;
        warning: number;
        success: number;
    };
}

export async function getStatus(data: { request_id: string; token: string }): Promise<StatusResponse> {
    return req({
        method: 'GET',
        url: `https://appinspect.splunk.com/v1/app/validate/status/${encodeURIComponent(data.request_id)}`,
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
    });
}

export interface Message {
    code: string;
    filename: string;
    line: number;
    message: string;
    result: string;
    message_filename: string;
    message_line?: number;
}

export interface Check {
    description: string;
    messages: Message[];
    name: string;
    tags: string[];
    result: 'success' | 'not_applicable' | 'manual_check' | 'failure' | 'error' | 'warning';
}

export interface Group {
    checks: Check[];
    description: string;
    name: string;
}

export interface Report {
    app_author: string;
    app_description: string;
    app_hash: string;
    app_name: string;
    app_version: string;
    metrics: {
        start_time: Date;
        end_time: Date;
        execution_time: number;
    };
    run_parameters: {
        api_request_id: string;
        identity: string;
        splunkbase_id: string;
        version?: any;
        splunk_version?: any;
        included_tags: string[];
        package_location: string;
        appinspect_version: string;
        excluded_tags: any[];
    };
    groups: Group[];
    summary: {
        error: number;
        failure: number;
        skipped: number;
        manual_check: number;
        not_applicable: number;
        warning: number;
        success: number;
    };
}

export interface ReportResponse {
    request_id: string;
    cloc: string;
    reports: Report[];
    summary: {
        error: number;
        failure: number;
        skipped: number;
        manual_check: number;
        not_applicable: number;
        warning: number;
        success: number;
    };
    metrics: {
        start_time: Date;
        end_time: Date;
        execution_time: number;
    };
    run_parameters: {
        api_request_id: string;
        identity: string;
        splunkbase_id: string;
        version?: any;
        splunk_version?: any;
        included_tags: string[];
        package_location: string;
        appinspect_version: string;
        excluded_tags: any[];
    };
    links: Array<{
        rel: string;
        href: string;
    }>;
}

export async function getReport(data: { request_id: string; token: string }): Promise<ReportResponse> {
    return req({
        method: 'GET',
        url: `https://appinspect.splunk.com/v1/app/report/${encodeURIComponent(data.request_id)}`,
        headers: {
            Authorization: `Bearer ${data.token}`,
        },
    });
}
