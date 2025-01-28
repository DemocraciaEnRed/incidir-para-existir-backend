const models = require("../models");
const mailer = require("../services/mailer");

exports.fetch = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // calculateOffset
    const offset = (page - 1) * limit;
    

    const users = await models.User.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [['createdAt', 'DESC']],
      distinct: true,
      attributes: [
        "id",
        "firstName",
        "lastName",
        "fullName",
        "email",
        "role",
        "imageUrl",
        "emailVerified",
        "verifiedAt",
        "lastLogin",
      ],
      include: [
        {
          model: models.Subdivision,
          as: "subdivision",
          attributes: ["id", "name"],
          include: [
            {
              model: models.City,
              as: "city",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

exports.getSetup = async (req, res) => {
  try {
    // Check the magic query
    const magic = req.query.magic;
    const theMagicString = process.env.MAGIC_THINGY; // This should be set in the .env file

    if (magic != theMagicString) {
      // return 404
      return res.status(404).send();
    }

    // Check if there is an admin user, if there is not, the app is not initialized
    const adminUser = await models.User.findOne({ where: { role: "admin" } });

    if (adminUser) {
      // return 404 if there is an admin user
      return res.status(404).send();
    }

    // no admin user!
    const html = await mailer.renderHtml("admin/setup", { magic });

    // disable content-security-policy
    res.setHeader("Content-Security-Policy", "");

    // return the html
    return res.status(200).send(html);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

exports.postSetup = async (req, res) => {
  try {
    const magic = req.body.magic;
    const theMagicString = process.env.MAGIC_THINGY; // This should be set in the .env file

    // Check the magic query
    if (magic != theMagicString) {
      // return 404
      return res.status(404).send();
    }

    // check the body
    const { firstName, lastName, email, password } = req.body;
    const appUrl = process.env.APP_URL;

    // Create the admin user
    await models.User.create({
      email,
      firstName,
      lastName,
      password,
      role: "admin",
      subdivisionId: null,
      emailVerified: true,
      verifiedAt: new Date(),
    });

    const html = await mailer.renderHtml("admin/setupSuccess", { appUrl });
    // return the html
    return res.status(200).send(html);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, password } = req.body;

    const user = await models.User.create({
      firstName,
      lastName,
      email,
      role,
      password,
      emailVerified: true,
      verifiedAt: new Date(),
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
}