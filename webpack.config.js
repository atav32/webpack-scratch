const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const WildcardsEntryWebpackPlugin = require('wildcards-entry-webpack-plugin');

const commonRules = [
  {
    test: /\.js$/i,
    use: [{
      loader: 'babel-loader',
      options: { presets: ['env'] },
    }],
    exclude: [/node_modules/],
  },
  {
    test: /\.html$/,
    use: 'html-loader?root=.'
  },
];

const webRules = commonRules.concat(
  {
    test: /\.(sass|scss)$/i,
    use: [ 'style-loader', 'css-loader', 'sass-loader', ]
  }
);

const libConfig = {
  entry: {
    index: ['src/index.js', 'src/optional.js']
  },
  output: {
    filename: '[name].lib.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: commonRules,
  },
  target: 'node',
  externals: [
    nodeExternals()
  ],
};

function concatBundle(entriesFunc, bundles) {
  const entriesCopy = Object.assign({}, entriesFunc());
  for (let entryName in entriesCopy) {
    entriesCopy[entryName] = [].concat(entriesCopy[entryName]).concat(bundles);
  }
  console.log(entriesCopy);
  return entriesCopy;
}

const webConfig = {
  entry: concatBundle(WildcardsEntryWebpackPlugin.entry(path.resolve(__dirname, './clients/**/*.js')), './src/optional.js'),
  output: {
    filename: '[name].web.js',
    path: path.resolve(__dirname, 'build')
  },
  module: {
    rules: webRules
  },
  plugins: [new HtmlWebpackPlugin()]
};

const test = {
  module: {
    rules: webRules
  },
};

module.exports = [
  // libConfig,
  // webConfig,
  test
];
