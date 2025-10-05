import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

const STRIPE_SECRET_KEY="sk_test_51RuQBTQax25UF8fadGttQNE77Ksm1gVIfFtxoB2xCw6UZCrIKvD5ZIZ4CZrce00McCdtBRVvoe89fgVPrdckkY4w00wPOtlKSf"
// placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = 'http://localhost:5173';

  try {
    const { userId, items, amount, address } = req.body;

    if (!userId || !items || items.length === 0 || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Save order in DB
    const newOrder = new orderModel({ userId, items, amount, address });
    await newOrder.save();

    // Clear user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Prepare Stripe line items
    const line_items = items.map(item => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // price in paise
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200, // 2 INR = 200 paise
      },
      quantity: 1,
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyOrder = async (req,res)=>{
    const {orderId,success} = req.body;
    try{
        if(success == "true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.json({success:true,message:"Paid"})
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    }catch(error){
        console.log(errr);
        res.json({success:false,message:"Error"})

    }
}

// user order for frontend
const userOrders = async(req,res)=>{
  try{
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true,data:orders})
  }catch(error){
    console.log(error)
    res.json({success:false,message:"Error"})
  }
}

// Listing orders for admin panel

const listOrders = async(req,res)=>{
  try{
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
  }catch(err){
    console.log(err)
    res.json({success:false,message:"Error"});
  }
}

// API for updating order status

const updateStatus = async(req,res)=>{
try{
  await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
  res.json({success:true,message:"Status Updated"});
}catch(err){
  console.log(err)
  res.send({success:false,message:"Error"})
}

}
export { placeOrder ,verifyOrder,userOrders,listOrders,updateStatus};