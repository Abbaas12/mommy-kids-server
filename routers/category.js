const express = require("express");
const router = express.Router();

const { Category } = require("../models/category");

router.get("/", async (req, res) => {
  const categories = await Category.find();
  if (!categories) res.status(404).send("There is no category!");
  res.status(200).send(categories);
});

router.get(`/:id`, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) res.status(404).send("There is no category!");
  res.status(200).send(category);
});

router.post(`/`, async (req, res) => {
  let category = new Category({
    name: req.body.name,
    icon: req.body.icon,
  });
  category = await category.save();
  if (!category) res.status(400).send("The category cannot be created!");
  res.status(200).send(category);
});

router.put(`/:id`, async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      icon: req.body.icon,
    },
    { new: true }
  );
  if (!category) res.status(404).send("Not found!");
  res.status(201).send(category);
});

router.delete(`/:id`, (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((c) => {
      if (!c) res.status(404).send("This category's already deleted!");
      res.status(200).send({ c, message: "successful deletion." });
    })
    .catch((err) => res.send(err));
});

module.exports = router;
