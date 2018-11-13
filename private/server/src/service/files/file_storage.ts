import { EnsureDir, Unlink } from '@lib/fs';
import * as Fs from 'fs';
import * as Path from 'path';
import * as Slug from 'slug';
import { IFileStorage } from './file_model';

function slugifyFilename(title: string) {
    let firstPart = title;
    let secondPart = '';
    const dotIndex = title.lastIndexOf('.');
    if (dotIndex >= 0) {
        firstPart = title.substr(0, dotIndex);
        secondPart = title.substr(dotIndex + 1);
        secondPart = `.${Slug(secondPart)}`; // the . here
    }
    firstPart = Slug(firstPart);
    return `${firstPart}${secondPart}`;
}

function twoDigit(d: number) {
    return d < 10 ? `0${d}` : `${d}`;
}

export class FileStorage implements IFileStorage {

    constructor(private dir: string, private MaxFilenameLength = 100) { }

    public async Import(currentFile: string, utf8FileName: string) {
        // filename
        const date = new Date();
        const prefix = [
            date.getHours(), date.getMinutes(), date.getSeconds(),
        ].map(twoDigit).join('');
        const safeFileName = `${prefix}-${this.FormatFilename(utf8FileName)}`;
        // folder
        const destSubDir = [
            date.getFullYear(), date.getMonth() + 1, date.getDate(),
        ].map(twoDigit).join('/');
        await this.EnsureSubDir(destSubDir);
        const dest = Path.posix.join(destSubDir, safeFileName);
        // finalize
        await this.MoveFile(currentFile, dest);
        return { name: safeFileName, path: dest };
    }

    public BaseDir() {
        return this.dir;
    }

    public async MoveFile(src: string, dest: string) {
        const link = Path.join(this.dir, dest);
        return new Promise((resolve, reject) => {
            Fs.copyFile(src, link, (e) => {
                if (e) {
                    reject(e);
                    return;
                }
                resolve(true);
            });
        });
    }

    public async EnsureSubDir(subdir: string) {
        return EnsureDir(this.getFullDir(subdir));
    }

    public FormatFilename(title = '') {
        const limitTitle = title.substr(0, this.MaxFilenameLength);
        const filename = `${slugifyFilename(limitTitle)}`;
        return filename;
    }

    public async Delete(path: string) {
        await Unlink(this.getFullDir(path));
        return 1;
    }

    private getFullDir(subdir: string) {
        return Path.join(this.dir, subdir);
    }
}
