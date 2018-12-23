import { GetQuery } from "@src/core/qs";
import { Context } from "@src/core";

interface IGlobalState {
    content_id: string;
}

export class Configuration {
    private qs = GetQuery() as IGlobalState;
    get ContentID() {
        return this.qs.content_id;
    }

    Reload() {
        const str = Object.keys(this.qs).map(k => `${k}=${this.qs[k]}`).join('&');
        const url = `/?${str}`;
        location.assign(url);
    }

    SetContentID(id: string) {
        this.qs.content_id = id;
    }

    Exit() {
        // this.SetContentID('');
        // this.Reload();
    }

    get BaseURL() {
        return 'http://localhost:3001/';
    }
}

const configurationSymbol = Symbol('configuration');
export function SetConfiguration(ctx: Context, service: Configuration) {
    ctx[configurationSymbol] = service;
}

export function GetConfiguration(ctx: Context) {
    return ctx[configurationSymbol] as Configuration;
}
