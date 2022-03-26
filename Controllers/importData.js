import mongoose from "mongoose";
import schema from "../database/schema.js";
import fs from "fs";
import { Parser } from "json2csv";
import converter from "json-2-csv";
import runModel from "./runModel.js";

const DeviceRecord = mongoose.model("DeviceRecord", schema.deviceRecords);

export default function importData(req, res) {
  const deviceId = req.body.DeviceId;
  const today=new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ':' + (today.getMinutes() + 1) + ':' + today.getSeconds();
  // console.log(date,"  ",time);
  DeviceRecord.findOne({ deviceId: deviceId }, function (err, foundDevice) {
    if (!err) {
      if (foundDevice) {
        const start = foundDevice.first;
        const end = foundDevice.last;
        var startIndex, endIndex;
        // console.log(foundDevice.samples);
        // DeviceRecord.find({
        //     "deviceId": deviceId,
        //     "samples.timeVal" : { $lte: '1645008942682'}
        // }, function(err, test){
        //     console.log(test.length);
        //     for(var i=0; i<test.length; i++){
        //         console.log(test[i]);
        //     }
        // });
        const dataArray = foundDevice.samples;
        dataArray.forEach((dataSet, index) => {
          if (dataSet.timeVal === start) {
            //console.log(index);
            startIndex = index;
          }
          if (dataSet.timeVal === end) {
            //console.log(index);
            endIndex = index;
          }
        });
        var requiredDataArray = [];
        for (var i = startIndex; i <= endIndex; i++)
          requiredDataArray.push(dataArray[i]);

        //console.log(requiredDataArray.length);
        converter.json2csv(requiredDataArray, (err, csv) => {
          
          if (err) console.log(err);
          else {
            fs.writeFile(`downloads/${deviceId}::${date}(${time}).csv`, csv, (err) => {
              if (err) console.log(err);
              else {
                console.log("The file has been saved!");
                // runModel("send file");
                res.status(200).send();
              }
            });
          }
        });
        //console.log(csv);
      } else {
        console.log("device not found");
        res.status(400).send();
      }
    } else {
      console.log(err);
      res.status(400).send();
    }
  });
}
