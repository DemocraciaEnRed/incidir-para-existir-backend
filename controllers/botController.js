
const models = require('../models');
const msg = require('../utils/messages');

exports.postTwilioWebhook = async (req, res) => {
  try {
    console.log('==================================')
    console.log('POST /whatsapp')
    console.log('==================================')
    console.log('REQUEST BODY:', req.body)
    console.log('==================================')
    console.log('REQUEST HEADERS:', req.headers)
    console.log('==================================')
    console.log('REQUEST QUERY:', req.query)
    console.log('==================================')
    
    // Stringify the request body in case it's an object
    console.log('REQUEST BODY STRINGIFIED:')
    console.log(JSON.stringify(req.body))
    console.log('==================================')
    console.log('REQUEST BODY LENGTH:', JSON.stringify(req.body).length);
    console.log('==================================')
    console.log('REQUEST HEADERS STRINGIFIED:')
    console.log(JSON.stringify(req.headers))
    console.log('==================================')

    console.log('Saving payload to BotResponse model')


    await models.BotResponse.create({
      payload: req.body
    });

    
    console.log('Payload saved successfully to BotResponse model');
    console.log('==================================')
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: msg.error.default });
  }
}
