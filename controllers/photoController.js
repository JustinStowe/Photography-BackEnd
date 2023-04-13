const cloudinary = require("../utilities/cloudinary");
const upload = require("../utilities/multer");
const User = require("../models/user");
const Photo = require("../models/photo");
const path = require("path");
const dataController = {
  async AllPhotos(req, res, next) {
    try {
      const user = await User.findById(req.user._id).populate("photos");
      console.log("user data @ allPhotos:", user);
      const foundPhotos = user.photos;
      res.locals.data.photos = foundPhotos;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  async onePhoto(req, res, next) {
    const { id } = req.params;
    try {
      const targetPhoto = await Photo.findById(id);
      res.locals.data.photo = targetPhoto;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  async createPhoto(req, res, next) {
    console.log("req.file:", req.file);
    try {
      upload.single("image");
      const result = await cloudinary.uploader.upload(req.file.path);
      let photo = new Photo({
        title: req.body.title,
        date: req.body.date,
        image: result.secure_url,
        cloudinary_id: result.public_id,
        owner: req.user._id,
      });
      await photo.save();
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { photos: photo._id } }
      );
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  async editPhoto(req, res, next) {
    const { id } = req.params;
    try {
      upload.single("image");
      let photo = await Photo.findById(id);
      await cloudinary.uploader.destroy(photo.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path);
      const data = {
        title: req.body.name || photo.name,
        date: req.body.date || photo.date,
        image: req.body.image || photo.image,
        cloudinary_id: result.public_id || photo.cloudinary_id,
      };
      photo = await Photo.findByIdAndUpdate(id, data, {
        new: true,
      });
      res.locals.data.photo = photo;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  async deletePhoto(req, res, next) {
    const { id } = req.params;
    try {
      let photo = await Photo.findById(id);
      await cloudinary.uploader.destroy(photo.cloudinary_id);
      await photo.deleteOne({ id: photo._id });
      res.locals.data.photo = photo;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
};

const apiController = {
  index(req, res) {
    res.json(res.locals.data.photos);
  },
  show(req, res) {
    res.json(res.locals.data.photo);
  },
};

module.exports = {
  dataController,
  apiController,
};
