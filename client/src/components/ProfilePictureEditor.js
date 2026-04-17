import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import LoadingButton from '@mui/lab/LoadingButton';
import { useUploadProfileImageMutation } from '../features/user/userApiSlice';

const ProfilePictureEditor = (props) => {
  const { profileImageUrl, isOpen, setIsOpen } = props
  const [image, setImage] = useState(profileImageUrl);
  const [editor, setEditor] = useState(null);

  const [uploadProfileImage, { isLoading: uploadLoading }] = useUploadProfileImageMutation();

  const handleSave = async (e) => {
    e.preventDefault()

    try {

      if (editor) {
        const canvas = editor.getImage();
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        const formData = new FormData();
        formData.append('profilePicture', blob);
        await uploadProfileImage(formData).unwrap();

        setIsOpen(!isOpen)
      }
    } catch (error) {
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
      <LoadingButton

        loading={uploadLoading}
        type='submit'
        className="mt-4 bg-zinc-900 text-xs text-white px-4 hover:bg-blue-600"
      >
        Save Profile Picture
      </LoadingButton>
    </form>
  );
};

export default ProfilePictureEditor;
