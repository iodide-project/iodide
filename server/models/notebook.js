module.exports = function(sequelize, DataTypes) {
  return sequelize.define("Notebook", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    content: DataTypes.TEXT,
    title: DataTypes.STRING,
  })
}