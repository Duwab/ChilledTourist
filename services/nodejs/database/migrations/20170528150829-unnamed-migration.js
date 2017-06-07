'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'Users',
      'recommender_id',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        onDelete: 'SET NULL',
        references: {
          model: 'Users',
          key: 'id'
        },
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn(
      'Users',
      'recommender_id')
  }
};
