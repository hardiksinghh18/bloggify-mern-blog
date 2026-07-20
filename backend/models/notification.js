const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: false
    },
    isRead: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: ['admin_action', 'follow', 'like', 'comment'],
        required: true
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
