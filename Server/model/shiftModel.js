const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    date:{
        type:Date,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true,
    },
    assigneedTo:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    assigneedBy:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    totalHours:{
        type:Number,
        default:0 }
  },
  { timestamps: true }
);

const Shift = mongoose.model("Shift", shiftSchema);
module.exports = Shift;
