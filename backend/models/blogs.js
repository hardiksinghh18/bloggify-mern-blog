const mongoose = require('mongoose')
const slugify = require('../utils/slugify')

async function generateUniqueSlug(title, blogId = null) {
  let baseSlug = slugify(title);
  if (!baseSlug) baseSlug = "post";
  
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const query = { slug };
    if (blogId) {
      query._id = { $ne: blogId };
    }
    const existingBlog = await mongoose.models.Blog.findOne(query);
    if (!existingBlog) {
      return slug;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
 
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  summary: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Register',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Register'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Register'
  }]
}, {
  timestamps: true
})

blogSchema.pre('validate', async function (next) {
  if (this.title && (this.isModified('title') || !this.slug)) {
    this.slug = await generateUniqueSlug(this.title, this._id);
  }
  next();
});

const Blog = new mongoose.model('Blog', blogSchema);
module.exports = Blog;
