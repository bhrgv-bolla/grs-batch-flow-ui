'use strict';

// includes
const IamSsoCommon = require('@walmart/iam-sso-common');
const Iam = require('@walmart/iam');
const Joi = require('joi');
const Hoek = require('hoek');
const pkg = require('./package.json');

// exports
exports.register = function register(server, options, next) {
  server.auth.scheme('iam-sso', internals.implementation);
  server.auth.strategy('session', 'iam-sso', true, options);
  next();
};

exports.register.attributes = {
  pkg
};

// locals
const internals = {};

internals.schema = Joi.object({
  cookie: Joi.string().default('session'),
  ttl: Joi.number().integer().min(0),
  domain: Joi.string().allow(null),
  path: Joi.string().default('/'),
  responseType: Joi.string(),
  ssoBaseUrl: Joi.string(),
  clientId: Joi.string(),
  clientSecret: Joi.string(),
  idTokenPubPem: Joi.string(),
  scope: Joi.string(),
  verifyAuthTokenInterval: Joi.number().integer().min(0).default(600000),
  idp: Joi.string(),
  logoutRedirect: Joi.string().default('/'),
  consumerId: Joi.string(),
  consumerName: Joi.string(),
  environment: Joi.string(),
  iamBaseBaseUrl: Joi.string(),
  authReturnPath: Joi.string()
}).required();

internals.implementation = function implementation(server, options) {
  const results = Joi.validate(options, internals.schema);
  Hoek.assert(!results.error, results.error);

  const settings = results.value;
  //The isSecure and HttpOnly should be made true when in production (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
  const cookieOptions = {
    encoding: 'iron',
    path: settings.path,
    ttl: settings.ttl,
    password: settings.clientSecret,
    isHttpOnly: false,
    isSecure: false,
    isSameSite: false
  };

  console.log("Cookie Options are :", cookieOptions);

  const iamSsoCommon = new IamSsoCommon({
    responseType: settings.responseType,
    clientId: settings.clientId,
    clientSecret: settings.clientSecret,
    scope: settings.scope,
    baseUrl: settings.ssoBaseUrl
  });

  const iam = new Iam({
    baseUrl: `https://${settings.iamBaseBaseUrl}/`,
    consumerId: settings.consumerId,
    consumerName: settings.consumerName,
    environment: settings.environment
  });

  server.state(settings.cookie, cookieOptions);
  server.ext('onPreAuth', function onPreAuth(request, reply) {
    request.auth.session = {
      set: function set() {
        // NOOP: application should not have the ability to change the session value
      },
      clear: function clear(request, reply) {
        const redirect = `${request.connection.info.protocol}://${request.info.host}${settings.logoutRedirect}`;
        const logout = `http://${settings.ssoBaseUrl}/${settings.idp}/logout?post_logout_redirect_uri=${redirect}`;
		console.log("request auth++++++++++++++++++++++++++++++++++++++", request.auth, request.state);
        request.auth.artifacts = null;

        reply.unstate(settings.cookie);
        reply.redirect(logout);
      },
      ttl: function ttl() {
        // NOOP: application should not have the ability to set the ttl
      }
    };

    return reply.continue();
  });

  // scheme
  return {
    authenticate: function authenticate(request, reply) {
      const redirect = `${request.connection.info.protocol}://${request.info.host}${request.url.path}`;
      const returnUri = `${request.connection.info.protocol}://${request.info.host}${settings.authReturnPath}`;
      const session = request.state[settings.cookie];
	  console.log("request.state****************/n", request.state);
	  console.log("redirect: ",redirect, "\nreturnUri", returnUri);

      if (session) {
        // session.lastVerified is coerced to a string when stored in the cookie, so we have to coerce it back
        // to a Date
		console.log("Is Validation Check Needed?", (Date.now() - (new Date(session.lastVerified)).getTime()), settings.verifyAuthTokenInterval);
        if ((Date.now() - (new Date(session.lastVerified)).getTime()) > settings.verifyAuthTokenInterval) {
          // verify that token is still valid
          iam.getTokenInfo(session['iam-token'], function getTokenInfo(err, info) {
			  console.log(err, info);
            if (err || !info.valid) {
              return reply.continue(err || new Error(info.errorMsg), { credentials: session, artifacts: session });
            }
            console.log("getTokenInfo", info);
            session.lastVerified = new Date();
            reply.state(settings.cookie, session);
            reply.continue({ credentials: session, artifacts: session });
          });
        } else {
          reply.continue({ credentials: session, artifacts: session });
        }
      // after a user authenticates on the iam, sso server they are recirected back to settings.authReturnPath
      // with a code; we then need to fetch the sso token and verify it
      } else if (request.url.pathname === settings.authReturnPath && request.url.query.code) {
        iamSsoCommon.fetchSSOAuthToken(request.url.query.code, returnUri, function fetchSSOAuthToken(err, token) {
          if (err || token.error) {
            return reply(err || new Error(token.error), null, { credentials: session, artifacts: session });
          }
          //console.log("else if: No errors in tokens \n ", request.url.query,"\n",  token, "\n", settings);


          iamSsoCommon.verifySSOToken(token.id_token, settings.idTokenPubPem,
            function verifySSOToken(err, verifiedToken) {
			//console.log("verifySSOToken*************\n", err,"\n", verifiedToken );
              if (err) {
                return reply(err, null, { credentials: session, artifacts: session });
              }

              verifiedToken.lastVerified = new Date();
              let state;
              try {
                // request.url.query.state is a base64 encode JSON string; it is encoded and sent to
                // the iam, sso server by iamSsoCommon.generateSSOAuthRedirectUrl, which retruns it as
                // a query parameter
                state = JSON.parse(new Buffer(request.url.query.state, 'base64').toString('utf8'));
				console.log("State", state);
              } catch (err) {
                return reply(err, null, { credentials: session, artifacts: session });
              }
			  //console.log("Token success fully verified", settings.cookie, verifiedToken);
              //reply.state(settings.cookie, verifiedToken);
			  //console.log("reply has cookies", reply);
              return reply.redirect(state.postAuthRedirect).state(settings.cookie, verifiedToken);
            });
        });
      } else {
		  console.log("Redirecting the user to SSO login page..****************************************.");
        return reply.redirect(iamSsoCommon.generateSSOAuthRedirectUrl(returnUri, redirect));
      }
    }
  };
};
