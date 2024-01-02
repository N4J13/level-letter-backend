import nodemailer from "nodemailer";
import User from "../models/user.js";

export const sendEmail = (to, token) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "levelletter@gmail.com",
      pass: "irimtnzgixwgqwds",
    },
  });

  transport.verify(function (err, success) {
    if (err) {
      console.log(err);
    } else {
      console.log("All set");
    }
  });

  const mailOptions = {
    from: "levelletter@gmail.com",
    to,
    subject: "Email Verification",
    html: `<p>Click <a href="http://your-app.com/verify/${token}">here</a> to verify your email.</p>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent");
    }
  });
};

export const verifyEmail = async (token) => {
  const user = await User.findOne({ verificationToken: token });
  if (user) {
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return user;
  } else return null;
};
