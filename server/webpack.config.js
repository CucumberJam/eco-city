import path from "path";
import {fileURLToPath} from 'url';
import nodeExternals from 'webpack-node-externals'
import {CleanWebpackPlugin} from 'clean-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default {
    target: 'node',
    entry: './app.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    externals: [nodeExternals()],
    module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                  loader: 'babel-loader',
                  options: {
                      presets: ['@babel/preset-env']
                  }
              }
          }
      ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    devtool: 'source-map'
};