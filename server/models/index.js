if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize')
    , sequelize = null

  // if (process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
  //   // the application is executed on Heroku ... use the postgres database
  //   sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BRONZE_URL, {
  //     dialect:  'postgres',
  //     protocol: 'postgres',
  //     port:     match[4],
  //     host:     match[3],
  //     logging:  true //false
  //   })
  // } else {
    // the application is executed on the local machine ... using postgres
  sequelize = new Sequelize('iodide', 'postgres', 'pass', {
          dialect:  'postgres',
          protocol: 'postgres',
          port:     5432,
          host:     '127.0.0.1',
          logging:  false
    })
  // }

  sequelize.authenticate().then(() => {
    console.log("Success!");
  }).catch((err) => {
    console.log(err);
  });


  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Notebook:  sequelize.import(__dirname + '/notebook'),
    User:      sequelize.import(__dirname + '/user')
  }

  // Associations
  global.db.Notebook.belongsTo(global.db.User, {
    foreignKey: 'owner',
    allowNull: false,
  });

}

module.exports = global.db