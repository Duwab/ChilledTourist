'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    recommender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    classMethods: {
      associate: (models) => {
        User.belongsTo(models.User, {
          foreignKey: 'recommender_id',
          as: 'recommender',
          onDelete: 'SET NULL'
        });
        // User.belongsToMany(User, {
        //   as: 'Recommenders',
        //   through: 'UserRecommenders',
        //   foreignKey: 'userId',
        //   otherKey: 'recommenderId',
        // });
        // User.belongsToMany(User, {
        //   as: 'Recommending',
        //   through: 'UserRecommenders',
        //   foreignKey: 'recommenderId',
        //   otherKey: 'userId',
        // });
      },
    }
  });
  return User;
};
