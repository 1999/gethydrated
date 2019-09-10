const { resolve: resolvePath } = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const context = resolvePath(`${__dirname}/../`);

module.exports = {
  mode: 'production',
  context,
  entry: {
    main: './src/index.tsx',
  },
  output: {
    path: resolvePath(context, 'dist/assets'),
    filename: 'build.[name].js',
    publicPath: 'http://localhost:8081/assets/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
  // performance: {
  //   hints: 'error',
  // },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ]
};
