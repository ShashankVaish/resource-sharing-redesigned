const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyparser = require('body-parser');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration
if (process.env.NODE_ENV !== "production") {
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }));
}

// Serve the built React app (must come before API routes)
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// MongoDB connection
mongoose.connect(`${process.env.MONGO_URL}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const userschema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'
    }
  ],
  profilepic: {
    type: String,
    default: 'default.jpg'
  }
});
const userentry = mongoose.model('user', userschema);

const postentry = require('./modals/post');
const upload = require('./utils/profile-picture');
const { uploadOnCloudinary, deleteUploadOnCloudinary, uploadOnCloudinaryforpdf } =
  require('./services/cloudinary/cloudinary.service.js');

// Verify token middleware
function verifytoken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: "No token provided" });
  req.user = token;
  next();
}

// ---------------- ROUTES ----------------

// Like post
app.post('/api/like-post/:postid', verifytoken, async (req, res) => {
  try {
    let data = jwt.verify(req.user, 'secret');
    req.user.userid = data.userid;

    const { postid } = req.params;
    let post = await postentry.findOne({ _id: postid }).populate('user');

    if (post.like.indexOf(data.userid) === -1) {
      post.like.push(data.userid);
    } else {
      post.like.splice(post.like.indexOf(data.userid), 1);
    }
    await post.save();

    res.status(200).json({ message: "Post like status updated", like: post.like.length });
  } catch (error) {
    console.error('Error updating like status:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete post
app.post('/api/delete-post/:id', verifytoken, async (req, res) => {
  const postid = req.params.id;
  try {
    let post = await postentry.findOneAndDelete({ _id: postid });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const filePath = path.join(__dirname, 'public/images', post.pdf);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Error deleting file" });
      }
      res.status(200).json({ message: "The post and associated file are deleted now" });
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  let user = await userentry.findOne({ email });
  if (!user) return res.send('something went wrong');

  bcrypt.compare(password, user.password, function (err, result) {
    if (!result) return res.send('something went wrong');
    let token = jwt.sign({ email, userid: user._id }, 'secret');
    res.cookie('token', token);
    res.status(200).json({ success: true, jwttoken: token, isloggendUser: user.username });
  });
});

// Get user
app.get('/api/user/:id', async (req, res) => {
  const { id } = req.params;
  let user = await userentry.findOne({ _id: id });
  if (user) return res.json(user);
  res.send({ message: "error" });
});

// Upload profile picture
app.post('/api/uploads', upload.single('file'), async (req, res) => {
  if (req.body.token === "") return res.send('you must be logged in');
  let data = jwt.verify(req.body.token, 'secret');
  const user = await userentry.findOne({ _id: data.userid });
  if (!user) return res.status(404).send('User not found');

  const cloudinarypath = await uploadOnCloudinary(req.file.path);
  if (!cloudinarypath) return res.status(500).send('Error uploading file to Cloudinary');

  user.profilepic = cloudinarypath.secure_url;
  await user.save();
  res.send({ message: "Profile picture updated" });
});

// Get user profile image
app.get('/api/getimage', verifytoken, async (req, res) => {
  let data = jwt.verify(req.user, 'secret');
  const user = await userentry.findOne({ _id: data.userid });
  if (user) return res.send(user.profilepic);
  res.status(404).send("User not found");
});

// Register
app.post('/api/register', async (req, res) => {
  const { username, password, name, email } = req.body;
  const user = await userentry.findOne({ email });
  if (user) return res.status(500).send('User already exists');

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const ue = await userentry.create({
        username,
        name,
        email,
        password: hash,
      });
      res.status(200).send(ue);
    });
  });
});

// Upload post
app.post('/api/post-upload', upload.single('file'), verifytoken, async (req, res) => {
  const { title, description, subject } = req.body;
  if (!title || !description || !subject || !req.file) {
    return res.status(400).send('All fields are required');
  }

  let data = jwt.verify(req.user, 'secret');
  const cloudinarypath = await uploadOnCloudinaryforpdf(req.file.path);
  if (!cloudinarypath) return res.status(500).send('Error uploading file to Cloudinary');

  let post = await postentry.create({
    title,
    description,
    subject,
    pdf: cloudinarypath,
    user: data.userid
  });

  let user = await userentry.findOne({ _id: data.userid });
  user.post.push(post._id);
  await user.save();

  res.send({ message: 'success' });
});

// Get user posts
app.get('/api/user-post', verifytoken, async (req, res) => {
  let data = jwt.verify(req.user, 'secret');
  let user = await userentry.findOne({ _id: data.userid }).populate('post');
  res.json({ post: user.post, username: user.username });
});

// Get all posts
app.get('/api/all-post', verifytoken, async (req, res) => {
  let data = jwt.verify(req.user, 'secret');
  let posts = await postentry.find().populate('user');
  res.json({ posts });
});

// ---------------- SPA FALLBACK (last!) ----------------
// Serve the built React app
app.use(express.static(path.join(__dirname,'..',"client", 'dist')))

// Catch-all: send index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(3000, () => console.log("Server running on port 3000"));
