
//Import Strategy
var Strategy = require("./strategy.js");

var options = {
  config: {
    sso: { // All details as is...
      baseUrl: 'idp.qa.sso.platform.qa.walmart.com/platform-sso-server',
      responseType: 'code',
      clientId: 'de03f4c1-20e0-4a68-85dd-05e7881ff485',
      clientSecret: 'AMzI4W12y8akuu20xu7IN4MU2rxjI9YdgW8QxQ-7t_lCowi8FEy1UBwjuVbMgJ6Dee8s3j8zEi9MO_sVDf4U4hc',
      scope: 'openid'
    },
    sso_pem: { // Id token signing key..
      "kty": "RSA",
      "e": "AQAB",
      "use": "sig",
      "kid": "adb181c4-52b8-409f-9855-7d6f50e6e793",
      "alg": "RSA1_5",
      "n": "uxky1Az1YUfmYmbcl-gjl6rCVE8oNUyLA9Px7Sr2PA-ebrubpjPBa4JZNEI2ysEu42O1O9KetZ_i7RFbRqoAZ6566oImDyu80w6J4pClJplMFlW3Q4QMEyBBohUhBMU6gDEM-QVgyN2K05H4pakeuLgiIzZ6ZhKyZVGyaDSQccs"
    }
  }
}; //Setting a strategy's options.
