import crypto from "crypto";
import { HASH_SECRET_KEY } from "../config/envs.js";
const IV_LENGTH = 16;

export const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(HASH_SECRET_KEY, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + encrypted;
};

export const decrypt = (encryptedData) => {
  const iv = Buffer.from(encryptedData.substring(0, IV_LENGTH * 2), "hex");

  const encryptedText = encryptedData.substring(IV_LENGTH * 2);

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(HASH_SECRET_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
