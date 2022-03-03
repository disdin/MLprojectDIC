// Node.js is calling pyScript.py file using child processes
import spawn from "child_process"
import { response } from "express";
import mongoose from "mongoose";
import schema from "../database/schema.js";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

var responseCode= null;

const MLOutput = mongoose.model("MLOutput", schema.ML_Output);

export default function runModel(file) {
    // const py=spawn('python3',['pyScript.py',file]);
    // py.stdout.on('data',(data)=>{
    //     console.log("output received");
    // })
    // py.on('close',(code)=>{
    //     console.log(`child process exited with code ${code}`);
    // })


        // Creating dummy output accuracy variable
        const outputAcc1 = 95;
        const outputAcc2 = 85;
        // Creating dummy output data
        const dummyOutput = {
            "deviceId" : "m19UlmOFZEa",
            "time" : "2016-05-18T16:00:00Z",
            "dataRange" : {
                "start": 12345,
                "end": 123456
            },
            "file": {
                "url": "dummy",
                "name": "dummy",
                "version": "dummy",
                "type": "dummy"
            },
            "errorRate": "dummy",
            "accuracy": "dummy"
        };
        
        accuracyFunction(outputAcc1, dummyOutput);
        
};

function accuracyFunction(accuracy, outData){
    
    if(accuracy > 90){
        MLOutput.create(outData, function(err){
            if(err){
                 console.log("Document Insertion unsuccessful" + err);
                 responseCode = 400;
                 return responseCode;
            }
            else {
                 console.log("Document Inserted Successfully.");
                 responseCode = 200;
                 return responseCode;
            }
        } );
        
    }
    if(accuracy <= 90){
                let transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'dicprojectforestapp@gmail.com',
                pass: 'dic12345'
            }
       }));
       const mailOptions = {
        from: 'dicprojectforestapp@gmail.com',
        to: 'jaiswalpiyushaerospacex@gmail.com',
        subject: '⚠ Alert: Model accuracy below 90%',
        html: '<h1>Hi, We noticed that the output of your model is giving accuracy less than 90%. Please update .ipy file after tuning and validation.</h1>'
   };
   transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log("‘Email sent: ‘" + info.response);
    }
});
    }
    
}
