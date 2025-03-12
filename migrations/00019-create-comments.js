const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      authorId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      commentId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Comments',
          key: 'id'
        }
      },
      blogEntryId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'BlogEntries',
          key: 'id'
        },
      },
      text: {
        type: Sequelize.DataTypes.TEXT
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.fn('now'),
        allowNull: false,
      }
    },{
      timestamp: true,
    });
  },
  async down({context: queryInterface}) {
    await queryInterface.dropTable('Comments');
  }
};