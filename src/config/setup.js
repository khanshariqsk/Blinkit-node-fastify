import AdminJS from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import AdminJSFastify from "@adminjs/fastify";
import FastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import bcrypt from "bcryptjs";

import {
  CustomerModel,
  DeliveryPartnerModel,
  AdminModel,
} from "../models/user.model.js";

import { BranchModel } from "../models/branch.model.js";
import { MONGO_URI, COOKIE_PASSWORD, NODE_ENV } from "./envs.js";

import { dark, light, noSidebar } from "@adminjs/themes";
import { CategoryModel } from "../models/category.model.js";
import { ProductModel } from "../models/product.model.js";
import { CounterModel } from "../models/counter.model.js";
import { OrderModel } from "../models/order.model.js";

// Register the Mongoose adapter
AdminJS.registerAdapter(AdminJSMongoose);

// Create a MongoDB session store
const MongoDBStore = ConnectMongoDBSession(FastifySession);

const sessionStore = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

sessionStore.on("error", (error) => {
  console.log("Session store error", error);
});

// Authentication function
const authenticate = async (email, password) => {
  if (!email || !password) return null;

  const existUser = await AdminModel.findOne({ email });

  if (!existUser) return null;

  const isMatched = await bcrypt.compare(password, existUser.password);

  if (!isMatched) return null;

  return Promise.resolve({ email });
};

// AdminJS instance configuration
export const admin = new AdminJS({
  resources: [
    {
      resource: CustomerModel,
      options: {
        listProperties: ["phone", "role", "isActivated"],
        filterProperties: ["phone", "role"],
        properties: {
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
          refreshToken: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: DeliveryPartnerModel,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
        properties: {
          password: {
            isVisible: { list: false, filter: false, show: false, edit: true },
            type: "password",
          },
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
          refreshToken: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: AdminModel,
      options: {
        listProperties: ["email", "role", "isActivated"],
        filterProperties: ["email", "role"],
        properties: {
          password: {
            isVisible: { list: false, filter: false, show: false, edit: true },
            type: "password",
          },
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
          refreshToken: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: BranchModel,
      options: {
        properties: {
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: CategoryModel,
      options: {
        properties: {
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: ProductModel,
      options: {
        properties: {
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: CounterModel,
      options: {
        properties: {
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
        },
      },
    },
    {
      resource: OrderModel,
      options: {
        properties: {
          createdAt: {
            isVisible: false,
          },
          updatedAt: {
            isVisible: false,
          },
        },
      },
    },
  ],
  branding: {
    companyName: "Blinkit",
    withMadeWithLove: false,
  },
  defaultTheme: dark.id,
  availableThemes: [dark, light, noSidebar],
  rootPath: "/admin",
});

// Build the admin router
export const buildAdminRouter = async (app) => {
  await AdminJSFastify.buildAuthenticatedRouter(
    admin,
    {
      authenticate,
      cookiePassword: COOKIE_PASSWORD,
      cookieName: "adminjs",
    },
    app,
    {
      store: sessionStore,
      saveUninitialized: true,
      secret: COOKIE_PASSWORD,
      cookie: {
        httpOnly: NODE_ENV === "production",
        secure: NODE_ENV === "production",
      },
    }
  );
};
