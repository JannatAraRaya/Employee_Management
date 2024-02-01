const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: Number,
    },
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
    department: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["admin", "supervisor", "employee"],
      default:"employee",
      required: false,
    },
    ShiftAssigneed:[
      {
        type:mongoose.Types.ObjectId,
        ref:"Shift"
      }
    ],
    ShiftAssigner:[
      {
        type:mongoose.Types.ObjectId,
        ref:"Shift"
      }
    ]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
