const express = require("express");
const router = express.Router();

const { SaleItem } = require("../models/saleItem");
const { Product } = require("../models/product");

router.get(`/`, async (req, res) => {
  const saleItem = await SaleItem.find().populate("product");
  if (!saleItem) res.status(404).send("Not Found");
  res.status(201).send(saleItem);
});

router.get(`/:id`, async (req, res) => {
  const saleItem = await SaleItem.findById(req.params.id).populate("product");
  if (!saleItem) res.status(404).send("Not Found");
  res.status(201).send(saleItem);
});

router.post(`/`, async (req, res) => {
  const product = await Product.findById(req.body.product);
  if (!product) return res.status(400).send("Invalid Product Id!");

  let saleItem = new SaleItem({
    product: req.body.product,
    quantity: req.body.quantity,
    salePrice: req.body.salePrice,
    salename: product.name,
  });
  saleItem = await saleItem.save();
  if (!saleItem) res.status(400).send("Something Wrong!");
  res.status(200).send(saleItem);
});

router.delete(`/:id`, (req, res) => {
  SaleItem.findByIdAndRemove(req.params.id)
    .then((s) => {
      if (!s) res.status(404).send("Not Found!");
      res.send({ s, message: "Successful deletion!" });
    })
    .catch((err) => res.send(err));
});

module.exports = router;
