const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");

const authjwt = require("./helpers/authjwt");
const error_handler = require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

require("dotenv/config");
const api = process.env.API_URL;

//Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authjwt());
app.use(error_handler);

//Routers
const brandRouter = require("./routers/brand");
const categoryRouter = require("./routers/category");
const colorRouter = require("./routers/color");
const productRouter = require("./routers/product");
const userRouter = require("./routers/user");
const saleRouter = require("./routers/sale");
const sizeRouter = require("./routers/size");
const typeRouter = require("./routers/type");
const saleItemRouter = require("./routers/saleItem");

app.use(`${api}/brands`, brandRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/colors`, colorRouter);
app.use(`${api}/products`, productRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/sales`, saleRouter);
app.use(`${api}/sizes`, sizeRouter);
app.use(`${api}/types`, typeRouter);
app.use(`${api}/saleItems`, saleItemRouter);

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "e-clothy",
  })
  .then(() => {
    console.log("Database connection is ready....");
  })
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at http://localhost:3000");
});
