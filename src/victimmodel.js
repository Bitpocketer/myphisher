var mongoose=require('mongoose');
var userSchema = mongoose.Schema({
    FirstName: String,
    LastName:String,
    Password: String,
    Description:String,
    Location:String


});

// create the model for users and expose it to our app
module.exports = mongoose.model('Poolers', userSchema);