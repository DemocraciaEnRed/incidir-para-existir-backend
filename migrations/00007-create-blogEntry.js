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
      authorId: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
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
        type: Sequelize.DataTypes.TEXT
      },
      slug: {
        type: Sequelize.DataTypes.STRING(512)
      },
      subtitle: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true
      },
      text: {
        type: Sequelize.DataTypes.TEXT
      },
      imageUrl: {
        type: Sequelize.DataTypes.STRING(512),
        allowNull: true
      },
      publishedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true
      },
      authorNotifiedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
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