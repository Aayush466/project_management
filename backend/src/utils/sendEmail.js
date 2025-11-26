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

export const approveUserEmail = (adminmail,usermail) => {
  const mailOptions = {
    from: environmentVariables.email,
    to: adminmail,
    subject: "User Approval Notification ✅",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f7f8fa; padding: 20px; border-radius: 10px;">
        <h2 style="color: #004b23;">User Approval Confirmation</h2>
        <p>Hello Admin,</p>
        <p>The following user has been successfully <strong>registered</strong>, please <strong>approve</strong> on your panel:</p>
        <div style="background-color: #ffffff; padding: 10px 15px; border-radius: 8px; border: 1px solid #ddd;">
          <p style="margin: 5px 0;"><strong>User Email:</strong> ${usermail}</p>
        </div>
        <p style="margin-top: 20px;">You can now allow them access to the system or send them a confirmation message.</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;">
        <p style="font-size: 12px; color: #777;">This is an automated message from the User Management System.</p>
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

export const approvedUserEmail = (adminmail, usermail) => {
  const mailOptions = {
    from: environmentVariables.email,
    to: usermail,
    subject: "Your Account Has Been Approved 🎉",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f7f8fa; padding: 20px; border-radius: 10px;">
        <h2 style="color: #004b23;">Congratulations! 🎉</h2>
        <p>Hello,</p>
        <p>We’re excited to inform you that your account has been <strong>approved</strong> by the admin.</p>
        
        <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-top: 10px;">
          <p><strong>Approved By:</strong> ${adminmail}</p>
          <p><strong>Your Email:</strong> ${usermail}</p>
        </div>
        
        <p style="margin-top: 20px;">You can now log in and start using your account. Welcome aboard!</p>
        

        <hr style="border: none; border-top: 1px solid #ccc; margin: 30px 0;">
        <p style="font-size: 12px; color: #777;">This is an automated message. Please do not reply directly to this email.</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending approval email:", error);
    } else {
      console.log("Approval email sent successfully:", info.response);
    }
  });
};

export const rejectedUserEmail = (adminmail, usermail) => {
  const mailOptions = {
    from: environmentVariables.email,
    to: usermail,
    subject: "Your Account Request Has Been Rejected",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
        padding: 20px;
      ">
        <div style="
          max-width: 600px;
          margin: auto;
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">

          <h2 style="color: #e63946; margin-bottom: 15px;">
            Account Request Rejected
          </h2>

          <p style="font-size: 15px; color: #333;">
            Hello,
          </p>

          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            We appreciate your interest. Unfortunately, your recent request for account access was 
            <strong style="color: #e63946;">not approved</strong> by our administrator.
          </p>

          <p style="font-size: 15px; color: #555; line-height: 1.6;">
            If you believe this was a mistake or you would like more information, you may contact our admin:
          </p>

          <p style="font-size: 15px; color: #1d3557;">
            Admin Email: <strong>${adminmail}</strong>
          </p>

          <p style="font-size: 15px; color: #555; margin-top: 20px;">
            Thank you for understanding.
          </p>

          <p style="font-size: 14px; color: #888; margin-top: 25px;">
            — The Team
          </p>

        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending approval email:", error);
    } else {
      console.log("Approval email sent successfully:", info.response);
    }
  });
};

export const userProfileUpdatedEmail = (adminmail, usermail, username) => {
  const mailOptions = {
    from: environmentVariables.email,
    to: usermail,
    subject: "Your Profile Has Been Updated",

    html: `
      <div>
        <p>Hi ${username},</p>
        <p>Your profile details have been updated successfully by the admin.</p>

        <p>If you did not request this change, please contact us immediately.</p>

        <p>Regards,<br/>Admin (${adminmail})</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending profile update email:", error);
    } else {
      console.log("User profile update email sent successfully:", info.response);
    }
  });
};



export const sendResetOtpService = (mail, otp, resetOtpExpiry) => {
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
