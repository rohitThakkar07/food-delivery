import foodModel from "../models/foodModel.js";
import fs from "fs";


// add food item
const addFood = async(req,res)=>{
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:image_filename,
        category:req.body.category,
    })

    try{
        await food.save();
        res.json({success:true,message:"Food Added Successfully"});
    }catch(err){
        console.log(err);
        res.json({success:false,message:"Error in adding food item"});
    }
}

//  all food list
const listFood = async(req,res)=>{
    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods});
    }catch(err){
        console.log(err)
        res.json({success:false,message:"Error in fetching food items"});
    }
}


// remove food item
const removeFood = async(req,res)=>{
    try{
        const food = await foodModel.findById(req.params.id);
        fs.unlink(`uploads/${food.image}`,()=>{});

        await foodModel.findByIdAndDelete(req.params.id);
        res.json({success:true,message:"Food Item Deleted Successfully"});
    }catch(err){
        console.log(err)
        return res.json({success:false,message:"Error in finding food item"});
    }
}
export {addFood,listFood,removeFood};