// import {v2 as cloudinary} from 'cloudinary';
const cloudinary = require('cloudinary');
const fs = require('fs')
          
cloudinary.config({ 
  cloud_name: 'dhyhsux8c', 
  api_key: '521863428375886', 
  api_secret: '2fexwoeDH4_Vhnk7t4v-6E_0QqY' 
});


const uploadImageOnCloud=async(localFilePath)=>{

    try {
        if(!localFilePath) return null;
        const response=await  cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})
        //upload file uploadeed 

        // console.log('File successfully uploaded on cloudinary',response)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove  the local copy of the image after uploading to clodinary
        return null
    }
}

module.exports=uploadImageOnCloud