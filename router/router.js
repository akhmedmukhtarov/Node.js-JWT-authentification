const express = require('express');
const router = express.Router();
const func = require("../app/app");
const middleware = require('../middleware/middleware');



router.post("/register",func.register)

router.post("/login", func.login)

router.post("/refresh", func.refreshToken)

router.use(middleware);

router.get("/profile",func.getUserInfo)

router.get("/logout",func.logOut)


module.exports = router