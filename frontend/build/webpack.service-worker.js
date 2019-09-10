const { resolve: resolvePath } = require('path');
const context = resolvePath(`${__dirname}/../`);

module.exports = {
  mode: 'production',
  context,
  entry: {
    main: './src/service-worker.ts',
  },
  target: 'webworker',
  output: {
    path: resolvePath(context, 'dist/assets'),
    filename: 'build.service-worker.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: 'error',
  },
  devtool: false,
};
