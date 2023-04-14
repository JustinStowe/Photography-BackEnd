const express = require("express");
const router = express.Router();
const {
  dataController,
  apiController,
} = require("../controllers/photoController");
const ensureLoggedIn = require("../config/ensureLoggedIn");
//index
router.get("/", dataController.AllPhotos, apiController.index);
//Show
router.get("/:id", dataController.onePhoto, apiController.show);
//Create
router.post("/", dataController.createPhotos, apiController.show);
//Update
router.put("/:id", dataController.editPhoto, apiController.show);
//Delete
router.delete("/:id", dataController.deletePhoto, apiController.show);

module.exports = router;
