const express = require("express");
const router = express.Router();

const { Product } = require("../models/product");
const { Sale } = require("../models/sale");
const { SaleItem } = require("../models/saleItem");
const filters = require("./query/filters");

router.get("/", async (req, res) => {
  const { dates, secondDate } = req.query;

  const filter = filters(dates, secondDate);
  const saleItem = await Sale.find(filter)
    .sort({ date: -1 })
    .populate("saleItem product");
  if (!saleItem) res.status(404).send("There is no item!");
  res.status(200).send(saleItem);
});

router.get(`/:id`, async (req, res) => {
  const sale = await Sale.findById(req.params.id)
    .populate({
      path: "saleItem",
      populate: { path: "product", populate: "brand category color size type" },
    })
    .populate("saleItem");
  if (!sale) res.status(404).send(sale);
  res.status(200).send(sale);
});

router.post(`/`, async (req, res) => {
  //saleItemId
  // const resultSaleItemId = await saleItemId(req);
  const resultSaleItemId = await SaleItem.findById(req.body.saleItem).populate(
    "product"
  );
  if (!resultSaleItemId) return res.status(400).send("Invalid SaleItem Id!");

  //stock updated
  await stockUpdated(resultSaleItemId);

  //totalPrice
  const totalPrice = await totalPrices(resultSaleItemId);

  //Profit
  const finalProfit = await profits(resultSaleItemId, req);

  let saleItem = new Sale({
    customerName: req.body.customerName,
    saleItem: resultSaleItemId,
    product: resultSaleItemId.product,
    adsFee: req.body.adsFee,
    total: totalPrice,
    profit: finalProfit,
  });

  saleItem = await saleItem.save();
  if (!saleItem) res.status(400).send("Something Wrong!");
  res.status(200).send(saleItem);
});

router.put(`/:id`, async (req, res) => {
  const saleItem = await Sale.findByIdAndUpdate(req.params.id, {
    customerName: req.body.customerName,
  });
  if (!saleItem) res.status(400).send("Updation failed!");
  res.send(saleItem);
});

router.delete(`/:id`, (req, res) => {
  Sale.findByIdAndRemove(req.params.id)
    .then((s) => {
      if (!s) res.status(404).send("Not Found!");
      res.send({ s, message: "Successful deletion!" });
    })
    .catch((err) => res.send(err));
});

module.exports = router;

//totalPrices
async function totalPrices(resultSaleItemId) {
  const saleItem = await SaleItem.findById(resultSaleItemId);
  const totalPrice = saleItem.salePrice * saleItem.quantity;

  return totalPrice;
}

//StockUpdated
async function stockUpdated(resultSaleItemId) {
  const saleItem = await SaleItem.findById(resultSaleItemId)
    .select("quantity")
    .populate("product", "stock");

  const quantities = saleItem.product.stock - saleItem.quantity;
  const updatedProduct = await Product.findByIdAndUpdate(saleItem.product, {
    stock: quantities,
  });
  return updatedProduct;
}

//Profits
async function profits(resultSaleItemId, req) {
  const saleItem = await SaleItem.findById(resultSaleItemId).populate(
    "product",
    "originalPrice"
  );
  const profit =
    (saleItem.salePrice - saleItem.product.originalPrice) * saleItem.quantity;

  // const profit = profits.reduce((a, b) => a + b, 0);
  const finalProfit = profit - req.body.adsFee;
  return finalProfit;
}
