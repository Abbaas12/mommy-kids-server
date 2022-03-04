const express = require("express");
const router = express.Router();

const { Size } = require("../models/size");

router.get("/", async (req, res) => {
  const sizes = await Size.find();
  if (!sizes) res.status(404).send("There is no item!");
  res.status(200).send(sizes);
});

router.get(`/:id`, async (req, res) => {
  const size = await Size.findById(req.params.id);
  if (!size) res.status(404).send("There is no item!");
  res.status(200).send(size);
});

router.post(`/`, async (req, res) => {
  let size = new Size({
    name: req.body.name,
  });
  size = await size.save();
  if (!size) res.status(400).send("The item cannot be created!");
  res.status(200).send(size);
});

router.put(`/:id`, async (req, res) => {
  const size = await Size.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!size) res.status(404).send("Not found!");
  res.status(201).send(size);
});

router.delete(`/:id`, (req, res) => {
  Size.findByIdAndRemove(req.params.id)
    .then((s) => {
      if (!s) res.status(404).send("Item's already deleted!");
      res.status(200).send({ s, message: "successful deletion." });
    })
    .catch((err) => res.send(err));
});

module.exports = router;
