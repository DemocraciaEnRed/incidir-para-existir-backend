const { faker } = require('@faker-js/faker');
const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const UtilsHelper = require('../helpers/utilsHelper');
const RecaptchaHelper = require('../helpers/recaptchaHelper');
const mailer = require('../services/mailer');

exports.getConfigs = async (req, res) => {
  try {
    const keys = req.query.keys ? req.query.keys.split(',') : null;
    
    const configs = await UtilsHelper.getConfigs(keys);

    return res.status(200).json(configs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.setConfigs = async (req, res) => {
  try {
    const { key, type, value } = req.body;

    const config = await models.Config.findOne({
      where: { key: key }
    });

    if (!config) {
      return res.status(404).json({ message: msg.error.notFound });
    }

    config.type = type || config.type;
    config.value = value.toString();
    await config.save();

    return res.status(200).json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.getSubdivisions = async (req, res) => {
  try {
    // get all subdivisions
    const subdivisions = await models.Subdivision.findAll({
      include: [
        {
          model: models.City,
          as: 'city',
        }
      ]
    });

    return res.status(200).json(subdivisions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.getCities = async (req, res) => {
  try {
    // get all cities
    const cities = await models.City.findAll({
      include: [
        {
          model: models.Subdivision,
          as: 'subdivisions',
        }
      ]
    });

    return res.status(200).json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.getDimensions = async (req, res) => {
  try {
    // get all dimensions
    const dimensions = await models.Dimension.findAll({
      attributes: ['id', 'name'],
    });

    return res.status(200).json(dimensions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.postContact = async (req, res) => {
  try {
    const { fullname, email, message, recaptchaResponse } = req.body;

    const recaptchaValidation = await RecaptchaHelper.verifyRecaptcha(recaptchaResponse);
      if(!recaptchaValidation) {
        return res.status(400).json({ message: 'Error en la validación del recaptcha' });
      }   

    // render the email html
    const html = await mailer.renderEmailHtml('contact', {
      fullname: fullname,
      email: email,
      message: message
    })
    // send the email
    const contactEmail = process.env.CONTACT_EMAIL || null;
    if (!contactEmail) {
      console.error('No se ha configurado el email de contacto - Skipping email sending');
      return res.status(500).json({ message: 'Error en el servidor' });
    }
    await mailer.sendNow(contactEmail, `Nuevo contacto en Incidir para Existir: ${fullname}`, html);
    
    return res.status(200).json({ message: 'Email enviado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}