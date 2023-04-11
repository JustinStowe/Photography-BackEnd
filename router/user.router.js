const express = require("express");
const router = express.Router();
const ensureLoggedIn = require("../config/ensureLoggedIn");
const User = require("../models/user");
//helper function
function createJWT(user) {
  return jwt.sign({ user }, process.env.Secret, { expiresIn: "24h" });
}

//Post /api/users/login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error();
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new Error();
    res.locals.data.user = user;
    res.locals.data.token = createJWT(user);
  } catch (error) {
    console.log("login error:", error);
    res.status(400).json("Bad Cedentials");
  }
});

//Get /api/users/check-token
// router.get("/checkToken", ensureLoggedIn, checkToken);

//Post /api/users
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = createJWT(user);

    res.locals.data.user = user;
    res.locals.data.token = token;
  } catch (error) {
    console.log("create User Error:", error);
    res.status(400).json(error);
  }
});

module.exports = router;
