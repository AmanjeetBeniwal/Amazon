const nodemailer = require("nodemailer");

const sendVerificationEmail = async (email, codeOrToken=null, orderDetails = null, type) => {
  console.log(`Email: ${email}, Code: ${codeOrToken}, type:>>>>${type}`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // Fixed casing to match your environment variable
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let subject;
  let html;

  switch (type) {
    case "verification":
      subject = "Email Verification";
      html = `<p>Your verification code is: <strong>${codeOrToken}</strong></p>`;
      break;

    case "passwordReset": // Removed leading space in type
      subject = "Password Reset Token";
      html = `<p>You requested a password reset. Use the following token to reset your password: <strong>${codeOrToken}</strong></p>`;
      break;

    case "orderConfirmation":
      subject = "Order Confirmation";
      html = `
        <h1>Your Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Order details:</p>
        <ul>
          ${orderDetails.map(item => `
            <li>${item.name}: $${item.price} (Quantity: ${item.quantity})</li>
          `).join("")}
        </ul>
        <p>Total: $${orderDetails.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
        <p>We appreciate your shopping!</p>
      `;
      break;

    default:
      throw new Error("Invalid email type");
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: html,
  };

  console.log(mailOptions);

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
 