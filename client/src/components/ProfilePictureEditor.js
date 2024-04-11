import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import axios from 'axios';
import Logo from '../images/Logo.png'

const ProfilePictureEditor = (props) => {
  const { profileImageUrl, isOpen, setIsOpen, toggleModal ,saved,setSaved} = props
  const [url, setUrl] = useState('')
  const [image, setImage] = useState(profileImageUrl);
  const [editor, setEditor] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault()


    // console.log(image)
    try {

      if (editor) {
        const canvas = editor.getImage();
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const formData = new FormData();
        formData.append('profilePicture', blob);
        const response = await axios.post('http://localhost:4000/profileimage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      
        setIsOpen(!isOpen)
        setSaved(!saved)
        // onSave(response.data.imageUrl); // Pass the updated profile picture URL to the parent component
      } 
    }catch (error) {
      console.error(error);
    }
    };

  return (
    <form onSubmit={handleSave} encType="multipart/form-data" className="flex flex-col items-center mt-8">
      <AvatarEditor
        ref={setEditor}
        image={image}
        width={250}
        height={250}
        border={50}
        borderRadius={125}
        color={[255, 255, 255, 0.6]}
        scale={1.2}
        rotate={0}
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <button

        type='submit'
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Profile Picture
      </button>
    </form>
  );
};

export default ProfilePictureEditor;
