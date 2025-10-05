import userModel from '../models/userModel.js'

// add items to user cart
const addToCart = async(req,res)=>{
    try{
        let userData = await userModel.findById(req.body.userId)
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId]){
            cartData[req.body.itemId] = 1
        }else{
            cartData[req.body.itemId] += 1
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Added To Cart"});
    }catch(err){
        console.log(err);
        res.json({success:false,message:"Error"})
        
    }
}


// remove items from user cart
const removeFromCart = async(req,res)=>{
    console.log(req.body)
    try{
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -=1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Removed From Cart"});
    }catch(err){
        console.log(err)
                res.json({success:false,message:"Error"});

    }
}

// fetchuser cart data
const getCart = async(req,res)=>{
    console.log(req.body.userId)
    try{
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        res.json({success:true,cartData})
    }catch(err){
        console.log(err)
        res.json({success:false,message:"Error"})

    }
}

export {addToCart,removeFromCart,getCart}