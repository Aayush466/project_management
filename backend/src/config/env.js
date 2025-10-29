import dotenv from "dotenv";
dotenv.config();

const environmentVariables = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  registrationOtpExpiry: process.env.REGISTRATION_OTP_EXPIRY,
  resetOtpExpiry: process.env.RESET_OTP_EXPIRY,
  resetPasswordExpiry: process.env.RESET_PASSWORD_EXPIRY,
  service: process.env.SERVICE,
  email: process.env.EMAIL,
  appPassword: process.env.APP_PASSWORD,
  nodeEnv: process.env.NODE_ENV,
  corsOrigin: process.env.CORS_ORIGIN,
};

export default environmentVariables;