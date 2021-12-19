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
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());

app.use(cors());

const exchange = new Exchange(
  "LAP",
  new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
  new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
);

const authManager = new UserAuthManager();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/myOrders", (req, res) => {
  const cookieJSON = cookieParser.JSONCookies(req.cookies);

  if (!authManager.validateToken(cookieJSON.authToken)) {
    return res.status(401).send({ message: "Authenticate to View Buy Orders" });
  }

  const userId = authManager.userTokens[cookieJSON.authToken];

  const user = authManager.userIdSearch[userId];

  if (!user) {
    return res
      .status(500)
      .send({ message: "Something went wrong on our side" });
  }

  return res
    .status(200)
    .send({ buyOrders: user.buyOrders, sellOrders: user.sellOrders });
});

app.post("/createUser", (req, res) => {
  const user = req.body;

  if (!User.validateRequest(user)) {
    return res.status(400).send({ message: "Invalid User Credentials" });
  }

  const serverUser = new User(user.firstName, user.lastName, user.username, user.password, 1000);

  if (!authManager.createUser(serverUser)) {
    return res.status(400).send({ message: "Username taken" });
  }

  return res.status(200).send();
});

app.post("/authenticate", (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).send();
  }

  const token = authManager.authenticateUser(
    req.body.username,
    req.body.password
  );

  if (!token) {
    return res.status(400).send({ message: "Invalid Credentials" });
  }

  res.setHeader("Set-Cookie", "authToken=" + token);

  res.status(200).send({ token: token });
});

app.get("/marketDepth", (req, res) => {
  res.status(200).send({ LAP: exchange.getMarketDepth(100) });
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on(cts.SUBMIT_BUY_ORDER, (event) => {
    const userId = authManager.validateToken(event.authToken);

    if (!userId) {
      return socket.send("Invalid token");
    }

    console.log(
      "[Order Received] " +
        cts.SUBMIT_BUY_ORDER +
        " " +
        JSON.stringify(event.order)
    );

    if (!Order.validate(event.order)) {
      console.log("Invalid " + cts.SUBMIT_BUY_ORDER);
      return socket.send("Invalid Order");
    }

    event.order.userId = userId;

    const user = authManager.userIdSearch[userId];

    exchange.submitBuyOrder(event.order, user);
  });

  socket.on(cts.SUBMIT_SELL_ORDER, (event) => {
    const userId = authManager.validateToken(event.authToken);

    if (!userId) {
      return socket.send("Invalid token");
    }

    console.log(
      "[Order Received] " +
        cts.SUBMIT_SELL_ORDER +
        " " +
        JSON.stringify(event.order)
    );

    if (!Order.validate(event.order)) {
      console.log("Invalid Sell Order");
      return socket.send("Invalid Order");
    }

    event.order.userId = userId;

    const user = authManager.userIdSearch[userId];

    exchange.submitSellOrder(event.order, user);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("*", function (req, res) {
  res.status(404).sendFile(__dirname + "/404.html");
});

module.exports = server;
