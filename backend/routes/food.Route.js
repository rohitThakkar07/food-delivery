import express from "express";
import { addFood, listFood, removeFood } from "../controllers/food.Controller.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storege Engine

const storage = multer.diskStorage({
    destination:"uploads/",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage});

foodRouter.post('/add',upload.single("image"),addFood);
foodRouter.get('/list',listFood)
foodRouter.post('/remove/:id',removeFood)

export default foodRouter;