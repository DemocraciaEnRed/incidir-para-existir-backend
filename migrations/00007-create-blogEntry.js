const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.createTable('BlogEntries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      sectionId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'BlogSections',
          key: 'id'
        }
      },
      categoryId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'BlogCategories',
          key: 'id'
        }
      },
      title: {
        type: Sequelize.DataTypes.STRING
      },
      slug: {
        type: Sequelize.DataTypes.STRING
      },
      subtitle: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
      },
      text: {
        type: Sequelize.DataTypes.TEXT
      },
      imageUrl: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
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
    await queryInterface.dropTable('BlogEntries');
  }
};