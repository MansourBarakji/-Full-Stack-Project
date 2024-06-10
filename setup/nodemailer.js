const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

module.exports.sendVerificationEmail = (email, verificationToken) => {
  const verificationLink = `http://localhost:5173/verify/${verificationToken}`;

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `<p>Click the following link to verify your email: <a href="${verificationLink}">verificationLink</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    }
  });
};

module.exports.sendResetPasswordEmail = (email, resetToken) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Password Reset",
    html: `
      <p>You requested a password reset for your account.</p>
      <p>Click <a href="http://localhost:5173/resetPassword/${resetToken}">here</a> to reset your password.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    }
  });
};
