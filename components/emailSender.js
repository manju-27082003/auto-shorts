require("dotenv").config();
const nodemailer = require("nodemailer");
async function emailSender(text, subject = "Error in Auto-Post") {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "your.email@example.com",
        pass: process.env.GMAIL_APP_PASSWORD, // use app password, not your Gmail password
      },
    });

    const mailOptions = {
      from: "your.email@example.com",
      to: "your.email@example.com",
      subject: subject,
      text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error sending email:", error);
      }
      console.log("Email sent:", info.response);
    });
  } catch (error) {
    console.log(error);
  }
}
module.exports = emailSender;
