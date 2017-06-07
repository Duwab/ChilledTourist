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
      },
    },
  });
  return UserRecommender;
};
