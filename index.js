const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cts = require("./constants");
const { Exchange } = require("./Exchange");
const { PriorityQueue } = require("./data_structures/PriorityQueue");
const { Order } = require("./Order");
const { User } = require("./User");
const { UserAuthManager } = require("./UserAuthManager");

const exchange = new Exchange(
  "LAP",
  new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
  new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
);

const authManager = new UserAuthManager();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on(cts.SUBMIT_BUY_ORDER, (event) => {
    console.log(
      "[Order Received] " + cts.SUBMIT_BUY_ORDER + " " + JSON.stringify(event)
    );
    if (!Order.validate(event)) {
      console.log("Invalid " + cts.SUBMIT_BUY_ORDER);
      return socket.send("Invalid Order");
    }
    exchange.submitBuyOrder(event);
  });

  socket.on(cts.SUBMIT_SELL_ORDER, (event) => {
    console.log(
      "[Order Received] " + cts.SUBMIT_SELL_ORDER + " " + JSON.stringify(event)
    );
    if (!Order.validate(event)) {
      console.log("Invalid Sell Order");
      return socket.send("Invalid Order");
    }
    exchange.submitSellOrder(event);
  });

  socket.on(cts.USER_CREATE, (event) => {
    // console.log("[User Create] " + cts.USER_CREATE + " " + JSON.stringify(event));
    if (!User.validate(event.user)) {
      return socket.send("Invalid User");
    }
    if (!authManager.createUser()) {
      return socket.send("Unable to create user");
    }
    socket.send("User created successfully");
  });

  socket.on(cts.USER_AUTHENTICATE, (event) => {
    const authToken = !authManager.authenticateUser(
      event.username,
      event.password
    );
    if (!authToken) {
      return socket.send("Invalid Credentials");
    }
    return authToken;
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(cts.PORT, () => {
  console.log("listening on port: " + cts.PORT);
});
