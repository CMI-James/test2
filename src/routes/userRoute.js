const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/UserController");
const authenticate = require("../middlewares/authenticate");

router.get("/users/:id", authenticate, getUserById);

module.exports = router;
