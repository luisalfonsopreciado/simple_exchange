const app = require("./app");
const cts = require("./constants");
const port = process.env.PORT || cts.PORT;

app.listen(port, () => {
  console.log("listening on port: " + port);
});
