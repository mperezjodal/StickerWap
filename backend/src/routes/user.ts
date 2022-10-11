import express from "express";
import mongoose from "mongoose";

const User = require("../models/user");
import auth from "../middleware/auth";
const router = express.Router();

router.post("/signup", async function (req, res) {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.region
  ) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const user = new User(req.body);
    user._id = new mongoose.Types.ObjectId();
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send(
      res.send({
        id: user._id,
        name: user.name,
        email: user.email,
        region: user.region,
        token: token,
      })
    );
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({
      id: user._id,
      name: user.name,
      email: user.email,
      region: user.region,
      token: token,
    });
  } catch (e) {
    res.status(400).send();
  }
});

router.post("/logout", auth, async (req: any, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/me", auth, async (req: any, res) => {
  try {
    const user = req.user;
    res.send({
      id: user._id,
      name: user.name,
      email: user.email,
      region: user.region,
    });
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
