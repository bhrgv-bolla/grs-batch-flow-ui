/**
 * Created by bbolla on 1/10/2017.
 */
var passport  = require('passport-strategy')
, util = require('util')
  , jwk2pem = require('pem-jwk').jwk2pem
  , IAMSSOCommon = require('@walmart/iam-sso-common')
  , pub_pem;


/*
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options == 'function' || !options.redirectURL) {
    throw new TypeError('SSO strategy require redirectURL');
  }
  passport.Strategy.call(this);
  this.name = 'sso_strategy';
  this._redirectURL = options.redirectURL;

  this._iamSSOCommon = new IAMSSOCommon(options.config.sso);
  if(!pub_pem)
  {
    pub_pem = jwk2pem(options.config.sso_pem);
  }
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request against SSO
 * @param {Object} req
 * @param {Object} options
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var self = this;
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var buf;
  var redirectTo = "/";
  var state = {};
  if(req.query.code)
  {
    if(req.query.state) {
      buf = new Buffer(req.query.state, 'base64');
      state = JSON.parse(buf.toString());
      if(state.postAuthRedirect) {
        redirectTo = state.postAuthRedirect;
      }
    }
    this._iamSSOCommon.fetchSSOAuthToken(req.query.code, this._redirectURL, function (error, tokenInfo) {
      if (!error && tokenInfo.error) {
        self.error(tokenInfo.error);
      }
      self._iamSSOCommon.verifySSOToken(tokenInfo.id_token, pub_pem , function (error, token) {
        if(error)
        {
          self.error(error);
        }
        else
        {
          token.redirect = redirectTo;
          self.success(token);
        }
      });
    });
  }
  else
  {
    self.redirect(this._iamSSOCommon.generateSSOAuthRedirectUrl(this._redirectURL, fullUrl));
  }
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
