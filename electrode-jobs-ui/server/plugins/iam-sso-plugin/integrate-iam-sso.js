const fs = require('fs');
const ssoPlugin = require('@walmart/iam-sso-plugin/index.js');
const ssoPem = {"kty":"RSA","e":"AQAB","use":"sig","kid":"adb181c4-52b8-409f-9855-7d6f50e6e793","alg":"RSA1_5","n":"uxky1Az1YUfmYmbcl-gjl6rCVE8oNUyLA9Px7Sr2PA-ebrubpjPBa4JZNEI2ysEu42O1O9KetZ_i7RFbRqoAZ6566oImDyu80w6J4pClJplMFlW3Q4QMEyBBohUhBMU6gDEM-QVgyN2K05H4pakeuLgiIzZ6ZhKyZVGyaDSQccs"};
const jwk2pem = require('pem-jwk').jwk2pem

console.log("debug point 1");

exports.register = (server, options, next) => {

  console.log("debug point 2");
  server.register({
    register: ssoPlugin,
    options: {
      clientId: 'de03f4c1-20e0-4a68-85dd-05e7881ff485',
      clientSecret: 'AMzI4W12y8akuu20xu7IN4MU2rxjI9YdgW8QxQ-7t_lCowi8FEy1UBwjuVbMgJ6Dee8s3j8zEi9MO_sVDf4U4hc',
      idTokenPubPem: jwk2pem(ssoPem),
      ssoBaseUrl: 'idp.qa.sso.platform.qa.walmart.com/platform-sso-server',
      scope: 'openid email profile',
      idp: 'ppidp',
      consumerId: 'replenishment-sso-client-test',
      consumerName: 'replenishment-sso-client-test',
      environment: 'qa',
      iamBaseBaseUrl: 'iam2initial.iam2qa2.iam.platform.glb.qa.walmart.com',
      responseType: 'code',
      authReturnPath: '/checkUser'
    }
}, (err) => {
    console.log("Regestering the plugin for iam/sso...");
    if (err) {
      throw err;
    }
    console.log("logging strategy", server.auth.strategy);

//auth endpoint.
    server.route({
      method: 'GET',
      path: '/authorizeSSO',
      config: {
        auth: 'session',
        handler: function rootHandler(request, reply) {
          console.log("request", request, reply);
          reply("Yo! are you authenticated");
        }
      }
    });
    server.route({
      method: 'GET',
      path: '/checkUser',
      config: {
        handler: function rootHandler(request, reply) {
          console.log("authenticaiton", request.state, request.state['session']);
          reply("Yo! are you authenticated");
        }
      }
    });
  });
  //index route


  next();
};

exports.register.attributes = {
  name: "ssoPlugin",
  version: "1.0.0"
};
