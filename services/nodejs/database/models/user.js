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
    }
  }, {
    classMethods: {
      associate: (models) => {
        User.belongsToMany(User, {
          as: 'Recommenders',
          through: 'UserRecommenders',
          foreignKey: 'userId',
          otherKey: 'recommenderId',
        });
        User.belongsToMany(User, {
          as: 'Recommending',
          through: 'UserRecommenders',
          foreignKey: 'recommenderId',
          otherKey: 'userId',
        });
      },
    }
  });
  return User;
};
