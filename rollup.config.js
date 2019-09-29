import { terser } from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

export default {
    input: 'src/index.js', // our source file
    output: {
        file: pkg.main,
        format: 'cjs',
    },
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
        resolve(),
        commonjs(),
        terser(), // minifies generated bundles
    ],
};
