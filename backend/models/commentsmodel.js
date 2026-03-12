const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const commentSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true
    },
    commentDesc: {
        type: String,
        required: true
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    isLikedByAuthor: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Comment = new model("Comment", commentSchema)
module.exports = Comment;