const User = require("../models/user");
module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Registerd Succefully");
        res.redirect("/listing");
    })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success", "You are logged in");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout =  (req, res ,next)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "You are now logged out!");
        res.redirect("/listing");   
    })
}