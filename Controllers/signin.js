import mongoose from "mongoose";
import bcrypt from "bcrypt";
import schema from "../database/schema.js";

const User = mongoose.model("User", schema);

function signin(req, res) {
  const { Username, Password, Email } = req.body;
  User.findOne({ Username: Username }, async (err, user) => {
    if (err) console.log("Error (signin): ", err);
    if (user) {
        if (Password === user.Password) {
            res.status(200).send("Sign in Success!");
          }
        else {
          res.status(401).send({ message: "Password didn't match" });
        }


    //   bcrypt.compare(Password, user.Password, function (err, result) {
    //     if (err) console.log("Error (signin bcrypt): ", err);
    //     if (result == true) {
    //       res.status(200).send("Sign in Success!");
    //     }
    //     if (Password === user.Password) {
    //         res.status(200).send("Sign in Success!");
    //       }
    //     else {
    //       res.status(401).send({ message: "Password didn't match" });
    //     }

    //   });


    } else {
      res.status(401).send({ message: "User not registered" });
    }
  });
};
export default signin;
