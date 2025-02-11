const models = require("../models");
const mailer = require("../services/mailer");
const UtilsHelper = require("../helpers/utilsHelper");

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
        "disabled",
        "verifiedAt",
        "lastLogin",
      ],
      include: [
        {
          model: models.Subdivision,
          as: "subdivision",
          attributes: ["id", "name", "type", "latitude", "longitude"],
          include: [
            {
              model: models.City,
              as: "city",
              attributes: ["id", "name", "latitude", "longitude"],
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

exports.fetchAll = async (req, res) => {
  try {
    const users = await models.User.findAll({
      attributes: [
        "id",
        "firstName",
        "lastName",
        "fullName",
        "email",
        "role",
        "imageUrl",
        "emailVerified",
        "disabled",
        "verifiedAt",
        "lastLogin",
      ],
      include: [
        {
          model: models.Subdivision,
          as: "subdivision",
          attributes: ["id", "name", "type", "latitude", "longitude"],
          include: [
            {
              model: models.City,
              as: "city",
              attributes: ["id", "name", "latitude", "longitude"],
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
        


exports.fetchOne = async (req, res) => {
  try {
    const { id } = req.params;
    
    // check if there is a req.user and if the user is an admin
    const isAdmin = UtilsHelper.isAdmin(req.user);

    let attributes = []
    if (isAdmin) {
      attributes = [
        "id",
        "firstName",
        "lastName",
        "fullName",
        "email",
        "role",
        "imageUrl",
        "emailVerified",
        "disabled",
        "verifiedAt",
        "lastLogin",
      ];
    } else {
      attributes = [
        "id",
        "firstName",
        "lastName",
        "fullName",
        'disabled',
        "imageUrl",
      ];
    }

    const user = await models.User.findByPk(id, {
      attributes: attributes,
      include: [
        {
          model: models.Subdivision,
          as: "subdivision",
          attributes: ["id", "name", "type", "latitude", "longitude"],
          include: [
            {
              model: models.City,
              as: "city",
              attributes: ["id", "name", "latitude", "longitude"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, password, subdivisionId } = req.body;

    if(subdivisionId){
      // check existance
      const subdivision = await models.Subdivision.findByPk(subdivisionId);
      if(!subdivision){
        return res.status(404).json({ message: "Subdivision not found" });
      }
    }

    const user = await models.User.create({
      firstName,
      lastName,
      email,
      role,
      password,
      subdivisionId,
      emailVerified: true,
      verifiedAt: new Date(),
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, role, subdivisionId } = req.body;

    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(subdivisionId){
      // check existance
      const subdivision = await models.Subdivision.findByPk(subdivisionId);
      if(!subdivision){
        return res.status(404).json({ message: "Subdivision not found" });
      }
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.role = role;
    user.subdivisionId = subdivisionId;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
}




exports.disableUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.emailVerified = false;
    user.verifiedAt = null;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

exports.enableUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.emailVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};

// SETUP Stuff ----------


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

exports.uploadAvatar = async (req, res) => {
  try {
    const user = req.user
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // save the image
    user.imageUrl = file.location;
    await user.save();

    return res.status(200).json(user);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
};


exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userId = req.user.id

    const user = await models.User.findByPk(userId);
    

    // check if the old password is correct
		const valid = await user.comparePassword(oldPassword);

		if(!valid) {
			return res.status(401).json({ message: 'Credenciales incorrectas' });
		}
    

    // set the new password
    user.password = newPassword;
    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
}