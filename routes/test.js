
const express = require('express');
const models = require('../models');
const mailer = require('../services/mailer');
const router = express.Router();
const { faker } = require('@faker-js/faker');
const uploader = require('../middlewares/s3');
const { query, check } = require('express-validator');
const validate = require('../middlewares/validate');

router.get('/', (req, res) => {
  try {
    return res.status(200).json({message: 'Test route works!'})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
})

// ids is a string of comma separated integers
router.get('/dimensions', 
  [
    query('id.*').isInt().withMessage('id must be an array of integers'),
  ],
  validate,
  async (req, res) => {
    try {
      console.log(req.query.id)
      return res.status(200).json(req.query.id)
    } catch (error) {
      console.error(error)
      return res.status(500).json({message: error.message})
    }
  }
)

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

router.get('/create-initiatives', async (req, res) => {
  try {

    const dimensions = await models.Dimension.findAll()

    // make a loop of 150 iterations
    for(let i = 0; i < 150; i++) {


      const contact = {
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        keepPrivate: faker.datatype.boolean()
      }
      const initiative = {
        name: faker.lorem.sentence({min: 4, max: 15}),
        description: faker.lorem.sentence({min: 10, max: 50}),
        needsAndOffers: faker.lorem.sentence({min: 20, max: 90}),
        publishedAt: new Date(),
      }
      const subdivisions = await models.Subdivision.findAll({include: 'city'})
      // console.log(JSON.stringify(subdivisions,null,2))

      // get a random subdivision
      const randomSubdivision = subdivisions[Math.floor(Math.random() * subdivisions.length)]

      const newContact = await models.InitiativeContact.create(contact)
      const newInitiative = await models.Initiative.create({
        ...initiative,
        contactId: newContact.id,
        subdivisionId: randomSubdivision.id,
      })

      // pick two random dimensions, different from each other
      const randomIndex1 = Math.floor(Math.random() * dimensions.length)
      let randomIndex2 = Math.floor(Math.random() * dimensions.length)
      while(randomIndex2 === randomIndex1) {
        randomIndex2 = Math.floor(Math.random() * dimensions.length)
      }
      const dimension1 = dimensions[randomIndex1]
      const dimension2 = dimensions[randomIndex2]
      
      // make a 65% chance of adding both dimensions, the rest, add the first one
      const chance = Math.random()
      if(chance > 0.35) {
        await newInitiative.addDimensions([dimension1, dimension2])
      } else {
        await newInitiative.addDimensions([dimension1])
      }
    }

    return res.status(200).json({
      message: '150 Initiatives created successfully'
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
})


router.get('/create-challenges', async (req, res) => {
  try {
    // challenge has:
    //    dimensionId
    //    subdivisionId
    //    needsAndChallenges
    //    proposal
    //    inWords
    
    const dimensions = await models.Dimension.findAll()
    const subdivisions = await models.Subdivision.findAll()

    // make a loop of 150 iterations
    for(let i = 0; i < 150; i++) {
      const challenge = {
        needsAndChallenges: faker.lorem.sentence({min: 20, max: 90}),
        proposal: faker.lorem.sentence({min: 20, max: 90}),
        inWords: faker.lorem.words({min: 1, max: 2})
      }

      // get a random subdivision
      const randomSubdivision = subdivisions[Math.floor(Math.random() * subdivisions.length)]
      const randomDimension = dimensions[Math.floor(Math.random() * dimensions.length)]

      const newChallenge = await models.Challenge.create({
        subdivisionId: randomSubdivision.id,
        dimensionId: randomDimension.id,
        ...challenge,
      })
    }

    return res.status(200).json({
      message: '150 Challenges created successfully'
    })
  } catch {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
})


router.post('/file-test', uploader.single('file'), async (req, res) => {
  try {
    console.log(req.file)
    return res.status(200).json({message: 'File uploaded successfully', file: req.file })
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
})


module.exports = router;
