const ForgetPasswordRequest = require("../models/forgetpasswordrequest");
const User = require("../models/user");
const sequelize = require("../util/database");
const bcrypt = require("bcrypt");

exports.sendForm = async (req, res, next) => {
  const uuid = req.params.uuid;
  console.log(uuid);
  const forgetpasswordrequest = await ForgetPasswordRequest.findByPk(uuid);
  if (forgetpasswordrequest.isactive === true) {
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
  const t = await sequelize.transaction();
  try {
    const forgetpasswordrequest = await ForgetPasswordRequest.findOne({
      where: { id: uuid },
    });
    forgetpasswordrequest.isactive = false;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userid = forgetpasswordrequest.userId;
    const user = await User.findOne({ where: { id: userid } });
    user.password = hashedPassword;
    await user.save({ transaction: t });
    await forgetpasswordrequest.save({ transaction: t });
    await t.commit();
    res.status(200).send(`<h1>Password Reset Successfully</h1>`);
  } catch (err) {
    await t.rollback();
    res.status(403).send(`<h1>Something went wrong</h1>`);
  }
};
