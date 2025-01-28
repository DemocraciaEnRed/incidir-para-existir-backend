// 'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

async function hashPassword(password) {
  console.log(password)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword
}

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Subdivision, {
        foreignKey: 'subdivisionId',
        as: 'subdivision',
      });
      User.hasMany(models.Initiative, {
        foreignKey: 'authorId',
        sourceKey: 'id',
        as: 'initiatives',
      })
      
    }
    comparePassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    async generateVerificationToken() {
      let data = {
        userId: this.id,
        event: 'email-verification',
        token: crypto.randomBytes(20).toString('hex'),
        expiresAt: dayjs().add(1, 'day').toDate()
      }
      let userToken = await sequelize.models.UserToken.create(data);
      return userToken;
    }

    async generateJWT() {
      const expiresIn = '2d';

      this.lastLogin = new Date();
      await this.save();

      let payload = {
        id: this.id,
        email: this.email,
        role: this.role,
        lastLogin: this.lastLogin
      }
      return jwt.sign(payload, process.env.JWT_SECRET, { 
        expiresIn
      });
    }

    async generatePasswordResetToken() {
      let data = {
        userId: this.id,
        event: 'password-reset',
        token: crypto.randomBytes(20).toString('hex'),
        expiresAt: dayjs().add(1, 'hour').toDate()
      }
      let userToken = await sequelize.models.UserToken.create(data);
      return userToken;
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    }, 
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(510),
      validate: {
        isUrl: true
      },
      allowNull: true
    },
    subdivisionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    timestamps: true,
    modelName: 'User',
    tableName: 'Users',
  });

  // User.beforeCreate(async (user, options) => {
  //   console.log('beforeCreate')
  //   console.log(user.password)
  //   const hashedPassword = await hashPassword(user.password);
  //   user.password = hashedPassword;
  // });

  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
    }
  });


  return User;
};