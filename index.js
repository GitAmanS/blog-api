require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());


const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  timestamp: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogSchema);

// POST /blog - create a new blog post
app.post('/api/blog', async (req, res) => {
  let blogPost = new BlogPost({
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  });
  blogPost = await blogPost.save();


  res.send(blogPost);
});


// GET /blog - get all blog posts
app.get('/api/blog', async (req, res) => {
  try{
    const allBlogPosts = await BlogPost.find();
    res.json(allBlogPosts)
  }catch(error){
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET /blog/:id - get a specific blog post
app.get('/api/blog/:id', async (req, res) => {
  try{
    const postId = await req.params.id;
    console.log(postId)
    const post = await BlogPost.findById(postId).lean();
    res.json(post);
  }catch(error){
    console.log(error);
    res.status(500).json({error:"Internal Server Error"})
  }



});


// DELETE /blog/:id - delete a specific blog post
app.delete('/api/blog/:id', async (req, res) => {
  try{
    const postId = await req.params.id;
    const deletedPost = await BlogPost.findByIdAndDelete(postId);
    res.json(deletedPost);
  }catch(error){
    console.log(error)
    res.status(500).json({error:"Internal error"})
  }
  
});

mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));