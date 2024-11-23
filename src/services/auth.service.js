import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/envs.js";
import { CustomerModel, DeliveryPartnerModel } from "../models/user.model.js";
import { encrypt } from "../utils/common.util.js";

export const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  return { accessToken, refreshToken };
};

export const updateUserRefreshToken = async (user) => {
  const { accessToken, refreshToken } = generateTokens(user);

  const encryptedRefreshToken = encrypt(refreshToken);

  user.set({
    refreshToken: encryptedRefreshToken,
  });

  await user.save();

  return { accessToken, refreshToken };
};

export const getACustomerByQuery = async (query = {}) => {  
  const customer = await CustomerModel.findOne(query);
  return customer;
};

export const getADeliveryPartnerByQuery = async (query = {}) => {
  const customer = await DeliveryPartnerModel.findOne(query);
  return customer;
};
