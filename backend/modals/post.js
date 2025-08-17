const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
// mongoose.connect(`mongodb://
const postschema = mongoose.Schema({
    title:String,
    description:String,
    subject:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    pdf:String,
})
module.exports = mongoose.model('post',postschema)