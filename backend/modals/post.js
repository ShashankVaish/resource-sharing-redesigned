const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/rs')
const postschema = mongoose.Schema({
    title:String,
    description:String,
    subject:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }

    ,
    pdf:String,
})
module.exports = mongoose.model('post',postschema)