
export interface IPasswordRepo {
    Hash(raw: string): Promise<string>;
    Compare(raw: string, encrypted: string): Promise<boolean>;
}

import * as Bcrypt from 'bcrypt';

export class PasswordRepoBcrypt {
    public Hash(password: string): Promise<string> {
        const round = 10;
        return Bcrypt.hash(password, round);
    }

    public Compare(data: string, encrypted: string): Promise<boolean> {
        return Bcrypt.compare(data, encrypted);
    }
}
