const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const checkToken = (req, res) => {
  res.json(req.exp);
};

const dataController = {
  async index(req, res, next) {
    try {
    } catch (error) {}
  },
  async create(req, res, next) {
    try {
      const user = await User.create(req.body);
      const token = createJWT(user);

      res.locals.data.user = user;
      res.locals.data.token = token;
      next();
    } catch (error) {
      console.log("create User Error:", error);
      res.status(400).json(error);
    }
  },

  async login(req, res, next) {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) throw new Error();
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) throw new Error();
      res.locals.data.user = user;
      res.locals.data.token = createJWT(user);
      next();
    } catch (error) {
      console.log("login error:", error);
      res.status(400).json("Bad Cedentials");
    }
  },
};

const apiController = {
  index(req, res) {
    res.json(res.locals.data.users);
  },
  auth(req, res) {
    res.json(res.locals.data.token);
  },
};
module.exports = { dataController, apiController };
//helper function
function createJWT(user) {
  return jwt.sign({ user }, process.env.Secret, { expiresIn: "24h" });
}
