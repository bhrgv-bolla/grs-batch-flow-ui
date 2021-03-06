"use strict";

global.navigator = {userAgent: "all"};

const SSRCaching = require("electrode-react-ssr-caching");

process.on("SIGINT", () => {
  process.exit(0);
});

const config = require("electrode-confippet").config;
const staticPathsDecor = require("electrode-static-paths");
const supports = require("electrode-archetype-react-app/supports");


/**
* Starting Mongo.
*/

var Mongoose = require('mongoose');
//add connection ( For local mongo db for now. Change to repl set later.)
Mongoose.connect('mongodb://localhost:27017/test');
//('mongodb://mongodb-replica-set-98399705-1-167418681.dev.mongodb.rbscm.dev.cloud.wal-mart.com:27017,mongodb-replica-set-98399705-3-167418687.dev.mongodb.rbscm.dev.cloud.wal-mart.com:27017,mongodb-replica-set-98399705-2-167418684.dev.mongodb.rbscm.dev.cloud.wal-mart.com:27017/test');



require.extensions[".css"] = () => {
  return;
};

/**
 * Use babel register to transpile any JSX code on the fly to run
 * in server mode, and also transpile react code to apply process.env.NODE_ENV
 * removal to improve performance in production mode.
 */
supports.babelRegister({
  ignore: /node_modules\/(?!react\/)/
});

const cacheConfig = {
  components: {
    SSRCachingTemplateType: {
      strategy: "template",
      enable: true
    },
    SSRCachingSimpleType: {
      strategy: "simple",
      enable: true
    }
  }
};

SSRCaching.enableCaching();
SSRCaching.setCachingConfig(cacheConfig);

/**
 * css-modules-require-hook: handle css-modules on node.js server.
 * similar to Babel's babel/register it compiles CSS modules in runtime.
 *
 * generateScopedName - Short alias for the postcss-modules-scope plugin's option.
 * Helps you to specify the custom way to build generic names for the class selectors.
 * You may also use a string pattern similar to the webpack's css-loader.
 *
 * https://github.com/css-modules/css-modules-require-hook#generatescopedname-function
 * https://github.com/webpack/css-loader#local-scope
 * https://github.com/css-modules/postcss-modules-scope
 */
supports.cssModuleHook({
  generateScopedName: "[name]__[local]___[hash:base64:5]"
});

supports.isomorphicExtendRequire().then(() => {
  require("electrode-server")(config, [staticPathsDecor()]);  // eslint-disable-line
});
