const Photo = require("../models/photo");
const User = require("../models/user");
const cloudinary = require("../utilities/cloudinary");
const upload = require("../utilities/multer");
const path = require("path");
const dataController = {
  //Index
  async Index(req, res, next) {
    try {
      const user = await User.findById(req.user._id).populate("photos");
      if (user) {
        const foundPhotos = user.photos;
        res.locals.data.photos = foundPhotos;
      } else {
        res.status(400).json("User Not Found");
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  //Show
  async Show(req, res, next) {
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
  //Create
  async Create(req, res, next) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const newPhoto = await Photo.create({
        title: req.body.title,
        date: req.body.date,
        image: result.secure_url,
        cloudinary_id: result.public_id,
        owner: req.user._id || null,
      });
      if (req.user) {
        await User.findOneAndUpdate(
          { _id: req.user._id },
          { $push: { photos: newPhoto._id } }
        );
      }
      res.locals.data.photo = newPhoto;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  //Update
  async Update(req, res, next) {
    const { id } = req.params;
    try {
      let updatedPhoto = await Photo.findById(id);
      await cloudinary.uploader.destroy(updatedPhoto.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path);
      const data = {
        name: req.body.name || updatedPhoto.name,
        date: req.body.date || updatedPhoto.date,
        image: result.secure_url || updatedPhoto.image,
        cloudinary_id: result.public_id || updatedPhoto.cloudinary_id,
      };
      updatedPhoto = await Photo.findByIdAndUpdate(id, data, { new: true });
      res.locals.data.photo = updatedPhoto;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  async Delete(req, res, next) {
    const { id } = req.params;
    try {
      const deletedPhoto = await Photo.findById({ _id: id });
      await cloudinary.uploader.destroy(deletedPhoto.cloudinary_id);
      res.locals.data.photo = deletedPhoto;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
};

const apiController = {
  Index(req, res, next) {
    res.json(res.locals.data.photos);
  },
  Show(req, res, next) {
    res.json(res.locals.data.photo);
  },
};

module.exports = { dataController, apiController };
