
const { faker } = require('@faker-js/faker');
const models = require('../models');
const dayjs = require('dayjs');
const msg = require('../utils/messages');
const UtilsHelper = require('../helpers/utilsHelper');
const mailer = require('../services/mailer');

exports.dimensionsQuery = async (req, res) => {
  try {
    console.log(req.query.id)
    return res.status(200).json(req.query.id)
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
}

exports.verifyAccount = async (req, res) => {
  try {
    const html = await mailer.renderHtml('auth/successVerification', {
      appUrl: process.env.APP_URL
    })
    return res.status(200).send(html)
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
}

exports.createInitiatives = async (req, res) => {
  try {

    const dimensions = await models.Dimension.findAll()

    // make a loop of 150 iterations
    for(let i = 0; i < 150; i++) {


      const contact = {
        fullname: faker.person.fullName(),  
        email: faker.internet.email(),
        keepEmailPrivate: faker.datatype.boolean(),
        phone: faker.phone.number(),
        keepPhonePrivate: faker.datatype.boolean()
      }



      const initiative = {
        name: faker.lorem.sentence({min: 4, max: 15}),
        source: 'web',
        description: faker.lorem.sentence({min: 10, max: 50}),
        needsAndOffers: faker.lorem.sentence({min: 20, max: 90}),
        publishedAt: new Date(),
        latitude: null,
        longitude: null
      }
      const subdivisions = await models.Subdivision.findAll({include: 'city'})
      // console.log(JSON.stringify(subdivisions,null,2))

      // get a random subdivision
      const randomSubdivision = subdivisions[Math.floor(Math.random() * subdivisions.length)]
      
      const setCoordinates = faker.datatype.boolean(0.75)
      const coordinates = faker.location.nearbyGPSCoordinate({
        origin: [randomSubdivision.latitude, randomSubdivision.longitude],
        radius: 14,
        isMetric: true
      })

      if(setCoordinates) {
        initiative.latitude = coordinates[0]
        initiative.longitude = coordinates[1]
      }

      const newContact = await models.InitiativeContact.create(contact)
      const newInitiative = await models.Initiative.create({
        ...initiative,
        contactId: newContact.id,
        cityId: randomSubdivision.city.id,
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
}

exports.createChallenges = async (req, res) => {
  try {
    // challenge has:
    //    dimensionId
    //    subdivisionId
    //    needsAndChallenges
    //    proposal
    //    inWords
    //    latitude: null
    //    longitude: null
    
    const dimensions = await models.Dimension.findAll()
    const subdivisions = await models.Subdivision.findAll({
      include: 'city'
    })

    // make a loop of 150 iterations
    for(let i = 0; i < 150; i++) {
      const challenge = {
        needsAndChallenges: faker.lorem.sentence({min: 20, max: 90}),
        proposal: faker.lorem.sentence({min: 20, max: 90}),
        inWords: faker.lorem.words({min: 1, max: 2}),
        publishedAt: new Date(),
        latitude: null,
        longitude: null
      }

      // get a random subdivision
      const randomSubdivision = subdivisions[Math.floor(Math.random() * subdivisions.length)]
      const randomDimension = dimensions[Math.floor(Math.random() * dimensions.length)]

      const setCoordinates = faker.datatype.boolean(0.75)
      const coordinates = faker.location.nearbyGPSCoordinate({
        origin: [randomSubdivision.latitude, randomSubdivision.longitude],
        radius: 14,
        isMetric: true
      })
      if(setCoordinates) {
        challenge.latitude = coordinates[0]
        challenge.longitude = coordinates[1]
      }

      const newChallenge = await models.Challenge.create({
        cityId: randomSubdivision.city.id,
        subdivisionId: randomSubdivision.id,
        dimensionId: randomDimension.id,
        ...challenge,
      })
    }

    return res.status(200).json({
      message: '150 Challenges created successfully'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
}

exports.fileTest = async (req, res) => {
  try {
    console.log(req.file)
    return res.status(200).json({message: 'File uploaded successfully', file: req.file })
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: error.message})
  }
}


exports.createBlogEntries = async (req, res) => {
  try {
    const categories = await models.BlogCategory.findAll();
    const sections = await models.BlogSection.findAll();
    const authors = await models.User.findAll();

    for(let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const section = sections[Math.floor(Math.random() * sections.length)];
      const author = authors[Math.floor(Math.random() * authors.length)];

      await models.BlogEntry.create({
        title: faker.lorem.words({min: 8, max: 16}),
        subtitle: faker.lorem.sentence(16),
        text: faker.lorem.paragraphs({min: 10, max: 20}),
        imageUrl: faker.image.urlPicsumPhotos({ width: 1024, height: 768, grayscale: false, blur: 0 }),
        slug: faker.lorem.slug(5),
        authorId: author.id,
        categoryId: category.id,
        sectionId: section.id,
        publishedAt: dayjs().subtract(Math.floor(Math.random() * 365), 'day').toDate(),
      });
    }

    return res.status(200).json({ message: 'Blog posts created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.createBotResponses = async (req, res) => {
  try {
    const botResponses = []
    for(let i = 0; i < 50; i++) {
      botResponses.push({
        payload: {
          a: faker.lorem.sentence(10),
          b: faker.lorem.sentence(10),
          c: faker.datatype.boolean(),
        }
      });
    }

    await models.BotResponse.bulkCreate(botResponses);

    return res.status(200).json({ message: 'Bot responses created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.createResorces = async (req, res) => {
  try {
    const resources = []
    for(let i = 0; i < 50; i++) {
      resources.push({
        categoryId: [1, 2, 3][Math.floor(Math.random() * 3)],
        title: faker.lorem.words(4),
        description: Math.random() > 0.5 ? faker.lorem.sentence(10) : null,
        url: faker.internet.url(),
      });
    }

    await models.ResourceEntry.bulkCreate(resources);

    return res.status(200).json({ message: 'Resources created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}

exports.createComments = async (req, res) => {
  try {
    const entries = await models.BlogEntry.findAll();
    const users = await models.User.findAll();
    
    for (let i = 0; i < 50; i++) {
      // pick a random entry
      const entry = entries[Math.floor(Math.random() * entries.length)];
      
      // get a random number of comments between 12 and 52
      const numComments = Math.floor(Math.random() * 40) + 12;

      for (let j = 0; j < numComments; j++) {
        // create a first level comment
        const user = users[Math.floor(Math.random() * users.length)];
        const comment = await models.Comment.create({
          text: faker.lorem.sentence({min: 45, max: 90}),
          authorId: user.id,
          blogEntryId: entry.id,
        })
        console.log(`-- Created comment ${comment.id} for entry ${entry.id}`)
        
        // get a random number of replies between 12 and 52
        const numReplies = Math.floor(Math.random() * 40) + 12;
        for (let k = 0; k < numReplies; k++) {
          const user = users[Math.floor(Math.random() * users.length)];
          const reply = await models.Comment.create({
            text: faker.lorem.sentence({min: 45, max: 90}),
            authorId: user.id,
            blogEntryId: entry.id,
            commentId: comment.id,
          })
          console.log(`-- -- Created reply ${reply.id} for comment ${comment.id}`)
        }        
      }
    }
    
    
    return res.status(200).json({ message: 'Comments created' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.getComments = async (req, res) => {
  try {
    const entryId = req.query.entryId;

    const comments = await models.Comment.findAll({
      where: { blogEntryId: entryId, commentId: null },
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'imageUrl', 'role'],
        },
        {
          model: models.Comment,
          as: 'replies',
          include: [
            {
              model: models.User,
              as: 'author',
              attributes: ['id', 'firstName', 'lastName', 'fullName', 'imageUrl', 'role'],
            }
          ]
        }
      ]
    });

    return res.status(200).json(comments);
   
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.getReplies = async (req, res) => {
  try {
    const commentId = req.query.commentId;
    

    const replies = await models.Comment.findAll({
      where: { commentId: commentId },
      include: [
        {
          model: models.User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'fullName', 'imageUrl', 'role'],
        }
      ]
    });

    return res.status(200).json(replies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}

exports.mailtest = async (req, res) => {
  try {
    const {
      to,
      from,
      subject,
    } = req.body
    const html = await mailer.renderHtml('auth/successVerification', {
      appUrl: process.env.APP_URL
    });
    console.log(process.env)
    await mailer.sendNow(to, subject, html);
    
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: msg.error.default });
  }
}
