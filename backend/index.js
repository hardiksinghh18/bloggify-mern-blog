
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: '/tmp/uploads/' })
const uploadImageOnCloud=require('./utils/cloudinary')
const cors = require('cors')
const fs = require('fs')
const mongoose = require('mongoose')
require('dotenv').config();
require('./mongo/connection')
const Register = require('./models/usermodel')
const Comment = require('./models/commentsmodel')
const Blog = require('./models/blogs')
const verifyuser = require('./middleware/verifyuser')
const bcrypt = require('bcryptjs')
const app = express()
 


const PORT = process.env.PORT || 5000
const cookieParser = require('cookie-parser')
const { timeStamp } = require('console')
const accessCookieOptions={
 maxAge: 24 * 60 * 60 * 1000,
 path: "/",
 httpOnly: true,
 secure: true,
 sameSite: 'None'
}
const refreshCookieOptions={
 maxAge: 30 * 24 * 60 * 60 * 1000,
 path: "/",
 httpOnly: true,
 secure: true,
 sameSite: 'None'
}

app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({

    // origin: ['http://localhost:3000'],
  origin:process.env.BASE_URL,
    // origin: ['https://bloggify-mern.vercel.app'],
 methods:["POST","GET"], 

    credentials: true

}))
app.get('/', (req, res) => {
    res.json({ message: 'Hello from server' })
})

app.get('/message', (req, res) => {
    res.json({ message: 'Hello from server' })

})

app.get('/register', (req, res) => {
    res.json('register page')
})


app.post('/register', async (req, res) => {

    try {
        const { name, email, password } = req.body
        // console.log(name)
        const user = new Register({
            name: name,
            email: email,
            password: password
        })

        const token = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshToken();

        await user.save()
        // await res.cookie('jwt', token)
      
     
        return  res
        .status(200)
        .cookie('accessToken', token, accessCookieOptions)
        .cookie('refreshToken', refreshToken, refreshCookieOptions)
        .json({ Login: true, valid: true, message: "registered" })

    } catch (error) {
        res.status(400).json(error)
    }
})

app.get('/login', (req, res) => {

    res.json(req.body)
})


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body


        const userDetails = await Register.findOne({ email: email });


        const passwordMatch = await bcrypt.compare(password, userDetails.password);

        if (passwordMatch) {
            const token = await userDetails.generateAuthToken();
            const refreshToken = await userDetails.generateRefreshToken();

        
         return  res
         .status(200)
         .cookie('accessToken', token,  accessCookieOptions)
         .cookie('refreshToken', refreshToken,refreshCookieOptions)
         .json({ Login: true, message: 'Login successful' })
         
        } else {

            res.json({ Login: false, Message: " Invalid Email or Password" })
        }
    } catch (error) {
        res.status(400).json(error)
    }
})



app.get('/dashboard', verifyuser, async (req, res) => {
    try {
        const userEmail = req.email
        const allBlogs = await Blog.find({}).populate('author').sort({ createdAt: -1 })

        // console.log(allBlogs)

        const userDetails = await Register.findOne({ email: userEmail });


        return res.json({ valid: true, user: userDetails, allBlogs: allBlogs, message: "authorized" })
    } catch (error) {
        // console.log(req.headers);  
        console.log('error in dashboard', error)
    }

})



//newpost
app.get('/newpost', verifyuser, async (req, res) => {
    try {
        return res.json({ valid: true, message: "authorized" })
    } catch (error) {

        console.log('error in newpost', error)
    }

})

app.post('/newpost', verifyuser, upload.single('file'), async (req, res) => {
    try {
        const userEmail = await req.email
        const userDetails = await Register.findOne({ email: userEmail });
        const userId = userDetails._id;
        const { title, summary, content } = req.body
        const { filename, path, originalname } = req.file

        const parts = originalname.split('.')
        const fileType = parts[parts.length - 1]
        const newPath = path + '.' + fileType;

        fs.renameSync(path, newPath)
        
        //call the uploadImageOnCloud function

       const response=await uploadImageOnCloud(newPath)
       // console.log("file uploaded",response.url)


        await Blog.create({
            title: title,
            summary: summary,
            content: content,
            coverImage: response.url,
            author: userId
        })

        return res.json({ valid: true, message: "authorized" })
    } catch (error) {

        console.log('error in newpost', error)
    }

})

