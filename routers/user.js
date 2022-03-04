const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get(`/`, async (req, res) => {
  const user = await User.find().select("-password");
  if (!user) res.status(404).send("Not Found!");
  res.send(user);
});

router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) res.status(404).send("Not Found!");
  res.status(200).send(user);
});

router.post(`/`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 10),
    isAdmin: req.body.isAdmin,
  });

  user = await user.save();
  if (!user) res.status(500).send("User cannot be created!");
  res.status(200).send(user);
});

router.post(`/login`, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if (!user) {
    return res.status(404).send("Not Found!");
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
        name: user.name,
        email: user.email,
      },
      secret
    );

    return res.status(201).send({ email: user.email, token });
  } else {
    return res.status(400).send("Password is wrong!");
  }
});

router.post(`/register`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  user = await user.save();
  if (!user) res.status(500).send("User cannot be created!");
  res.status(200).send(user);
});

router.delete(`/:id`, (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((s) => {
      if (!s) res.status(404).send("Not Found!");
      res.send({ s, message: "Successful deletion!" });
    })
    .catch((err) => res.send(err));
});

module.exports = router;
