const express = require("express");
const router = express.Router();

const { Type } = require("../models/type");

router.get("/", async (req, res) => {
  const types = await Type.find();
  if (!types) res.status(404).send("There is no item!");
  res.status(200).send(types);
});

router.get(`/:id`, async (req, res) => {
  const type = await Type.findById(req.params.id);
  if (!type) res.status(404).send("There is no item!");
  res.status(200).send(type);
});

router.post(`/`, async (req, res) => {
  let type = new Type({
    name: req.body.name,
  });
  type = await type.save();
  if (!type) res.status(400).send("The item cannot be created!");
  res.status(200).send(type);
});

router.put(`/:id`, async (req, res) => {
  const type = await Type.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!type) res.status(404).send("Not found!");
  res.status(201).send(type);
});

router.delete(`/:id`, (req, res) => {
  Type.findByIdAndRemove(req.params.id)
    .then((t) => {
      if (!t) res.status(404).send("Item's already deleted!");
      res.status(200).send({ t, message: "successful deletion." });
    })
    .catch((err) => res.send(err));
});

module.exports = router;
