const express = require("express");
const app = express();
const { readdirSync } = require("fs");
const path = require("path");
const { sequelize } = require("./src/config/database");
const errorHandlerMiddleware = require("./src/middlewares/error_Handler");

app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));
app.use(express.urlencoded({ extended: false }));

readdirSync("./src/routes").map((routePath) => {
  if (routePath === "auth.route.js") {
    return app.use("/", require(`./src/routes/${routePath}`));
  }
  app.use("/", /* authenticate */ require(`./src/routes/${routePath}`));
});

app.get("/", (req, res) => {
  res.send("Test 99, Let hope this is the last!");
});

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}.`);
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("Error connecting to Database", error);
    });
});

module.exports = app;
