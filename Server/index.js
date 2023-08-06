const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const productRoute = require("./routes/product");
// const cartRoute = require("./routes/cart");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRouts");
const addressRoutes = require("./routes/addressRoute");
const wishlistRoutes = require("./routes/wishlistRouts");
const reviewRoutes = require("./routes/reviewRoute");
const protectedRoute = require("./routes/protected");
const userRoutes = require("./routes/userRoute");
const categoryRoutes = require("./routes/categoryRoute");
const paymentRoutes = require("./routes/payments.js");
const ordersRoutes = require("./routes/orderRoutes");
const brantRoutes = require("./routes/BrandRoutes");
const cors = require("cors");

const app = express();
const PORT = 8080;

dotenv.config();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((err) => console.log(err));

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(
  cors()
  // cors({
  //   origin: "*",
  // })
);

app.use(express.json());
app.use("/api/products", productRoute);
// app.use("/api/carts", cartRoute);
app.use("/api/carts", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/protected", protectedRoute);
app.use("/api/user", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/order", ordersRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/brand", brantRoutes);
app.listen(process.env.PORT || 8080, () => {
  console.log("backend server listening on port " + PORT);
});
