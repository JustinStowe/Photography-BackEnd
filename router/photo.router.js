const express = require("express");
const router = express.Router();
const cloudinary = require("../utilities/cloudinary");
const upload = require("../utilities/multer");
const User = require("../models/user");
const Photo = require("../models/photo");

//index
router.get("/", async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      const foundPhotos = user.photos;
      res.locals.data.photos = foundPhotos;
    } else {
      const defaultPhotos = Photo.find({});
      res.locals.data.photos = defaultPhotos;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});
//Show
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const targetPhoto = await Photo.findById(id);
    res.locals.data.photo = targetPhoto;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});
//Create
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    let photo = new Photo({
      title: req.body.title,
      date: req.body.date,
      image: result.secure_url,
      cloudinary_id: result.public_id,
      owner: req.user._id,
    });
    await photo.save();
    if (req.user) {
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { photos: photo._id } }
      );
    }
    res.locals.data.photo = newPhoto;
    res.status(200).send({ photo });
  } catch (error) {
    console.error(error);
  }
});
//Update
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  try {
    let photo = await Photo.findById(id);
    await cloudinary_js_config.uploader.destroy(photo.cloudinary_id);
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
    res.json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});
//Delete
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let photo = await Photo.findById(id);
    await cloudinary.uploader.destroy(photo.cloudinary_id);
    await photo.remove();
    res.json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
});

module.exports = router;
