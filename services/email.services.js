import transport from "../config/mail.js";
import User from "../models/user.model.js";

export const sendVerificationEmail = (to, token) => {
  const mailOptions = {
    from: "levelletter@gmail.com",
    to,
    subject: "Email Verification",
    html: `<p>Click <a href="https://level-letter.vercel.app/verify?token=${token}">here</a> to verify your email.</p>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent");
    }
  });
};


export const sendForgotPasswordEmail = (to, token) => {
  const mailOptions = {
    from: "levelletter@gmail.com",
    to,
    subject: "Reset Password",
    html: `<p>Click <a href="http://localhost:3333/reset-password?token=${token}">here</a> to reset your password.</p>`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent");
    }
  });

};

export const verifyEmailService = async (token) => {
  const user = await User.findOne({ verificationToken: token });
  if (user) {
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return user;
  } else return null;
};

