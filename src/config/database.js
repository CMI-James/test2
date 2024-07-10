const { Sequelize } = require("sequelize");
require("dotenv").config();

const { POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(POSTGRES_DATABASE, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: POSTGRES_HOST,
  dialect: "postgres",
  dialectModule: require("pg"),
  define: {
    freezeTableName: true,
    timestamps: true,
  },
  logging: false,
});

module.exports = { sequelize };


// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
//   host: DB_HOST,
//   dialect: "postgres",
//   dialectModule: require("pg"),
//   define: {
//     freezeTableName: true,
//     timestamps: true,
//   },
//   logging: false,
// });

// module.exports = { sequelize };
