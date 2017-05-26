module.exports = (sequelize, DataTypes) => {
  const UserRecommender = sequelize.define('UserRecommender', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recommenderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        // UserRecommender.belongsToMany(models.User, {
        //   through: 'User',
        //   foreignKey: 'userId',
        //   otherKey: 'id'
        // });
        // UserRecommender.belongsToMany(models.User, {
        //   through: 'User',
        //   foreignKey: 'recommenderId',
        //   otherKey: 'id'
        // });
      },
    },
  });
  return UserRecommender;
};
