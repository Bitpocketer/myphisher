//Get Dependencies
const express = require('express');
const router = express.Router();


//Middleware
var UserController = require('./controlller');

router.post("/signin", UserController.capturedetails);


module.exports = router;