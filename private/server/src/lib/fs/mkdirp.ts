/* tslint:disable */

import * as Fs from 'fs';
import * as Path from 'path';
const _0777 = parseInt('0777', 8);

export default mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP(p: any, opts?: any, f?: any, made?: any) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }

    let mode = opts.mode;
    const xfs = opts.fs || Fs;

    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) { made = null; }

    const cb = f || function() { };
    p = Path.resolve(p);

    xfs.mkdir(p, mode, function(er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(Path.dirname(p), opts, function(er, made) {
                    if (er) { cb(er, made); }
                    else { mkdirP(p, opts, cb, made); }
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function(er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) { cb(er, made); }
                    else { cb(null, made); }
                });
                break;
        }
    });
}

mkdirP.sync = function sync(p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }

    let mode = opts.mode;
    const xfs = opts.fs || Fs;

    if (mode === undefined) {
        mode = _0777 & (~process.umask());
    }
    if (!made) { made = null; }

    p = Path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT':
                made = sync(Path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                let stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) { throw err0; }
                break;
        }
    }

    return made;
};
