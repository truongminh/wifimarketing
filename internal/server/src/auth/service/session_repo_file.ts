import * as Fs from '@lib/fs';
import { ISessionOrg, ISessionRepo, ISessionUser } from './auth_model';

export class SessionRepoFile implements ISessionRepo {
    private sessions = {};

    constructor(
        private file: string,
    ) {
        if (!file) {
            throw new Error('missing session file');
        }
        this.load();
    }

    public async Create(org: ISessionOrg, user: ISessionUser): Promise<string> {
        const valid = true;
        const id = Math.random().toString(36).substr(3, 6);
        const session = { id, org, user, valid };
        this.sessions[id] = session;
        await this.save();
        return id;
    }

    public async Read(id: string) {
        return this.sessions[id];
    }

    public async Invalidate(id: string) {
        const session = this.sessions[id];
        if (session) {
            session.valid = false;
        }
        await this.save();
        return 1;
    }
    private async load() {
        try {
            const data = await Fs.Read(this.file);
            if (data) {
                this.sessions = JSON.parse(data.toString());
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                return;
            }
            console.log(`load session file ${this.file} failed`, err);
        }
    }

    private async save() {
        try {
            const data = JSON.stringify(this.sessions, null, 2);
            await Fs.Write(this.file, data);
        } catch (err) {
            console.log(`save session file ${this.file} failed`, err);
        }
    }
}
