import mongoose from "mongoose";

//Connecting to database

const Connection= async(url)=>{
    try{
        await mongoose.connect(url);
        console.log("DB connected");
    }
    catch(err){
        console.log("Error: ", err.message);
    }
}
export default Connection;