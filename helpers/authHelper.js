const mailer = require('../services/mailer');
// const agenda = require('../services/agenda');
/**
 * Send a verification email to the user
 * @param {Object} user - the user object
 * @param {String} token - the token to send to the email user
 */
exports.sendSignupEmail = async (user, url) => {
  try {
    // render the email html
    const html = await mailer.renderEmailHtml('signup', {
      url: url
    })
    // send the email
    await mailer.sendNow(user.email, "Confirmá tu registro", html)
    return;
  } catch (error) {
    throw error;
  }
}

/**
 * Send a verification email to the user
 * @param {Object} user - the user object
 * @param {String} token - the token to send to the email user
 */
exports.sendVerificationEmail = async (user, url) => {
  try {
    // render the email html
    const html = await mailer.renderEmailHtml('signup', {
      url: url
    })
    // send the email
    await mailer.sendNow(user.email, "Confirmá tu registro", html)
    return;
  } catch (error) {
    throw error;
  }
}

/**
 * Send a password reset email to the user
 * @param {*} user 
 * @param {*} url 
 * @returns 
 */
exports.sendPasswordResetEmail = async (user, url) => {
  try {
    // render the email html
    const html = await mailer.renderEmailHtml('reset', {
      url: url
    })
    // send the email
    await mailer.sendNow(user.email, "Restablecer tu contraseña", html)
    return;
  } catch (error) {
    throw error;
  }
}

/**
 * Get the html for the account verification email
 * @param {*} user 
 * @returns 
 */
exports.getSuccessAccountVerificationHtml = async (user) => {
  try {
    return await mailer.renderHtml('auth/successVerification', {
      appUrl: process.env.APP_URL
    })
  } catch (error) {
    throw error;
  }
}

/**
 * Get the html for the password reset email
 * @param {*} user
 * @returns 
 */
exports.getAlreadyVerifiedHtml = async (user) => {
  try {
    return await mailer.renderHtml('auth/alreadyVerified', {
      appUrl: process.env.APP_URL
    })
  } catch (error) {
    throw error;
  }
}


exports.getNoTokenHtml = async (user) => {
  try {
    return await mailer.renderHtml('auth/noToken', {
      appUrl: process.env.APP_URL
    })
  } catch (error) {
    throw error;
  }
}

exports.getExpiredTokenHtml = async (user) => {
  try {
    return await mailer.renderHtml('auth/expiredToken', {
      appUrl: process.env.APP_URL
    })
  } catch (error) {
    throw error;
  }
}

exports.getNoUserHtml = async (user) => {
  try {
    return await mailer.renderHtml('auth/noUser', {
      appUrl: process.env.APP_URL
    })
  } catch (error) {
    throw error;
  }
}

exports.getGenericErrorHtml = async (user) => {
  try {
    return await mailer.renderHtml('auth/error', {
      appUrl: process.env.APP_URL
    })
  } catch (error) {
    throw error;
  }
}