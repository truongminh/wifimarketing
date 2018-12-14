
function ParseQueryString(str: string) {
    const params = {};
    str.split('&').forEach(s => {
        const index = s.indexOf('=');
        if (index === -1) {
            return;
        }
        const key = s.substr(0, index);
        const value = s.substr(index + 1);
        params[key] = value;
    });
    return params;
}

export function GetQuery() {
    const s = location.search.substr(1);
    return ParseQueryString(s);
}
