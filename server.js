const express = require("express");
const { routes } = require("./routes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Express server is running"
  });
});

app.use("/api/v1", routes);

app.listen(port , ()=>{
    console.log(`Server running at :${port}`);
})