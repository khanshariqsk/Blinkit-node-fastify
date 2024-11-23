import { AuthDto } from "../dtos/auth.dto.js";
import { OrderModel } from "../models/order.model.js";
import {
  getACustomerByQuery,
  getADeliveryPartnerByQuery,
} from "../services/auth.service.js";
import { getABranchByQuery } from "../services/branch.service.js";
import { createAOrder, getAOrderByQuery } from "../services/order.service.js";
import { ORDER_STATUS } from "../utils/constant.util.js";

export const createOrder = async (req, reply) => {
  try {
    const { userId } = req.user;
    const { items, branchId, totalPrice } = req.body;

    const customer = await getACustomerByQuery({ _id: userId });

    const branchData = await getABranchByQuery({ _id: branchId });

    if (!customer) {
      return reply.status(404).send({ message: "Customer not found" });
    }

    if (!branchData) {
      return reply.status(404).send({ message: "Branch not found" });
    }

    const order = await createAOrder({
      customer: userId,
      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
      branch: branchId,
      totalPrice,
      deliveryLocation: {
        longitude: customer.liveLocation.longitude,
        latitude: customer.liveLocation.latitude,
        address: customer.address || "No address available",
      },
      pickupLocation: {
        longitude: branchData.location.longitude,
        latitude: branchData.location.latitude,
        address: branchData.address || "No address available",
      },
    });

    return reply.status(201).send({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};

export const confirmOrder = async (req, reply) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;
    const { deliveryPersonLocation } = req.body;

    const deliveryPartner = await getADeliveryPartnerByQuery({ _id: userId });

    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery partner not found" });
    }

    const order = await getAOrderByQuery({ _id: orderId });

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    if (order.status !== ORDER_STATUS.AVAILABLE) {
      return reply.status(400).send({ message: "Order is not available" });
    }

    //TODO: to check if delivery partner is exists in the branch or not

    order.set({
      status: ORDER_STATUS.CONFIRMED,
      deliveryPartner: userId,
      deliveryPersonLocation: {
        longitude: deliveryPersonLocation.longitude,
        latitude: deliveryPersonLocation.latitude,
        address: deliveryPersonLocation.address || "",
      },
    });

    await order.save();

    req.server.io.to(orderId).emit("orderConfirmed", order);

    return reply.status(200).send({
      message: "Order confirmed successfully",
      order,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};

export const updateOrderStatus = async (req, reply) => {
  try {
    const { userId } = req.user;
    const { orderId } = req.params;
    const { deliveryPersonLocation, status } = req.body;

    const deliveryPartner = await getADeliveryPartnerByQuery({ _id: userId });

    if (!deliveryPartner) {
      return reply.status(404).send({ message: "Delivery partner not found" });
    }

    const order = await getAOrderByQuery({ _id: orderId });

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    const notAllowedOrderStatus = [
      ORDER_STATUS.CANCELLED,
      ORDER_STATUS.DELIVERED,
    ];

    if (notAllowedOrderStatus.includes(order.status)) {
      return reply.status(400).send({ message: "Order cannot be updated" });
    }

    if (order.deliveryPartner.toString() !== userId) {
      return reply.status(403).send({ message: "Unauthorized" });
    }

    order.set({
      status,
      deliveryPartner: userId,
      deliveryPersonLocation: {
        longitude: deliveryPersonLocation.longitude,
        latitude: deliveryPersonLocation.latitude,
        address: deliveryPersonLocation.address || "",
      },
    });

    await order.save();

    req.server.io.to(orderId).emit("liveTrackingUpdates", order);

    return reply.status(200).send({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};

export const getOrders = async (req, reply) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } = req.query;

    const query = {
      ...(status && { status }),
      ...(customerId && { customer: customerId }),
      ...(deliveryPartnerId && { deliveryPartner: deliveryPartnerId }),
      ...(branchId && { branch: branchId }),
    };

    const orders = await OrderModel.find(query).populate([
      { path: "customer", select: AuthDto.customerFields },
      { path: "deliveryPartner", select: AuthDto.deliveryPartnerFields },
      { path: "branch" },
      { path: "items.item" },
    ]);

    return reply.status(200).send({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};

export const getOrderById = async (req, reply) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findOne({ _id: orderId }).populate([
      { path: "customer", select: AuthDto.customerFields },
      { path: "deliveryPartner", select: AuthDto.deliveryPartnerFields },
      { path: "branch" },
      { path: "items.item" },
    ]);

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    return reply.status(200).send({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ message: error.message || "Something went wrong" });
  }
};
