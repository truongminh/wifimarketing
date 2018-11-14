
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

export function Read(file: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        Fs.readFile(file, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

export function Write(file: string, data) {
    return new Promise((resolve, reject) => {
        Fs.writeFile(file, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
