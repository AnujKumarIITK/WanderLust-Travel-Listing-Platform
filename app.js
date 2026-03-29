// app.js - Main application file for WanderLust

// Load environment variables from .env file in development
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Require Listings Routes
const listingRouter = require("./routes/listing.js");

// Require Reviews Routes
const reviewRouter = require("./routes/review.js");

//Require User Routes
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to MongoDB successfully");
  }).catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));    
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

// Configure session store with MongoDB
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, // time period in seconds
});

// Handle errors in MongoDB session store
store.on("error", (err) => {
  console.log("ERROR in MongoDB Session Store", err);
});

// Express session middleware
const sessionOptions= {
  store, 
  secret: process.env.SECRET, 
  resave: false, 
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 1000 * 60 * 60 * 24 * 7,
    maxAge: 7 * 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Configure strategy Passport.js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to make flash messages available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Root route redirects to /listings
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Use Listings Routes
app.use("/listings", listingRouter);

// Use Review Routes
app.use("/listings/:id/reviews", reviewRouter);

// Use User Routes
app.use("/", userRouter);

// Custom 404 Error Handler
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Custom ExpressError Handler
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen(8080, (res, req) => {
    console.log("Server is listening on port 8080");
});





