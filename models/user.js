const mongoose = require ("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");



const userSchema = new Schema({
    email : {
        type :String,
        required : true,
    },
});


//this passportLocalMongose automatically adds the usename and password and the
//username and passwords are hashed and salted//
//so we only add email

userSchema.plugin(passportLocalMongoose.default);
module.exports = mongoose.model('User', userSchema);
