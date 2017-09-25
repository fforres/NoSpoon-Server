import * as debug from 'debug';
if (process.env.__DEV__ === 'true') {
  debug.enable(process.env.DEBUG || ''); // *
  // console.log(debug.useColors()); // true
  require('./websocket');
}
