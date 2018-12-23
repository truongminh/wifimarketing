// rollup.config.js

import { format } from 'date-fns';
import * as meta from "./package.json";

// rollup plugins
import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';
import string from 'rollup-plugin-string';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';


const d = new Date();
const buildInfo = format(d, 'yyyyMMdd');
const copyright = `// ${meta.name} v${meta.version}-${buildInfo} Copyright ${d.getFullYear()} ${meta.author.name}`;
const production = !process.env.ROLLUP_WATCH;

export default [
    {
        input: "./src/index.ts",
        plugins: [
            resolve(),
            postcss({
                extensions: ['.css'],
                plugins: [
                    simplevars(),
                    nested(),
                    cssnext(),
                    cssnano()
                ]
            }),
            typescript(),
            string({
                include: 'src/**/*.html',
            }),
            !production && serve({ contentBase: '', port: 8080 }),
            !production && livereload({ watch: '', port: 20080 }),
            production && uglify() // minify, but only in production
        ],
        watch: {
            include: 'src/**/*',
            clearScreen: true
        },
        output: {
            banner: copyright,
            file: "dist/design.js",
            format: "iife",
            sourcemap: true
        }
    }
];
