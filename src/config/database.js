const { Sequelize } = require("sequelize");
require("dotenv").config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
  dialectModule: require("pg"),
  define: {
    freezeTableName: true,
    timestamps: true,
  },
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // set to true if you have a valid CA certificate
    },
  },
});

module.exports = { sequelize };
