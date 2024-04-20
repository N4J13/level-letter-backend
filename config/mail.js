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
        console.log(success);
    }
    });

export default transport;
