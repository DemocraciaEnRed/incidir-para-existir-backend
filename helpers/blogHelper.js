const mailer = require('../services/mailer');


exports.sendNotificationOfPendingPostToAdmins = async (fullname, email, postTitle, postSubtitle, postCategory) => {
  try {
    // render the email html
    const html = await mailer.renderEmailHtml('newPost', {
      fullname,
      email,
      postTitle,
      postSubtitle,
      postCategory,
    })
    // send the email
    const contactEmail = process.env.CONTACT_EMAIL || null;
    if (!contactEmail) {
      console.error('No se ha configurado el email de contacto - Skipping email sending');
      throw error
    }
    await mailer.sendNow(contactEmail, `Nuevo post pendiente de aprobación - ${fullname} `, html);
    
    return;
  } catch (error) {
    throw error;
  }
}

exports.sendNotificationOfPublishedPostToAuthor = async (email, postTitle) => {
  try {
    // render the email html
    const html = await mailer.renderEmailHtml('publishedPost', { postTitle })
    // send the email
    await mailer.sendNow(email, `Tu post ha sido publicado`, html);
    
    return;
  } catch (error) {
    throw error;
  }
}