app.post('/editblog',verifyuser,async(req,res)=>{
    const { newTitle,newSummary,newContent,blogId} = req.body
    const  blogToEdit=await Blog.findById(blogId)

    blogToEdit.title=newTitle
    blogToEdit.summary=newSummary
    blogToEdit.content=newContent

    await  blogToEdit.save()
    
   return res.send("Blog has been updated")
})

app.post('/views', async (req, res) => {
  
    const { id } = req.body

    const findBlog = await Blog.findOne({ _id: id })
  

    findBlog.views += 1;
    await findBlog.save()

    return res.json({ message: 'Updated view count' })

})



app.get('/singleblog', verifyuser, async (req, res) => {
    try {
        return res.json({ valid: true, message: "authorized" })
    } catch (error) {

        console.log('error in single blog', error)
    }

})


app.post('/comment', verifyuser, async (req, res) => {


    try {
        const userEmail = await req.email;
        const userDetails = await Register.findOne({ email: userEmail });
        let { name, _id } = userDetails;
        const { newComment, singleBlogId } = await req.body

        await Comment.create({
            username: name,
            userId: _id,
            commentDesc: newComment,
            blogId: singleBlogId
        })

        return res.json({ status: 'comment added' })
    } catch (error) {

    }
})
app.post('/deletecomment', async (req, res) => {
    const { deleteCommentId } = req.body
    const deleteComment = await Comment.deleteOne({ _id: deleteCommentId })

    return res.json({ message: `Comment deleted with id ${deleteCommentId}` })
})

app.get('/comment', async (req, res) => {
    const comments = await Comment.find({}).populate('userId').sort({ createdAt: -1 })

    return res.json(comments)
})


app.get('/profile', verifyuser, async (req, res) => {
    try {

        return res.json({ valid: true, message: "authorized" })
    } catch (error) {

        console.log('error in profile', error)
    }

})

app.post('/profile', async (req, res) => {
    try {
        const { id } = req.body
        const userDetails = await Register.findOne({ _id: id })

        return res.json(userDetails)
    } catch (error) {
        console.log(error)
    }
})

app.post('/profileimage', verifyuser, upload.single('profilePicture'), async (req, res) => {
    const userEmail = await req.email

    const { mimetype, path } = req.file
    const parts = mimetype.split('/')
    const fileType = parts[parts.length - 1]
    const newPath = path + '.' + fileType;

    fs.renameSync(path, newPath)

    //call the uploadImageOnCloud function

    const response=await uploadImageOnCloud(newPath)
    // console.log("file uploaded",response.url)

    const findUser = await Register.findOneAndUpdate({ email: userEmail }, { $set: { profileImage: response.url } })
  
    return res.json({ profileUrl: response.url })
})


app.post('/updatebio', verifyuser, async (req, res) => {
   
    const { newName, newBio } = req.body
    const userEmail = await req.email
    const findUser = await Register.findOneAndUpdate({ email: userEmail }, { $set: { bio: newBio, name: newName } })
    
    return res.json({ message: "Bio Updated Successfully!" });
})

app.post('/deleteblog', async (req, res) => {

    const { blogId } = req.body
    const deleteBlog = await Blog.deleteOne({ _id: blogId })
    
    return res.json({ message: `Blog with id ${blogId} deleted` })
})

app.post('/logout', verifyuser, async (req, res) => {
    try {
    
       return  res
        .status(200)
        .clearCookie('accessToken',accessCookieOptions)
        .clearCookie('refreshToken',refreshCookieOptions)
        .json({ valid: false, message: 'Logged Out' })
     
    } catch (error) {
        console.log(error)
    }
})


app.listen(PORT, () => {
    console.log(`listening at port ${PORT} `)
})
