
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type Body = string | FormData;

function Fetch(method: Method, url: string, body?: Body) {
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open(method, url, true);
        xhr.onreadystatechange = (ev) => {
            if (xhr.readyState === xhr.DONE) {
                resolve(xhr.responseText);
            }
        }
        xhr.onerror = reject;
        xhr.send(body);
    });
}

function FetchJson<T>(method: Method, url: string, body?: Body): Promise<T> {
    return Fetch(method, url, body).then(text => {
        if (text.startsWith('{')) {
            return JSON.parse(text);
        }
        return text;
    }, (e: Error) => {
        console.log(e);
        throw new Error(`http error ${e.message}`);
    });
}

const ErrNetwork = new Error('network');

function Upload<T>(
    url: string,
    form: FormData,
    onprogress: (loaded: number, total: number) => void
) {
    return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', url, true);
        xhr.onloadend = (e) => {
            if (xhr.status === 0) {
                reject(ErrNetwork);
                return;
            }
            resolve(xhr.responseText);
        }
        if (onprogress) {
            xhr.onprogress = (ev) => {
                onprogress(ev.loaded, ev.total);
            }
        }
        xhr.onabort = xhr.onerror = reject;
        xhr.send(form);
    });
}

export class HttpApi {
    constructor(
        protected baseUrl: string
    ) { }

    Get<T>(uri: string) {
        const url = `${this.baseUrl}${uri}`;
        return FetchJson<T>('GET', url);
    }

    Post<T, Q>(uri: string, data: Q) {
        const url = `${this.baseUrl}${uri}`;
        const body = JSON.stringify(data);
        return FetchJson<T>('POST', url, body);
    }

    static Upload = Upload;
}
