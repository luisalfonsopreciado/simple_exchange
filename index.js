const app = require("./app");
const cts = require("./constants");

app.listen(cts.PORT, () => {
  console.log("listening on port: " + cts.PORT);
});
