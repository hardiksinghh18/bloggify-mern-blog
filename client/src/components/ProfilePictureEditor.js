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
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/profileimage`, formData, {
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
        width={150}
        height={150}
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
         className="   pl-32 text-xs  px-8  max-w-fit  overflow-hidden  p-2 "
      />
      <button

        type='submit'
       className="mt-4 bg-zinc-900 text-xs   text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Profile Picture
      </button>
    </form>
  );
};

export default ProfilePictureEditor;
