const fs = require('fs');
const ssoPlugin = require('@walmart/iam-sso-plugin/index.js');
const ssoPem = {
  "kty": "RSA",
  "e": "AQAB",
  "use": "sig",
  "kid": "d816a007-418f-4d9a-9391-cbee300145d3",
  "alg": "RSA1_5",
  "n": "hZ690ozsSm6YSPNRGFISCWJp1e0rXHk5Aur08Asy-xqvNVeWXbjOOET8dX0HC8Jd7_IinHnGDYwSyfPJ-agVJBHVwzb3irdhwhNBNa7IErdLG5FdU0zwsye6XHd52MDLK1IIngVYUV8ch26sz5hQLnZgzDjEIgRTvbMuctYaEFU"
};
const jwk2pem = require('pem-jwk').jwk2pem

exports.register = (server, options, next) => {

//Need to change consumer id and consumer name from below.
  server.register({
    register: ssoPlugin,
    options: {
      clientId: 'b4a3b917-e336-4a5e-a433-47bdb6a9f7fa',
      clientSecret: 'TJw8dSPdtC00fEQo6qi4FUl41G_xM6fEkz_zKxUNJzAySsbaMnqQE9bvrr9RSrP35uDlZ4_T5m6paUW4QMC-Hg',
      idTokenPubPem: jwk2pem(ssoPem),
      ssoBaseUrl: 'idp.qa.sso.platform.qa.walmart.com/platform-sso-server',
      scope: 'openid email profile',
      idp: 'ppidp',
      consumerId: '78d9b0eb-8de5-4262-8148-f3c13741913f',
      consumerName: 'L-IDC3JHDV7M-M',
      environment: 'qa',
      iamBaseBaseUrl: "qa.iam.platform.prod.walmart.com/platform-iam-server/",
      responseType: 'code',
      authReturnPath: '/checkUser',
      verifyAuthTokenInterval: 1800
    }
  }, (err) => {
    if (err) {
      throw err;
    }

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
    server.route({ //Send more user details..
      method: 'GET',
      path: '/checkUser',
      config: {
        handler: function rootHandler(request, reply) {
          console.log("authenticaiton", request.state, request.state['session']);
          var replyMessage = "Hello "+ request.state['session'].name+ "<br/>"+ JSON.stringify(request.state);
          reply(replyMessage);//send the state.
        }
      }
    });

    server.ext('onRequest', (request, reply) => {

      //Here you have full access to the original request
      console.log("PreResponse counter value: " , request.state, request.path);

      return reply.continue();

    });

  });
  //index route

  next();
};

exports.register.attributes = {
  name: "ssoPlugin",
  version: "1.0.0"
};
