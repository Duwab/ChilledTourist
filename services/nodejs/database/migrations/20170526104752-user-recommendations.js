module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('UserRecommenders', {
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        },
      },
      recommenderId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'recommenderId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: (queryInterface /* , Sequelize */) =>
    queryInterface.dropTable('UserRecommenders'),
};
