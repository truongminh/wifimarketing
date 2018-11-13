
import * as Fs from 'fs';
import Mkdirp from './mkdirp';

export function Unlink(path: string) {
    return new Promise((resolve, reject) => {
        Fs.unlink(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function EnsureDir(dir: string) {
    return new Promise((resolve, reject) => {
        Mkdirp(dir, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
