import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/food.Route.js';
import userRouter from './routes/user.Route.js';
import cartRouter from './routes/cart.Route.js';
import orderRouter from './routes/order.Route.js';

const JWT_SECRET="jwt_secret"
const app = express();
const PORT = 4000 || 3000;

// ✅ Middlewares
app.use(cors());
app.use(express.json()); 
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

app.listen(PORT, () => {
  console.log(`listening on localhost:${PORT}`);
});