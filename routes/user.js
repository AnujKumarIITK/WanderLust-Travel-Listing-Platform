const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlware.js");

const userController = require("../controllers/users.js");

// router.route("/signup") for User Registration Route and User Registration Logic.
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post( 
        wrapAsync(userController.signup)
    );

// router.route("/login") for User Login Route and User Login Logic.    
router
    .route("/login")
    .get(userController.renderLoginForm)    
    .post( 
        saveRedirectUrl, 
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), 
        userController.login
    );

// User logout Route
router.get("/logout", 
    userController.logout
);

module.exports = router;

