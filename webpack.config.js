/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
var path = require('path');
module.exports = {
  mode: 'production',
  entry: './src/Index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    // LA LINEA DE AQUI ABAJO ES LA MAS IMPORTANTE!
    // :mindblow: Perdí mas de 2 dias hasta darme cuenta que esta es la linea mas importante de toda esta guia.
    libraryTarget: 'commonjs2',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'] // Añadir extensiones que Webpack resolverá
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          }
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  externals: {
    'react': 'commonjs react'
  }
};
