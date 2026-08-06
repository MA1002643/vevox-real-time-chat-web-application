const express = require("express");

const app = express();

app.use(express.static("html"));
const port = process.env.HTML_PORT || 8080;

app.listen(port, () => {
  console.log(`HTML server listening on port ${port}`);
});
