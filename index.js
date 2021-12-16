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
var cors = require("cors");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cors());

const exchange = new Exchange(
  "LAP",
  new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
  new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
);

const authManager = new UserAuthManager();

app.post("/create-user", (req, res, next) => {
  console.log(req.body);
  const { user } = req.body;

  if (!User.validateRequest(user)) {
    return res.status(400).send("Invalid User arguments");
  }

  user.funds = 1000;

  if (!authManager.createUser(user)) {
    return res.status(400).send("Username taken");
  }

  return res.status(200).send(user);
});

app.post("/authenticate", (req, res) => {
  console.log(req.body);
});

io.on("connection", (socket) => {
  socket.on(cts.SUBMIT_BUY_ORDER, (event) => {
    if (!authManager.validateToken(event.authToken)) {
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

    exchange.submitBuyOrder(event.order);
  });

  socket.on(cts.SUBMIT_SELL_ORDER, (event) => {
    if (!authManager.validateToken(event.authToken)) {
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

    exchange.submitSellOrder(event.order);
  });

  socket.on(cts.USER_CREATE, (event) => {
    // console.log("[User Create] " + cts.USER_CREATE + " " + JSON.stringify(event));
  });

  socket.on(cts.USER_AUTHENTICATE, (event) => {
    const authToken = !authManager.authenticateUser(
      event.username,
      event.password
    );
    if (!authToken) {
      return socket.send("Invalid Credentials");
    }

    return socket.send(authToken);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(cts.PORT, () => {
  console.log("listening on port: " + cts.PORT);
});
