if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
}


//basic setup//
const express = require ("express");
const app = express();
const mongoose = require ("mongoose");

const path = require ("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo').MongoStore;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
app.use(express.static(path.join(__dirname , "public")));  //to serve static files like css , js , images//


const dbUrl = process.env.ATLASDB_URL;

//mongo store
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
});

app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs" ,ejsMate);


store.on("error", (err) =>{
    console.log("ERROR in MONGO SESSION STORE",err);
});


const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,    //this is the expiration of cookies which is 
        maxAge :  7 * 24 * 60 * 60 * 1000,                 // 7 days + 24 hrs + 60 mins + 60 sec + 1000 ms  
        httpOnly : true ,                 
    },
};

//APIs //
//root APT//
// app.get("/" , (req ,res) => {
//     res.send("Hii from the root API");
// });





//to use sessions
app.use(session(sessionOptions));
//to use flash
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());

//middleware for flash
app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






//Demo user test

// app.get("/demouser", async(req , res)=>{
//     let fakeUser = new User({
//         email : "student@gmail.com",
//         username : "sigma-student",
//     })

//     let registerdUser = await User.register(fakeUser , "helloworld");
//     res.send(registerdUser);
// });

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews", reviewrouter);
app.use("/" , userRouter);



//to store the url of the database//
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";  //wanderlust is the database name//


//to call  the main function//
main() .then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname , "views"));






//404 error handler page not found//
app.all("*" , (req ,  res  , next) => {
    next(new ExpressError(404 , "Page Not Found!!"));
});


//creating the middleware for the handling the errors//
app.use((err , req , res , next) => {
    let {statusCode = 500 , message = "Something went wrong!"} = err;

    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080 , () => {
    console.log("Server is listening on port 8080");
});