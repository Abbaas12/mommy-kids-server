const express = require("express");
const router = express.Router();

const { Color } = require("../models/color");

router.get("/", async (req, res) => {
  const colors = await Color.find();
  if (!colors) res.status(404).send("There is no item!");
  res.status(200).send(colors);
});

router.get(`/:id`, async (req, res) => {
  const color = await Color.findById(req.params.id);
  if (!color) res.status(404).send("There is no item!");
  res.status(200).send(color);
});

router.post(`/`, async (req, res) => {
  let color = new Color({
    name: req.body.name,
  });
  color = await color.save();
  if (!color) res.status(400).send("The item cannot be created!");
  res.status(200).send(color);
});

router.put(`/:id`, async (req, res) => {
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!color) res.status(404).send("Not found!");
  res.status(201).send(color);
});

router.delete(`/:id`, (req, res) => {
  Color.findByIdAndRemove(req.params.id)
    .then((c) => {
      if (!c) res.status(404).send("Item's already deleted!");
      res.status(200).send({ c, message: "successful deletion." });
    })
    .catch((err) => res.send(err));
});

module.exports = router;
