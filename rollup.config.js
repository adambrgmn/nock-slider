import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const isProd = process.env.BUNDLE_PROD;
const isEsbundle = process.env.BUNDLE_ES;

const name = 'nockSlider';
let output;

if (isProd) {
  console.log('Creating production UMD bundle...');
  output = { file: `dist/${pkg.name}.min.js`, format: 'umd', name };
} else if (isEsbundle) {
  console.log('Creating ES modules bundle...');
  output = { file: `dist/${pkg.name}.es.js`, format: 'es', name };
} else {
  console.log('Creating development UMD bundle...');
  output = { file: `dist/${pkg.name}.js`, format: 'umd', name };
}

const browsers = isProd
  ? ['> 1%', 'last 2 versions', 'Firefox ESR']
  : [
      'Chrome >= 60',
      'Safari >= 10.1',
      'iOS >= 10.3',
      'Firefox >= 54',
      'Edge >= 15',
    ];

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
    presets: [['env', { modules: false, targets: { browsers } }]],
    plugins: [
      'external-helpers',
      [
        'transform-runtime',
        {
          helpers: false,
          polyfill: false,
          regenerator: true,
        },
      ],
    ],
  }),
];

if (isProd) plugins.push(uglify());

export default {
  input: 'src/index.js',
  output,
  plugins,
  external: isEsbundle ? Object.keys(pkg.dependencies) : [],
};
