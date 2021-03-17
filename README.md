#How to run

First, install ffmpeg. Follow this tutorial if need be. https://www.youtube.com/watch?v=r1AtmY-RMyQ

In terminal:

cd upload-demo

yarn install

Edit this line of code in node_modules/react-scripts/config/webpack.config.js at line 647

Change to ``` new webpack.DefinePlugin(Object.assign({}, env.stringified, {'process.env.FLUENTFFMPEG_COV': false})), ```

yarn start
