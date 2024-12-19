const models = require('../models');

exports.getAll = async (req, res) => {
  try {
    const faqs = await models.Faq.findAll({
      order: [['order', 'ASC']]
    });
    return res.status(200).json(faqs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
}

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id;
    const faq = await models.Faq.findOne({ where: { id } });
    return res.status(200).json(faq);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
}

exports.create = async (req, res) => {
  try {
    const { order, question, answer } = req.body;
    const faq = await models.Faq.create({ order, question, answer });
    return res.status(201).json(faq);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
}

exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const { order, question, answer } = req.body;
    const faq = await models.Faq.findOne({ where: { id } });
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    faq.order = order;
    faq.question = question;
    faq.answer = answer;
    await faq.save();
    return res.status(200).json(faq);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
}

exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const faq = await models.Faq.findOne({ where: { id } });
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    await faq.destroy();
    return res.status(200).json({ message: 'FAQ deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred' });
  }
}
