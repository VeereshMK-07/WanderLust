const User = require("../models/user");


module.exports.renderSignupForm = (req ,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res) => {
    try{
        //extarct the username , email and password from the sginup form
        let{username , email , password} = req.body;
        const newUser = new User({email , username});
        const  registerdUser = await User.register(newUser , password);
        console.log(registerdUser);
        req.login(registerdUser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome to Wanderlust!");
            res.redirect("/listings");
        });      
    } catch(err) {
        req.flash("error" , err.message);
        res.redirect("/signup");
    }
    
};


module.exports.renderLoginForm = (req , res) =>{
    res.render("users/login.ejs");
};


module.exports.login = async(req , res) =>{
        req.flash("success" , "Welcome back to Wanderlust! ");
        let redirectUrl = res.locals.redirectUrl || "/listings" ;
        res.redirect(redirectUrl);
};


module.exports.logout = (req , res , next) => {
    req.logOut((err) => {
        if(err){
         return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    });
};