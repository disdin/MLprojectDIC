import mongoose from "mongoose";

// Defining schemas 

var Schema = mongoose.Schema;

var userSchema = new Schema({
  Username: String,
  Password: String,
  Email: String
});

var deviceRecords = new Schema({
  deviceId: String,
  first: Number,
  last: Number,
  nsamples: Number,
  samples: [
    {
      data: {
        tempVal: {
          name: String,
          unit: String,
          value: String
        }, 
        vibrationVal: {
          xaxisVal: mongoose.Decimal128,
          yaxisVal: mongoose.Decimal128,
          zaxisVal: mongoose.Decimal128
        },
        batteryVal: {
          name: String,
          unit: String,
          value: Number
        },
        powerVal: {
          name: String,
          unit: String,
          value: Number
        }
      },
      timeVal: Number
    }
  ],
});
var ML_Output=new Schema({
  deviceId: String,
  time:Date,
  dataRange:{
    start:Number,
    end:Number
  },
  file:{
    url:String,
    name:String,
    version:String,
    type:String
  },
  errorRate:String,
  accuracy: String  
},
{ typeKey: '$type' });

export default {
  deviceRecords,
  userSchema,
  ML_Output
};
