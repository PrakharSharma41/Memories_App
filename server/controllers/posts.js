import express from 'express';
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

const router = express.Router();

export const getPosts = async (req, res) => { // executed when someone visits https://localhost:5000/posts
    const {page}=req.query; 
    try {
        const LIMIT=3; // number of posts per page
        // we need to get startindex of a post on a specific page
        // startindex of first post on page 3 is 8+8+8-1=23 (index starts from zero)
        const startIndex=(Number(page)-1)* LIMIT;// get starting index of every page // we convert page to number as when we pass it as query it is oncverted into string 
        
        const total=await PostMessage.countDocuments({});// to count how many documents we have
        // we need to skip previous page , if we are on page 2 we dont want to fetch first 16 pages
        // we need to skip first 8 pages thus we skip all posts to the startIndex
        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);// this sort({_id:-1}) gives us newest post first. limit selects only limit number of posts
        res.json({data:posts,currentPage:Number(page),numberOfPages:Math.ceil(total/LIMIT)});// returning json which is simply an array of all messages we have
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getPostsBySearch=async(req,res)=>{
    const {searchQuery,tags}=req.query;
    try{
        // we convert searchquery to reg exp as that way it is easy for mongodb to search the database
        const title=new RegExp(searchQuery,"i");// i is for ignore case thus TEST and test are both same
        // $or is used to find posts which match either title or tags
        // but tags is array thus $in is used to see if any tags of post is
        // present in array of tags we sent in query (which we split using ',')
        const posts=await PostMessage.find({$or:[ {title} , { tags:{ $in:tags.split(',') } } ]});
        res.json({data:posts}); // sending back to frontend
    }
    catch(error){
        res.status(404).json({message:error.message});
    }
}

export const getPost = async (req, res) => { 
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req, res) => {
    const post = req.body;

    // creating new post from data obtained through user
    const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })// req gets this userId object from auth.js middleware

    try {
        await newPostMessage.save();// await is added as save is asynchronous function

        res.status(201).json(newPostMessage );// this sends message to client
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;// req is like posts/123 where 123 is id and id is used to store using destructure
    const { title, message, creator, selectedFile, tags } = req.body;// this is received from frontend
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);// sending updated post to client
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);// checking if _id is valid mongoose id

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: "Post deleted successfully." });
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    // first we will see user is authenticated
    // req has userId field which it got from auth middleware
    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);// checking if _id is valid mongoose id
    
    const post = await PostMessage.findById(id);

    // we now need to check that user od is already present in like section or not
    const index = post.likes.findIndex((id) => id ===String(req.userId));

    if (index === -1) {// if he wants to like post
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.status(200).json(updatedPost);
}


export default router;