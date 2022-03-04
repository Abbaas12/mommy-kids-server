const express = require("express");
const router = express.Router();

const { Brand } = require("../models/brand");

router.get("/", async (req, res) => {
  const brandList = await Brand.find();
  if (!brandList) res.status(404).send("There is no item!");
  res.status(200).send(brandList);
});

router.get(`/:id`, async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) res.status(404).send("There is no item!");
  res.status(200).send(brand);
});

router.post(`/`, async (req, res) => {
  let brand = new Brand({
    name: req.body.name,
  });
  brand = await brand.save();
  if (!brand) res.status(400).send("The item cannot be created!");
  res.status(200).send(brand);
});

router.put(`/:id`, async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  if (!brand) res.status(404).send("Not found!");
  res.status(201).send(brand);
});

router.delete(`/:id`, (req, res) => {
  Brand.findByIdAndRemove(req.params.id)
    .then((b) => {
      if (!b) res.status(404).send("Item's already deleted!");
      res.status(200).send({ b, message: "successful deletion." });
    })
    .catch((err) => res.send(err));
});

module.exports = router;
