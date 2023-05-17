const cloudinary = require("../utilities/cloudinary");
const User = require("../models/user");
const Photo = require("../models/photo");
const chalk = require("chalk");

const dataController = {
  async allPhotos(req, res, next) {
    try {
      const foundPhotos = await Photo.find({});
      res.locals.data.photos = foundPhotos;
      next();
    } catch (error) {
      console.error(chalk.blue("get all photos error:"), chalk.bold.red(error));
      res.status(500).json({ error });
    }
  },

  async allUsers(req, res, next) {
    try {
      const foundUsers = await User.find({});
      res.locals.data.users = foundUsers;
      next();
    } catch (error) {
      console.error(
        chalk.blue("getting all user's error:"),
        chalk.bold.red(error)
      );
      res.status(500).json({ error });
    }
  },
  async oneUser(req, res, next) {
    try {
      const targetUser = await User.findById(id);
      res.locals.user = targetUser;
      next();
    } catch (error) {
      console.error(chalk.blue("get one user error:"), chalk.bold.red(error));
      res.status(500).json({ error });
    }
  },
  async onePhoto(req, res, next) {
    try {
      const targetPhoto = await Photo.findById(id);
      res.locals.photo = targetPhoto;
      next();
    } catch (error) {
      console.error(chalk.blue("get one photo error:"), chalk.bold.red(error));
      res.status(500).json({ error });
    }
  },
  async editUserPhotos(req, res, next) {
    try {
      const targetUser = User.findById(id).populate("photos");
    } catch (error) {}
  },
};
