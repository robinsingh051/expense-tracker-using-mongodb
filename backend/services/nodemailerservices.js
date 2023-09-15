const nodemailer = require("nodemailer");

exports.forgetpasswordmail = async (email, uuid) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: true,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
      authMethod: "LOGIN",
    },
  });
  const mailConfirm = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: "Change your password using given link",
    html: `
          <html>
            <head>
            </head>
            <body>
              <p>http://localhost:3000/password/resestpassword/${uuid}</p>
            </body>
          </html>  `,
  };
  try {
    const info = await transporter.sendMail(mailConfirm);
    return info;
  } catch (err) {
    return "";
  }
};
