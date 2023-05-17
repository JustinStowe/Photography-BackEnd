const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../config/ensureLoggedIn");
const {
  checkToken,
  dataController,
  apiController,
} = require("../controllers/userController");

//Post /users/login
router.post("/login", dataController.login, apiController.auth);
//Get /users/checkToken
router.get("/checkToken", ensureLoggedIn, checkToken);

//Post /users
router.post("/", dataController.create, apiController.auth);

//put /users
router.put("/", dataController.editUserData, apiController.auth);

module.exports = router;
