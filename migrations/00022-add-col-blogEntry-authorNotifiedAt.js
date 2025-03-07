const {Sequelize} = require('sequelize')

module.exports = {
  async up({context: queryInterface}) {
    await queryInterface.addColumn('BlogEntries', 'authorNotifiedAt', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      after: 'imageUrl',
    });
  },
  async down({context: queryInterface}) {
    await queryInterface.removeColumn('BlogEntries', 'authorNotifiedAt');
  }
};