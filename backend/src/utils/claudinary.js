import { v2 as cloudinary } from "cloudinary";
import environmentVariables from "../config/env.js";
import fs from "fs";

cloudinary.config({
  cloud_name: environmentVariables.cloudinaryCloudName,
  api_key: environmentVariables.cloudinaryApiKey,
  api_secret: environmentVariables.cloudinaryApiSecret
});

export default cloudinary;

