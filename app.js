import { PORT, MONGO_URI } from "./src/config/envs.js";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";
import { v1Routes } from "./src/routes/main.route.js";
import ajvErrors from "ajv-errors";
import fastifySocketIO from "fastify-socket.io";

const start = async () => {
  const app = Fastify({
    ajv: {
      customOptions: {
        strict: false,
        allErrors: true,
      },
      plugins: [ajvErrors],
    },
  });

  // Socket configuration
  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
    },
    pingInterval: 10000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });

  // Connect to the database
  await connectDB(MONGO_URI);

  // Build the admin js router
  await buildAdminRouter(app);

  // Register main routes
  app.register(v1Routes, { prefix: "api/v1" });

  // Listening to the server
  app.listen({ port: PORT, host: "0.0.0.0" }, (err, addr) => {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Blinkit Server is running on http://localhost:${PORT}${admin.options.rootPath}`
      );
    }
  });

  //Socket listeners
  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("A user connected ✅");

      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log(`User Joined room ${orderId} 🏠`);
      });

      socket.on("disconnect", () => {
        console.log(`User Disconnected ❌`);
      });
    });
  });
};

start().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
