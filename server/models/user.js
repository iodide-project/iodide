module.exports = function(sequelize, DataTypes) {
  return sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    githubUserId: DataTypes.STRING,
    accessToken: DataTypes.STRING,
    avatar: DataTypes.STRING,
  })
}