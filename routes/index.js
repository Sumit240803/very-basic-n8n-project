const { Router } = require("express");
const { welcomeRouter } = require("./welcome.route");

const routes = Router();

routes.use("/welcome", welcomeRouter);

module.exports = {routes};