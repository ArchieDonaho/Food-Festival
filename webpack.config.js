const webpack = require("webpack")
const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    app: "./public/assets/js/script.js",
    events: "./public/assets/js/events.js",
    schedule: "./public/assets/js/schedule.js",
    tickets: "./public/assets/js/tickets.js"
  }, // the file being minified / the files and their associated names
  output: {
    // path: path.join(__dirname + "/dist"), // the folder the new minified file will be put in
    // filename: "main.bundle.js" // the name of the new minified file
    filename: '[name].bundle.js', // use the previously used key name to name the output file
    path: __dirname + '/public/dist',
  },
  module: {
    rules: [ // identifies the type of files to pre-process using the test property
      {
        test: /\.jpg$/i, // regex searching for any files ending in .jpg
        use: [ // where we specify the loader being used
          {
            loader: 'file-loader', // name of the loader being used. emits our images
            options: {
              esModule: false, // by default, esmodule syntax is used for js files, but here we dont want to use it
              name (file) { // specifies how the file should be named
                return "[path][name].[ext]"
              },
              publicPath: function(url){ // specifies the output file path
                return url.replace('../', '/public/assets/')
              }
            }
          },
          {
            loader: 'image-webpack-loader' // used to reduce image size
          }
        ]
      }
    ]
  },
  plugins: [
    // plugin to support jquery
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
    // plugin to use our analyzer
  new BundleAnalyzerPlugin({
    analyzerMode: 'static', // the report outputs to an html file in the dist folder
                            // if set to 'disable', it will stop the reporting
  })
  ],
  mode: "development"
};