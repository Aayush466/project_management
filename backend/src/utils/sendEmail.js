import nodemailer from "nodemailer";
import environmentVariables from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: environmentVariables.service, // or your email provider
  auth: {
    user: environmentVariables.email,
    pass: environmentVariables.appPassword,
  },
});

export const sendMail = (mail, otp, registrationOtpExpiry) => {
  const mailOptions = {
    from: environmentVariables.email,
    to: mail,
    subject: "Your Verification Code (OTP) – Action Required",
    html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Hello <strong>${mail}</strong>,</p>

    <p>We received a request to verify your account. Please use the One-Time Password (OTP) below to complete your verification process.</p>

    <div style="margin: 20px 0; padding: 15px; border: 1px dashed #ccc; text-align: center;">
      <p style="font-size: 18px; margin-bottom: 5px;">🔐 Your OTP:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #004b23;">${otp}</p>
    </div>

    <p>This OTP is valid for the next <strong>${registrationOtpExpiry} minutes</strong>.<br>
    Do not share this code with anyone for security reasons.</p>

    <p>If you did not request this, please ignore this email.</p>

    <p>Thank you,<br>
    <strong>Team Shiva</strong></p>
  </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export const sendResetOtpService = (mail, otp,resetOtpExpiry) => {
  const mailOptions = {
    from: environmentVariables.email,
    to: mail,
    subject: "Password Reset Request – Your OTP Code",
    html: `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Hello <strong>${mail}</strong>,</p>

    <p>We received a request to reset your account password. Please use the One-Time Password (OTP) below to verify your request and proceed with resetting your password.</p>

    <div style="margin: 20px 0; padding: 15px; border: 1px dashed #ccc; text-align: center;">
      <p style="font-size: 18px; margin-bottom: 5px;">🔐 Your Reset OTP:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #004b23;">${otp}</p>
    </div>

    <p>This OTP is valid for the next <strong>${resetOtpExpiry} minutes</strong>.<br>
    Do not share this code with anyone for security reasons.</p>

    <p>If you did not request a password reset, please ignore this email. Your account remains secure.</p>

    <p>Thank you,<br>
    <strong>Team Shiva</strong></p>
  </div>
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};


export const sendInviteEmail = (mail,name,adminMail) => {
  const mailOptions = {
    from: environmentVariables.email,
    to: mail,
    subject: `Hello ${name}, You have a joining request`,
    html: `${adminMail} has sent you a joining request, Please login and accept or reject the request.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export const sendAcceptEmail = (adminmail,adminname,username) => {
  const mailOptions = {
    from: environmentVariables.email,
    to: adminmail,
    subject: `Hello ${adminname}, Congrats`,
    html: `${username} has accepted your request`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

export const sendRejectEmail = (adminmail,adminname,username) => {
  const mailOptions = {
    from: environmentVariables.email,
    to: adminmail,
    subject: `Hello ${adminname}, Sorry`,
    html: `${username} has rejected your request`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
