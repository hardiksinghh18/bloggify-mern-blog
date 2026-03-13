
require('dotenv').config();
const express = require('express')
const multer = require('multer')
const upload = multer({ dest: '/tmp/uploads/' })
const uploadImageOnCloud = require('./utils/cloudinary')
const cors = require('cors')
const fs = require('fs')
require('./mongo/connection')
const Register = require('./models/usermodel')
const Comment = require('./models/commentsmodel')
const Blog = require('./models/blogs')
const verifyuser = require('./middleware/verifyuser')
const bcrypt = require('bcryptjs')
const app = express()

const PORT = process.env.PORT || 5000
const cookieParser = require('cookie-parser')
const accessCookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: 'None'
}
const refreshCookieOptions = {
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
    origin: process.env.BASE_URL,
    // origin: ['https://bloggify-mern.vercel.app'],
    methods: ["POST", "GET"],
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
        const user = new Register({
            name: name,
            email: email,
            password: password
        })

        const token = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshToken();

        await user.save()

        return res
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

            return res
                .status(200)
                .cookie('accessToken', token, accessCookieOptions)
                .cookie('refreshToken', refreshToken, refreshCookieOptions)
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const allBlogs = await Blog.find({})
            .populate('author')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments({});
        const userDetails = await Register.findOne({ email: userEmail });

        return res.json({ 
            valid: true, 
            user: userDetails, 
            allBlogs: allBlogs, 
            totalBlogs: totalBlogs,
            message: "authorized" 
        })
    } catch (error) {
        console.log('error in dashboard', error)
        res.status(500).json({ message: "Internal server error" })
    }
})

