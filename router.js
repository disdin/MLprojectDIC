
// importing required modules
import express from "express";
import importData from "./Controllers/importData.js";
import signin from "./Controllers/signin.js";


const router=express.Router();

router.get("/",(req,res)=>{
    console.log(`ok... ${process.pid}`);
    res.send(`ok... ${process.pid}`);
    // cluster.worker.kill();
})

// declaring routes
router.post("/signin", signin);
router.post("/importData", importData);

export {router};