// // const nodemailer = require('nodemailer');
// // const crypto = require('crypto');

// // // Use your actual email and password or app password directly for testing
// // const email = 'amanjeetbeniwal22@gmail.com'; // Your Gmail email address
// // const password = "fhkg blim fdpi sqcw"; // Replace with your App Password
// // console.log(password,'herePass======>>>>>>>')

// // // Create a transporter object using SMTP transport
// // const transporter = nodemailer.createTransport({
// //   service: 'gmail', // Use 'gmail' (case-sensitive) as the service
// //   auth: {
// //     user: email,
// //     pass: password,
// //   },
// // });

// // // Generate a random token for email verification
// // function generateVerificationToken() {
// //   return crypto.randomBytes(32).toString('hex');
// // }

// // // Function to send a verification email
// // async function sendVerificationEmail(recipientEmail) {
// //   try {
// //     const token = generateVerificationToken(); // Generate a unique token
// //     const verificationLink = `http://yourdomain.com/verify-email?token=${token}`;

// //     // Email content
// //     const mailOptions = {
// //       from: email,  // Sender email address
// //       to: recipientEmail, // Recipient email address (can be Gmail or Yopmail)
// //       subject: 'Email Verification',
// //       html: `<p>Please click the link below to verify your email:</p>
// //              <a href="${verificationLink}">Verify Email</a>`, // Link to verify email
// //     };

// //     // Send the email
// //     await transporter.sendMail(mailOptions);
// //     console.log('Verification email sent to:', recipientEmail);
// //   } catch (error) {
// //     console.error('Error sending verification email:', error);
// //   //
// // // }}

// // // Example usage:
// // const emailToSend = 'amanjeetbeniwal22@gmail.com'; // Replace with the recipient's email
// // sendVerificationEmail(emailToSend);

// const jwt = require("jsonwebtoken");
// const nodemailer = "nodemailer";
// // create an transporter
// const transporter = nodemailer.create.transporter({
//   service: "gmail",
//   auth: {
//     username: "",
//     pass: "",
//   },
// });

// const sendVerifunction = async function (user, res) {
//   if (!user.email) {
//     return res.satus(401).json({ message: " user email is undefinde " });
//   }
//   const emailVerficationtoken = jwt.sign(user._id, JWT_SECRET, {
//     expiresIn: "1h",
//   });
//   const verificationLink = `http://localhost:5005/API/USERS/verify-email/${verificationToken}`; // Corrected URL
// const mailOptions={
//     from:
//     to:
//     subject:
//     html:
// }
// try {
//     transporter.sendMail(mailOptions)
// } catch (error) { 
//     // console.error("Error sending email:", error); // Log the actual error
//     return res.status(500).json({ msg: "Error sending verification email" });
//   }
    
// }


const code = Math.floor(100000 + Math.random() * 900000).toString();
console.log(code);
// const nodemailer = require("nodemailer");
// const jwt = require("jsonwebtoken");

// // Set up email transporter using Gmail
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "amanjeetbeniwal22@gmail.com", // Use an environment variable for email
//     pass: "fhkg blim fdpi sqcw", // Use an environment variable for password
//   },
// });

// // Function to send verification email
// const sendVerificationEmail = async (user.email,verificationToken) => {
//   console.log("user", user); // Check the user object structure

//   if (!user.email) {
//     return res.status(400).json({ msg: "User email is undefined" });
//   }

//   // console.log("Sending verification email to:", user.email);

//   const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//     expiresIn: "1h",
//   });

//   console.log("six digit code ");

//   const verificationLink = `http://localhost:5005/API/USERS/verify-email/${code}`; // Corrected URL

//   const mailOptions = {
//     from: "amanjeetbeniwal22@gmail.com", // Use environment variable
//     to: user.email,
//     subject: "Email Verification",
//     html: `<p>Please click the link below to verify your email:</p>
//            <a href="${verificationLink}">Verify Email</a>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions); // Await the sendMail promise
//     return res
//       .status(200)
//       .json({ msg: "Check your email to verify your account" });
//   } catch (error) {
//     console.error("Error sending email:", error); // Log the actual error
//     return res.status(500).json({ msg: "Error sending verification email" });
//   }
// };

// module.exports = { sendVerificationEmail };