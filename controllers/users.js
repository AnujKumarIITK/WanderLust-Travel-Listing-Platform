// Controllers for Users => All User controllers are here.

const User = require("../models/user");

// Signup controller to render the form to register a new user
module.exports.renderSignupForm = async (req,res) => {
    res.render("users/signup.ejs");
};

// Signup controller to register a new user
module.exports.signup = async (req,res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        // Automatically log in the user after registration
        req.login(registeredUser, (err) => {
            if (err) {                
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Login controller to render the login form
module.exports.renderLoginForm = async (req,res) => {
    res.render("users/login.ejs");
};

// Login controller to authenticate the user and log them in
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderLust, you are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // Default to /listings if no redirect URL is set
    res.redirect(redirectUrl);
};

// Logout controller to log the user out
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
};

