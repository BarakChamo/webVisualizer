var webpack           = require('webpack'),
    path              = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
    {
        // Compiler ID
        name: 'desktop',
        
        // Production devtools
        devtool: 'source-map',

        // Define entry points
        entry: {
            // App entry point
            app: [
                // Main app
                path.resolve(__dirname, 'app', 'index.js')
            ],

            // Common vendor packages
            vendor: [
                'underscore',
            ]
        },
        
        // Set modules output
        output: {
            path: path.resolve(__dirname, 'public', 'dist'),
            publicPath: '/dist/',
            filename: 'bundle.js'
        },
        
        // Define module loaders
        module: {
            loaders: [
                {   // Worker Loader
                    test: /\.w\.jsx?$/, 
                    exclude: /(node_modules|bower_components)/, 
                    loader: 'webworker!babel?optional[]=runtime&stage=0'
                },

                {   // ES6 Loader
                    test: /\.jsx?$/, 
                    exclude: /(node_modules|bower_components)/, 
                    loader: 'babel?optional[]=runtime'
                },

                {   // JADE Loader
                    test: /\.jade$/, 
                    loader: 'jade'
                },

                {   // CSS Loader
                    test: /\.css$/,  
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader") 
                },
                
                {   // LESS Loader
                    test: /\.less$/, 
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
                },

                {   // SASS Loader
                    test: /\.scss$/, 
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
                }
            ]
        },

        // Setting up resolution
        resolve: {
            modulesDirectories: [
                'node_modules', 
                'resources' ,
                'app'
            ],
            extensions: ['', '.js', '.jsx']
        },

        // Set up plugins
        plugins: [            
            // Define module globals
            new webpack.ProvidePlugin({
                '_': 'underscore'
            }),

            // Deduplication
            new webpack.optimize.DedupePlugin(),


            // Chunk out vendor code
            new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),

            // Extract CSS files
            new ExtractTextPlugin("styles.css"),
        ]
    }
];