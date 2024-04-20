import nodemailer from "nodemailer";

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
        console.log("server is ready to take our messages");
    }
    });

export default transport;
