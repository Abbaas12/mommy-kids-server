const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const { Brand } = require("../models/brand");
const { Category } = require("../models/category");
const { Color } = require("../models/color");
const { Product } = require("../models/product");
const { Size } = require("../models/size");
const { Type } = require("../models/type");
const filters = require("./query/filters");

cloudinary.config({
  cloud_name: "dgr6rk06b",
  api_key: "841169737561656",
  api_secret: "1im0N0naOYCAbUUQpla6uE-KPlM",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

const uploadOption = multer({ storage });

router.get("/", async (req, res) => {
  let { brands, categories, colors, sizes, types, dates, secondDate } =
    req.query;

  const filter = filters(
    dates,
    secondDate,
    brands,
    categories,
    colors,
    sizes,
    types
  );

  const productList = await Product.find(filter)
    .sort({ date: -1 })
    .populate("category brand color size type");
  if (!productList) res.status(404).send("There is no product!");
  res.status(200).send(productList);
});

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category brand color size type",
    "-_id"
  );
  if (!product) res.status(404).send("Not Found!");
  res.send(product);
});

router.get(`/get/count`, async (req, res) => {
  let { brands, categories, colors, sizes, types, dates, secondDate } =
    req.query;
  const filter = filters(
    brands,
    categories,
    colors,
    sizes,
    types,
    dates,
    secondDate
  );

  const product = await Product.find(filter).countDocuments();
  if (!product) res.send("There is no product!");
  res.send({ product });
});

router.post(`/`, uploadOption.single("image"), async (req, res) => {
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return res.status(400).send("Invalid brand!");

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category!");

  const color = await Color.findById(req.body.color);
  if (!color) return res.status(400).send("Invalid color!");

  const size = await Size.findById(req.body.size);
  if (!size) return res.status(400).send("Invalid size!");

  const type = await Type.findById(req.body.type);
  if (!type) return res.status(400).send("Invalid type!");

  const file = req.file;
  if (!file) res.send("No image is requested!");

  let product = new Product({
    name: req.body.name,
    image: req.file.path,
    brand: req.body.brand,
    category: req.body.category,
    size: req.body.size,
    color: req.body.color,
    stock: req.body.stock,
    originalPrice: req.body.originalPrice,
    type: req.body.type,
  });
  product = await product.save();
  if (!product) res.status(400).send("Product cannot be created!");
  res.status(201).send(product);
});

router.put(`/:id`, uploadOption.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    res.status(400).send("Invalid id!");

  const brand = await Brand.findById(req.body.brand);
  if (!brand) return res.status(400).send("Invalid brand!");

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category!");

  const color = await Color.findById(req.body.color);
  if (!color) return res.status(400).send("Invalid color!");

  const size = await Size.findById(req.body.size);
  if (!size) return res.status(400).send("Invalid size!");

  const type = await Type.findById(req.body.type);
  if (!type) return res.status(400).send("Invalid type!");

  const product = await Product.findById(req.params.id);
  if (!product) res.status(404).send("Not Found!");

  const productUpdated = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      size: req.body.size,
      color: req.body.color,
      stock: req.body.stock,
      originalPrice: req.body.originalPrice,
      type: req.body.type,
    },
    { new: true }
  );

  if (!productUpdated) res.status(400).send("Updating Product is fail!");
  res.send(productUpdated);
});

//update image
router.put(`/image/:id`, uploadOption.single("image"), async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) res.status(404).send("Not Found!");

  const file = req.file;
  let imagePath;
  if (file) {
    const filename = file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagePath = `${basePath}${filename}`;
  } else {
    imagePath = product.image;
  }

  const imageUpdated = await Product.findByIdAndUpdate(
    req.params.id,
    {
      image: imagePath,
    },
    { new: true }
  ).populate("category brand color size type");
  if (!imageUpdated) res.status(400).send("Updating Product is fail!");
  res.send(imageUpdated);
});

router.delete(`/:id`, (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((p) => {
      if (!p) res.status(400).send("Product Not Found!");
      res.send({ p, message: "Successfully deleted.." });
    })
    .catch((err) => res.send(err));
});

module.exports = router;
