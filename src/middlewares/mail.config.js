const nodemailer = require("nodemailer");
const sendVerificationEmail = async (
  email,
  codeOrToken,
  isVerification = true
) => {
  console.log(`eamil;${email},code>>>>>>>>>>${codeOrToken}`);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  console.log(transporter);

  const subject = isVerification ? "Email Verification" : "Password Reset";
  const html = isVerification;
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: isVerification
      ? `<p>Your verification code is: <strong>${codeOrToken}</strong></p>`
      : `<p>You requested a password reset. Use the following token to reset your password: <strong>${codeOrToken}</strong></p>`,
  };
  console.log(mailOptions);

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
