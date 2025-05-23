const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const path = require('path')
// const cors = require('cors')
const multer = require('multer')
const bodyparser = require('body-parser')
// const userentry = require('./modals/user')
const app = express()
const cors = require('cors')
app.use(cors());
app.use(bodyparser.json())
app.use(express.static(path.join(__dirname,'public')))
const postentry = require('./modals/post')
const upload = require('./utils/profile-picture')

// mongoose connection
mongoose.connect(`mongodb://127.0.0.1:27017/rs`)
const userschema = mongoose.Schema({

    name:String,
    username:String,
    email:String,
    password:String,
    post:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'post'
        }
    ],
    profilepic:{
        type:String,
        default:'default.jpg'
    }

})
const userentry= mongoose.model('user',userschema)
app.get('/',(req,res)=>{
    res.send('hello')
})
app.post('/like-post/:postid', verifytoken, async (req, res) => {
    console.log()
    let data = jwt.verify(req.user,'secret')
    console.log(data)
    req.user.userid=data.userid
    console.log(data.userid)
    console.log(req.user.userid)

    const { postid } = req.params;
    
    try {
        let post = await postentry.findOne({ _id: postid }).populate('user');
        
        if (post.like.indexOf(data.userid) === -1) {
            post.like.push(data.userid);
        } else {
            post.like.splice(post.like.indexOf(data.userid), 1);
        }
        await post.save();
        console.log(post)
        res.status(200).json({ message: "Post like status updated", like: post.like.length });
    } catch (error) {
        console.error('Error updating like status:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post('/delete-post/:id',verifytoken,async (req,res)=>{
    console.log(req.params)
    const postid = req.params.id
    
    try{
        let post = await postentry.findOneAndDelete({_id:postid})
    
        res.status(200).json({message:"the post is deleted now "})
    }catch(err){
        console.log('Error deleting ',err)
        res.status(500).json({message:"internal server error"})
    }

})
app.post('/edit-post/:id',verifytoken,async (req,res)=>{
    const {id}=req.params;
    console.log(id)
    const post = await postentry.findOne({_id:id})
    if(post){
        return res.json(post)
    }
    res.send({"message":"the post is not found"})
    
    
})
app.post('/login',async (req,res)=>{
    const {email,password}= req.body
    let user = await userentry.findOne({email})
    if(!user) res.send('something went wrong')
    bcrypt.compare(password, user.password, function(err, result) {
        if(!result) res.send('something went wrong');
        else{
            
            let token=jwt.sign({email,userid:user._id},'secret')
            res.cookie('token',token)
            let a = {succes:"true",jwttoken:token,isloggendUser:user.username}
            console.log(a)
            res.status(200).json(a);
        }
    });
})
app.get('/user/:id', async (req, res) => {
    const {id} = req.params;

    console.log(id)
    let user = await userentry.findOne({_id: id});
    if (user) {
        return res.json(user);
    }

    console.log(user)
    res.send({"message": "error"});
})


app.post('/uploads',upload.single('file'), async (req,res)=>{
    console.log(req.body.token)
    console.log(req.file)
    if(req.body.token==="") res.send('you are not loggend you must be loggend so go logn page')
        else{
            let data = jwt.verify(req.body.token,'secret')
            console.log(data)
            const user = await userentry.findOne({_id:data.userid})
            user.profilepic = req.file.filename
            await user.save()
        }
})
app.get('/getimage',verifytoken,async (req,res)=>{
    // console.log(req.body.token)
    // console.log(req.user)
    // console.log(req.body)
    
    let data = jwt.verify(req.user,'secret')
    // console.log(data)
    const user = await userentry.findOne({_id:data.userid})
    if(user){
        res.send(user.profilepic)
    }

    // res.send("heloo user")

})
app.post('/register',async (req,res)=>{

    const {username,password,name,email}= req.body
    const user =await userentry.findOne({email})
    if (user) res.status(500).send('');
    else{
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                const ue = await userentry.create({
                    username,
                    name,
                    email,
                    password:hash,

                })
                res.status(200).send(ue)
            });
            
        });


    }
    
    
})
app.post('/post-upload',upload.single('file'),verifytoken,async (req,res)=>{
    const {title,description,subject}= req.body
    const {pdf}=req.file.filename
    console.log(req.file.filename)
    // console.log(pdf)
    let data = jwt.verify(req.user,'secret')
    console.log(data)
    if(data){
        let post = await postentry.create({
            title,
            description,
            subject,
            pdf:req.file.filename,
            user:data.userid
        
        })
        
        let user = await userentry.findOne({_id:data.userid})
        user.post.push(post._id)
        await user.save()
        
        res.send({message:'success'})


    }

})
app.get('/user-post',verifytoken,async (req,res)=>{
    let data = jwt.verify(req.user,'secret')
    if(data){
        let user = await userentry.findOne({_id:data.userid}).populate('post')
        res.json({post:user.post,username:user.username})
    }
    else{
        res.json({"message":"error in the server post"})
    }

})
app.get('/all-post',verifytoken,async (req,res)=>{
    let data = jwt.verify(req.user,'secret')
    if(data){
        let post = await postentry.find().populate('user')
        
        res.json({post,username:post.user})
    }
    
})


function verifytoken(req,res,next){
    const token = req.headers['authorization']
    
    // console.log('middlewae caleed',token)
    req.user=token
    next()
}

app.listen(3000)