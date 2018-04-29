
function parseResponse<T>(request: XMLHttpRequest): T | undefined {
    let result: T | undefined;
    if (request.responseText && typeof request.responseText === 'string') {
        try {
            result = JSON.parse(request.responseText);
        } catch (error) {
            console.error(error);
        }
    }
    return result;
}

export interface IBasicRequestOptions {
    url: string;
    method: string;
    headers?: { [name: string]: string };
    data?: any;
}

export function makeRequest<T>(options: IBasicRequestOptions): Promise<T> {
    const xmlHttp = new XMLHttpRequest();
    const promise = new Promise<T>((resolve, reject) => {
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState === 4) {
                const result = parseResponse<T>(xmlHttp);
                if (xmlHttp.status >= 200 && xmlHttp.status < 300) {
                    resolve(result);
                } else if (xmlHttp.status >= 400) {
                    reject({
                        status: xmlHttp.status,
                        result: result
                    });
                }
            }
        };
    });

    xmlHttp.open(options.method, options.url, true);

    if (options.headers) {
        for (const header in options.headers) {
            xmlHttp.setRequestHeader(header, options.headers[header]);
        }
    }
    xmlHttp.send(options.data || null);
    return promise;
}

export interface IGetRequestOptions {
    url: string;
    token: string;
}

export function get<T>(options: IGetRequestOptions): Promise<T> {
    const headers = { 'Authorization': `jwt ${options.token}` };
    return makeRequest<T>({ url: options.url, method: 'GET', headers });
}

export function remove<T>(options: IGetRequestOptions): Promise<T> {
    const headers = { 'Authorization': `jwt ${options.token}` };
    return makeRequest<T>({ url: options.url, method: 'DELETE', headers });
}

export interface IPutRequestOptions {
    data: any;
    url: string;
    token: string;
}

export function put<T>(options: IPutRequestOptions): Promise<T> {
    const headers = {
        'Authorization': `jwt ${options.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const data = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
    return makeRequest<T>({ url: options.url, method: 'PUT', headers, data });
}

export interface IPostRequestOptions {
    data: any;
    url: string;
    token?: string;
}

export function post<T>(options: IPostRequestOptions): Promise<T> {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    if (options.token) {
        headers['Authorization'] = `jwt ${options.token}`;
    }
    const data = typeof options.data === 'string' ? options.data : JSON.stringify(options.data);
    return makeRequest<T>({ url: options.url, method: 'POST', headers, data });
}