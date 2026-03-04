require('dotenv').config();
const mongoose=require('mongoose');

// const dns = require('dns');
// // Force Google DNS to resolve MongoDB SRV records (fixes ISP DNS blocking)
// dns.setServers(['8.8.8.8', '8.8.4.4']);
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mern-blog.c5mouhd.mongodb.net/blog?retryWrites=true&w=majority&appName=mern-blog`;
mongoose.connect(url)
.then(()=>console.log('Connected to cloud database successfully'))
.catch((err)=>{
    console.log(err)
})

      