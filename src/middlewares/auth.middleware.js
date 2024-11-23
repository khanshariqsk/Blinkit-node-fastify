import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/envs.js";

export const verifyToken = async (req, reply) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ message: "Access token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    return true;
  } catch (error) {
    return reply.status(401).send({ message: "Invalid or expired token" });
  }
};
