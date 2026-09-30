const { Router } = require("express");
const { welcome } = require("../controller/welcome.controller");

const welcomeRouter = Router();

welcomeRouter.post("/send-welcome",welcome);

module.exports = {welcomeRouter};