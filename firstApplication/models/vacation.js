//b2: khai bao model(table)
const { default: mongoose } = require("mongoose");
var vacationSchema = mongoose.Schema({
    contestName: String,
    email: String,
    year: Number,
    month: Number,
    path: String
});

vacationSchema.methods.getDisplayPirce = function(){
    return '$' + (this.priceInCents / 100).toFixed(2);
}

var Vacation = mongoose.model("Vacation",vacationSchema);
module.exports = Vacation;