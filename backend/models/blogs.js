const mongoose=require('mongoose')

const blogSchema=new mongoose.Schema({
   title :{
    type:String,
    required:true
   },
   summary :{
    type:String,
    required:true
   },
   content:{
    type:String,
    required:true
   },
   coverImage:{
    type:String,
   },
   author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Register',
    required:true  
   },
   views:{
    type:Number,
    default:0
   }
},{
  timestamps:true
})



const Blog=new mongoose.model('Blog',blogSchema);

module.exports=Blog;