// Public route - no auth required, allows anyone to read blogs
app.get('/me', verifyuser, async (req, res) => {
    try {
        const userEmail = req.email;
        const userDetails = await Register.findOne({ email: userEmail });
        return res.json({ valid: true, user: userDetails });
    } catch (error) {
        console.log('error in /me', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get('/blogs', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const allBlogs = await Blog.find({})
            .populate('author')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments({});
        return res.json({ allBlogs, totalBlogs })
    } catch (error) {
        console.log('error in public blogs', error)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

// Trending blogs endpoint - ranks blogs by engagement score with time decay
app.get('/trending', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        
        const trendingBlogs = await Blog.aggregate([
            // Calculate basic counts and engagement score
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } },
                    // Convert date to hours since now for decay
                    hoursAge: {
                        $divide: [
                            { $subtract: [new Date(), "$createdAt"] },
                            1000 * 60 * 60
                        ]
                    }
                }
            },
            // Lookup comments count
            {
                $lookup: {
                    from: "comments",
                    let: { blogId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $and: [
                            { $eq: ["$blogId", "$$blogId"] },
                            { $eq: ["$parentCommentId", null] }
                        ] } } },
                        { $count: "count" }
                    ],
                    as: "comments"
                }
            },
            {
                $addFields: {
                    commentsCount: { $ifNull: [{ $arrayElemAt: ["$comments.count", 0] }, 0] }
                }
            },
            // Calculate final trending score with decay
            // Score = (views*1 + likes*3 + comments*2) / sqrt(ageDays + 1)
            {
                $addFields: {
                    rawScore: {
                        $add: [
                            { $multiply: ["$views", 1] },
                            { $multiply: ["$likesCount", 3] },
                            { $multiply: ["$commentsCount", 2] }
                        ]
                    },
                    decay: {
                        $sqrt: { $add: [{ $divide: ["$hoursAge", 24] }, 1] }
                    }
                }
            },
            {
                $addFields: {
                    trendingScore: { $divide: ["$rawScore", "$decay"] }
                }
            },
            // Sort, limit, and populate author (manually joins since aggregate doesn't auto-populate)
            { $sort: { trendingScore: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "registers", // or whatever your user collection is named
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" }
        ]);

        return res.json({ trendingBlogs });
    } catch (error) {
        console.log('error in trending', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

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
        const response = await uploadImageOnCloud(newPath);
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

app.post('/editblog', verifyuser, async (req, res) => {
    const { newTitle, newSummary, newContent, blogId } = req.body
    const blogToEdit = await Blog.findById(blogId)

    blogToEdit.title = newTitle
    blogToEdit.summary = newSummary
    blogToEdit.content = newContent

    await blogToEdit.save()

    return res.json({ message: "Blog has been updated" })
})

app.post('/views', async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.updateOne({ _id: id }, { $inc: { views: 1 } });
        return res.json({ message: 'Updated view count' });
    } catch (error) {
        console.log('error in views', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/likeblog', verifyuser, async (req, res) => {
    try {
        const { blogId } = req.body;
        const userEmail = req.email;
        const userDetails = await Register.findOne({ email: userEmail });
        const userId = userDetails._id;

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Check if user already liked
        const hasLiked = blog.likes.includes(userId);

        if (hasLiked) {
            blog.likes.pull(userId); // Unlike
        } else {
            blog.likes.push(userId); // Like
            blog.dislikes.pull(userId); // Remove dislike if existed
        }

        await blog.save();
        return res.json({ message: 'Blog like status updated', likes: blog.likes, dislikes: blog.dislikes });
    } catch (error) {
        console.log('error in likeblog', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/dislikeblog', verifyuser, async (req, res) => {
    try {
        const { blogId } = req.body;
        const userEmail = req.email;
        const userDetails = await Register.findOne({ email: userEmail });
        const userId = userDetails._id;

        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        // Check if user already disliked
        const hasDisliked = blog.dislikes.includes(userId);

        if (hasDisliked) {
            blog.dislikes.pull(userId); // Undislike
        } else {
            blog.dislikes.push(userId); // Dislike
            blog.likes.pull(userId); // Remove like if existed
        }

        await blog.save();
        return res.json({ message: 'Blog dislike status updated', likes: blog.likes, dislikes: blog.dislikes });
    } catch (error) {
        console.log('error in dislikeblog', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

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
        const { newComment, singleBlogId, parentCommentId } = await req.body
        await Comment.create({
            username: name,
            userId: _id,
            commentDesc: newComment,
            blogId: singleBlogId,
            parentCommentId: parentCommentId || null
        })

        return res.json({ status: 'comment added' })
    } catch (error) {

    }
})
app.post('/likecomment', verifyuser, async (req, res) => {
    try {
        const { commentId } = req.body;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.isLikedByAuthor = !comment.isLikedByAuthor;
        await comment.save();

        return res.json({ message: 'Comment like toggled', isLikedByAuthor: comment.isLikedByAuthor });
    } catch (error) {
        console.log('error in likecomment', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/deletecomment', async (req, res) => {
    const { deleteCommentId } = req.body
    await Comment.deleteOne({ _id: deleteCommentId })
    await Comment.deleteMany({ parentCommentId: deleteCommentId })

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
            .select('-password')
            .populate('followers', 'name profileImage')
            .populate('following', 'name profileImage');

        if (!userDetails) return res.status(404).json({ message: 'User not found' });

        return res.json(userDetails)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
    }
})

app.post('/profileimage', verifyuser, upload.single('profilePicture'), async (req, res) => {
    const userEmail = await req.email

    const { mimetype, path } = req.file
    const parts = mimetype.split('/')
    const fileType = parts[parts.length - 1]
    const newPath = path + '.' + fileType;

    fs.renameSync(path, newPath)
    const response = await uploadImageOnCloud(newPath)
    const findUser = await Register.findOneAndUpdate({ email: userEmail }, { $set: { profileImage: response.url } })

    return res.json({ profileUrl: response.url })
})


app.post('/updatebio', verifyuser, async (req, res) => {
    const { newName, newBio } = req.body
    const userEmail = await req.email
    const findUser = await Register.findOneAndUpdate({ email: userEmail }, { $set: { bio: newBio, name: newName } })

    return res.json({ message: "Bio Updated Successfully!" });
})

app.post('/follow', verifyuser, async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserEmail = req.email;
        
        const currentUser = await Register.findOne({ email: currentUserEmail });
        const targetUser = await Register.findById(targetUserId);

        if (!targetUser) return res.status(404).json({ message: 'Target user not found' });
        if (currentUser._id.toString() === targetUserId) return res.status(400).json({ message: "You can't follow yourself" });

        const isFollowing = currentUser.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(currentUser._id);
            await currentUser.save();
            await targetUser.save();
            return res.json({ message: 'Unfollowed successfully', isFollowing: false });
        } else {
            // Follow
            currentUser.following.push(targetUserId);
            targetUser.followers.push(currentUser._id);
            await currentUser.save();
            await targetUser.save();
            return res.json({ message: 'Followed successfully', isFollowing: true });
        }
    } catch (error) {
        console.log('error in follow', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/deleteblog', async (req, res) => {
    const { blogId } = req.body
    const deleteBlog = await Blog.deleteOne({ _id: blogId })

    return res.json({ message: `Blog with id ${blogId} deleted` })
})

app.post('/logout', verifyuser, async (req, res) => {
    try {
        return res
            .status(200)
            .clearCookie('accessToken', accessCookieOptions)
            .clearCookie('refreshToken', refreshCookieOptions)
            .json({ valid: false, message: 'Logged Out' })

    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => {
    console.log(`listening at port ${PORT} `)
})
