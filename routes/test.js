
const express = require('express');
const models = require('../models');
const mailer = require('../services/mailer');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    return res.status(200).json({message: 'Test route works!'})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
})

router.get('/cities', async (req, res) => {
  try {
    const cities = await models.City.findAll()
    return res.status(200).json(cities)
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
})

router.get('/verifyaccount', async (req, res) => {
  try {
    const html = await mailer.renderHtml('auth/successVerification', {
      appUrl: process.env.APP_URL
    })
    return res.status(200).send(html)
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
})

router.get('/create-initiative', async (req, res) => {
  try {
    const contact = {
      fullname: 'John Doe',
      email: 'something@gmail.com',
      phone: '1234567890',
      keepPrivate: false,
    }
    const initiative = {
      name: 'Test Initiative',
      description: 'My descriptions',
      needsAndOffers: 'My needs and offers',
    }
    const subdivisions = await models.Subdivision.findAll({include: 'city'})
    // console.log(JSON.stringify(subdivisions,null,2))

    // get a random subdivision
    const randomSubdivision = subdivisions[Math.floor(Math.random() * subdivisions.length)]
    console.log(JSON.stringify(randomSubdivision,null,2))

    // get dimension 1 and 2
    const dimension1 = await models.Dimension.findByPk(1)
    const dimension2 = await models.Dimension.findByPk(2)
    // console.log(JSON.stringify(dimension1,null,2))
    // console.log(JSON.stringify(dimension2,null,2))

    
    const newContact = await models.InitiativeContact.create(contact)
    const newInitiative = await models.Initiative.create({
      ...initiative,
      contactId: newContact.id,
      subdivisionId: randomSubdivision.id,
    })
    await newInitiative.addDimensions([dimension1, dimension2])

    const finalResult = await models.Initiative.findByPk(newInitiative.id, {
      include: [
        {model: models.InitiativeContact, as: 'contact'},
        {model: models.Subdivision, as: 'subdivision'},
        {model: models.Dimension, as: 'dimensions'}
      ]
    })

    return res.status(200).json({
      finalResult,
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
})

module.exports = router;
