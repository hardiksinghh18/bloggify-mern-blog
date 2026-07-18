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
    <form onSubmit={handleSave} encType="multipart/form-data" className="flex flex-col items-center mt-2 w-full">
      <h2 className="text-lg font-bold mb-5 text-gray-900 dark:text-gray-100">Update Profile Picture</h2>
      
      <div className="overflow-hidden rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-800/30 p-1 mb-5 flex justify-center items-center shadow-inner">
        <AvatarEditor
          ref={setEditor}
          image={image}
          width={180}
          height={180}
          border={30}
          borderRadius={90}
          color={[18, 18, 18, 0.7]}
          scale={1.2}
          rotate={0}
        />
      </div>

      <label 
        htmlFor="profile-upload" 
        className="flex items-center justify-center gap-2 text-xs font-semibold px-4 py-2.5 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl hover:border-[#b8004e] hover:text-[#b8004e] transition-colors cursor-pointer w-full text-center max-w-[240px] truncate"
      >
        <i className='bx bx-upload text-sm'></i>
        {image && typeof image !== 'string' ? image.name : 'Choose Image'}
      </label>
      <input
        type="file"
        id="profile-upload"
        onChange={(e) => setImage(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />

      <LoadingButton
        loading={uploadLoading}
        type='submit'
        className="mt-6 w-full bg-[#b8004e] hover:bg-[#9a0042] text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
        sx={{
          textTransform: 'none',
          fontFamily: 'inherit',
          fontWeight: 700,
          bgcolor: '#b8004e',
          color: '#ffffff',
          width: '100%',
          '&:hover': { bgcolor: '#9a0042' }
        }}
      >
        Save Profile Picture
      </LoadingButton>
    </form>
  );
};

export default ProfilePictureEditor;
