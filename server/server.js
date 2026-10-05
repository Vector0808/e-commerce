const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
connectDB();


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.get('/', (req, res) => {
  res.send('API is runninggggggggggggggg...'); 
});

app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/products", require("./routes/productroutes"));
app.use("/api/cart", require("./routes/cartroutes"));
app.use("/api/orders", require("./routes/orderroutes"));
app.use("/api/payment", require("./routes/paymentroutes"));
app.use("/api/wishlist", require("./routes/wishlistroutes"));
app.use("/api/", require("./routes/reviewroutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

