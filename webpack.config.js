module.exports = {
  context: __dirname,
  devtool: "source-map",
  entry: "./js/app.js",
  output: {
    path: __dirname + "/dist",
    publicPath: 'dist/',
    filename: "bundle.js"
  },
  module:{
    rules: [ 
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    },
    {
     test : /\.css$/,
     use: [
     "style-loader",
      { loader: "css-loader", options: { importLoaders: 1 } },
      "postcss-loader"
     ]
   },
   {
    test: /\.sass$/,
    use: [
    "style-loader",
    { loader: 'css-loader', options: { importLoaders: 1 } },
    "postcss-loader",
    "sass-loader?indentedSyntax=true"
    ]
  },
   {
    test: /\.vue$/,
    use: {
      loader: 'vue-loader'
    }
  },
  {
    test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
    loader: 'url-loader'
  }
  ]
},
devServer: {
  historyApiFallback: true,
  noInfo: true,
  stats: 'errors-only'
}
}
