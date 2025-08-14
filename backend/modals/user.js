const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const userschema = mongoose.Schema({
    name:String,
    username:String,
    email:String,
    password:String,
    post:[
        {
            type:mongoose.Schema.Types.ObjectId,
            // ref:'post'
        }
    ],
    profilepic:{
        type:String,
        default:'default.png'
    }

})
module.exports=mongoose.model('user',userschema)