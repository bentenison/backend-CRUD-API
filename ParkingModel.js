const mongoose = require("mongoose")

const ParkingSchema = new mongoose.Schema({
    type:{type:String,required:true},
    Lotnumber:{type:String,required:true},
    date_from:{type:String},
    date_to:{type:String},
    status:{type:Boolean},
    plate_no:String,
    userId:{type:String,required:true}
})

module.exports = Parking = mongoose.model("parking",ParkingSchema)