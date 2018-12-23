// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { format } from 'date-fns';
import * as meta from "./package.json";

const d = new Date();
const buildInfo = format(d, 'yyyyMMdd');
const copyright = `// ${meta.name} v${meta.version}-${buildInfo} Copyright ${d.getFullYear()} ${meta.author.name}`;
const production = !process.env.ROLLUP_WATCH;

export default [
    {
        input: "./src/index.ts",
        plugins: [
            typescript(),
            !production && serve({ contentBase: '', port: 8081 }),
            !production && livereload({ watch: '', port: 20081 }),
            production && uglify() // minify, but only in production
        ],
        output: {
            banner: copyright,
            file: "dist/guest.js",
            format: "iife",
            sourcemap: true
        }
    }
];
