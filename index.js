const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = 4000;

app.use(cors());
app.use(express.json());









app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});