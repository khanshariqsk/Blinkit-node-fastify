import { REFRESH_TOKEN_SECRET } from "../config/envs.js";
import { AuthDto } from "../dtos/auth.dto.js";
import { CustomerModel, DeliveryPartnerModel } from "../models/user.model.js";
import {
  getACustomerByQuery,
  getADeliveryPartnerByQuery,
  updateUserRefreshToken,
} from "../services/auth.service.js";
import { decrypt } from "../utils/common.util.js";
import { ROLES } from "../utils/constant.util.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const customerLogin = async (req, reply) => {
  try {
    const { phone } = req.body;
    let customer = await getACustomerByQuery({ phone });
    if (!customer) {
      customer = await createCustomer({
        phone,
        role: ROLES.CUSTOMER,
        isActivated: true,
      });
    }

    const { accessToken, refreshToken } = await updateUserRefreshToken(
      customer
    );

    return reply.send({
      message: customer ? "Login successful" : "Customer created and logged in",
      accessToken,
      refreshToken,
      user: new AuthDto(customer),
    });
  } catch (error) {
    return reply.status(500).send({ message: error.message });
  }
};

export const deliveryPartnerLogin = async (req, reply) => {
  try {
    const { email, password } = req.body;

    const foundDeliveryPartner = await getADeliveryPartnerByQuery({ email });

    if (!foundDeliveryPartner) {
      return reply.status(404).send({ message: "Delivery partner not found" });
    }

    if (!foundDeliveryPartner.isActivated) {
      return reply
        .status(403)
        .send({ message: "Your profile is not activated" });
    }

    const isMatched = await bcrypt.compare(
      password,
      foundDeliveryPartner.password
    );

    if (!isMatched) {
      return reply.status(400).send({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await updateUserRefreshToken(
      foundDeliveryPartner
    );

    return reply.send({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: new AuthDto(foundDeliveryPartner),
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};

export const refreshToken = async (req, reply) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return reply.status(400).send({ message: "Refresh is required" });
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return reply.status(403).send({ message: "Invalid refresh token" });
    }

    const rolesAllowed = [ROLES.CUSTOMER, ROLES.DELIVERY_PARTNER];

    if (!rolesAllowed.includes(decoded.role)) {
      return reply.status(403).send({ message: "Invalid role" });
    }

    let condition = {
      _id: decoded.userId,
    };

    let user;

    if (decoded.role === ROLES.CUSTOMER) {
      user = await getACustomerByQuery(condition);
    } else {
      user = await getADeliveryPartnerByQuery(condition);
    }

    if (!user) {
      return reply.status(403).send({ message: "Invalid refresh token" });
    }

    if (!user.isActivated) {
      return reply
        .status(403)
        .send({ message: "Your profile is not activated" });
    }

    const decryptedToken = decrypt(user.refreshToken);

    if (decryptedToken !== refreshToken) {
      return reply.status(403).send({ message: "Invalid refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await updateUserRefreshToken(user);

    return reply.send({
      message: "Refresh generated successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};

export const fetchUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;

    const rolesAllowed = [ROLES.CUSTOMER, ROLES.DELIVERY_PARTNER];

    if (!rolesAllowed.includes(role)) {
      return reply.status(403).send({ message: "Invalid role" });
    }

    let condition = {
      _id: userId,
    };

    let user;

    if (role === ROLES.CUSTOMER) {
      user = await getACustomerByQuery(condition);
    } else {
      user = await getADeliveryPartnerByQuery(condition);
    }

    if (!user) {
      return reply.status(403).send({ message: "Invalid refresh token" });
    }

    return reply.send({
      message: "User fetched successfully",
      user: new AuthDto(user),
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};

export const updateUser = async (req, reply) => {
  try {
    const updateData = req.body;
    const { userId, role } = req.user;

    const rolesAllowed = [ROLES.CUSTOMER, ROLES.DELIVERY_PARTNER];

    if (!rolesAllowed.includes(role)) {
      return reply.status(403).send({ message: "Invalid role" });
    }

    let condition = {
      _id: userId,
    };

    let user;
    let UserModel;
    if (role === ROLES.CUSTOMER) {
      user = await getACustomerByQuery(condition);
      UserModel = CustomerModel;
    } else {
      user = await getADeliveryPartnerByQuery(condition);
      UserModel = DeliveryPartnerModel;
    }

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return reply.send({
      message: "User updated successfully",
      user: new AuthDto(updatedUser),
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};
