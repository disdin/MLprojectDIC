
// importing required modules
import express from "express";
import signin from "./Controllers/signin.js";


const router=express.Router();


router.get("/",(req,res)=>{
    console.log(`ok... ${process.pid}`);
    res.send(`ok... ${process.pid}`);
    // cluster.worker.kill();
})

// declaring routes
router.post("/signin", signin);

export {router};