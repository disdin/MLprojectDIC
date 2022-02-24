import mongoose from "mongoose";

// Defining schemas 

var Schema = mongoose.Schema;

var userSchema = new Schema({
  Username: String,
  Password: String,
  Email: String
});

export default userSchema;