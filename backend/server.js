import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/food.Route.js';
import userRouter from './routes/user.Route.js';
import 'dotenv/config';
import cartRouter from './routes/cart.Route.js';
import orderRouter from './routes/order.Route.js';

const app = express();
const port = process.env.PORT || 3000;

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // parses JSON
app.use(express.urlencoded({ extended: true })); // parses form data

// ✅ DB connection
connectDB();

// ✅ Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use('/images', express.static('uploads'));
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter)

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => {
  console.log(`listening on localhost:${port}`);
});