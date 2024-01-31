const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            maxLength: 30,
        },

        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false,
        },
        department:{
            type:String,
            required:false
        },
        role:{
            type:String,
            required:false
        }


    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;