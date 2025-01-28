// 'use strict';
const { Model, DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  class InitiativeContact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InitiativeContact.hasOne(models.Initiative, {
        foreignKey: 'contactId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        as: 'initiative',
      });
    }
  }

  InitiativeContact.init({
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    keepEmailPrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keepPhonePrivate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    publicData: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          fullname: this.fullname,
          email:  this.keepEmailPrivate ? 'Privado' : this.email,
          phone: this.keepPhonePrivate ? 'Privado' : this.phone,
        };
      },
      set(val) {
        throw new Error('Do not try to set the `publicData` value!');
      }
    }
  }, {
    sequelize,
    timestamps: true,
    modelName: 'InitiativeContact',
    tableName: 'InitiativeContacts',
  });

  return InitiativeContact;
};