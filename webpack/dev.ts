import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import commonConfig from './common';

export default (merge as any)(commonConfig, {
  entry: './src/index.tsx',
  devServer: {
    hot: true,
    host: '127.0.0.1',
    port: 8090,
    historyApiFallback: true,
  },
  output: {
    publicPath: '/',
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new webpack.EnvironmentPlugin(['NODE_ENV', 'ROOT_URL']),
  ],
});
