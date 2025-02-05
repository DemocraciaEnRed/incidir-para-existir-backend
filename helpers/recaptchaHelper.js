const { promisify } = require('util');
const request = promisify(require('request'));
const UtilsHelper = require('./utilsHelper');

const { GOOGLE_RECAPTCHA_V2_SECRET_KEY } = process.env;

exports.verifyRecaptcha = async (token) => {
  const response = await request({
    url: 'https://www.google.com/recaptcha/api/siteverify',
    method: 'POST',
    form: {
      secret: GOOGLE_RECAPTCHA_V2_SECRET_KEY,
      response: token
    }
  });

  const body = JSON.parse(response.body);

  return body.success;
}

exports.requiresRecaptcha = (user) => {
  if(!user) {
    return true;
  }
  if(UtilsHelper.isAdmin(user)) {
    return false;
  }

  return true;
}