const ForgetPasswordRequest = require("../models/forgetpasswordrequest");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.sendForm = async (req, res, next) => {
  const uuid = req.params.uuid;
  console.log(uuid);
  const forgetpasswordrequest = await ForgetPasswordRequest.findOne({
    id: uuid,
  });
  console.log(forgetpasswordrequest.isActive);
  if (forgetpasswordrequest.isActive == true) {
    res.send(`<form action="http://localhost:3000/password/resestpassword/${uuid}" method="POST">
    <label for="pass">New Password:</label>
    <input type="text" id="pass" name="pass">
    <button type="submit">Reset</button>`);
  } else {
    res.send(`<h1>Password is already reset</h1>`);
  }
};

exports.updatePassword = async (req, res, next) => {
  const password = req.body.pass;
  const uuid = req.params.uuid;
  console.log(password, uuid, req.body);
  try {
    const forgetpasswordrequest = await ForgetPasswordRequest.findOne({
      id: uuid,
      isActive: true,
    });
    if (forgetpasswordrequest) {
      console.log(forgetpasswordrequest);
      const userid = forgetpasswordrequest.userId;
      console.log(userid);
      const hashedPassword = await bcrypt.hash(password, 10);
      const updatedforgetpasswordrequest =
        await ForgetPasswordRequest.updateOne(
          { id: uuid },
          { $set: { isActive: false } }
        );
      const user = await User.updateOne(
        { _id: userid },
        { $set: { password: hashedPassword } }
      );
      res.status(200).send(`<h1>Password Reset Successfully</h1>`);
    } else {
      return res
        .status(409)
        .json({ message: "Link is already Used Once, Request for new Link!" });
    }
  } catch (err) {
    await t.rollback();
    res.status(403).send(`<h1>Something went wrong</h1>`);
  }
};
