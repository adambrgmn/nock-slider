import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const isProd = process.env.BUNDLE_PROD;
const isEsbundle = process.env.BUNDLE_ES;

const name = 'SimpleSlider';
let output;

if (isProd) {
  console.log('Creating production UMD bundle...');
  output = { file: 'dist/simple-slider.min.js', format: 'umd', name };
} else if (isEsbundle) {
  console.log('Creating ES modules bundle...');
  output = { file: 'dist/simple-slider.es.js', format: 'es', name };
}

const plugins = [
  commonjs({
    ignoreGlobal: true,
  }),
  nodeResolve(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      isProd ? 'production' : 'development',
    ),
  }),
  babel({
    babelrc: false,
    presets: [
      [
        'env',
        {
          modules: false,
          targets: { browsers: isProd ? 'last 2 versions' : 'defaults' },
        },
      ],
    ],
    plugins: ['external-helpers'],
  }),
];

if (isProd) plugins.push(uglify());

export default {
  input: 'src/index.js',
  output,
  plugins,
  external: isEsbundle ? Object.keys(pkg.dependencies) : [],
};
