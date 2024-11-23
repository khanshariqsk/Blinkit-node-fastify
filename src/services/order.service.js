import { OrderModel } from "../models/order.model.js";

export const getAOrderByQuery = async (query = {}) => {
  const order = await OrderModel.findOne(query);
  return order;
};

export const getOrdersByQuery = async (query = {}) => {
  const orders = await OrderModel.find(query);
  return orders;
};

export const createAOrder = async (data = {}) => {
  const order = new OrderModel(data);
  await order.save();
  return order;
};
