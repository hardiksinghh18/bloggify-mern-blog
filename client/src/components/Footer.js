import React from 'react';

const Footer = () => {
  return (
    <footer className="footer w-screen     text-white  mt-16">
    <div className="container flex flex-wrap justify-between items-center p-8 ">
      <div className="w-full  mb-4 md:mb-0 flex flex-col justify-center items-center">
        <p className="  sm:text-xl font-semibold">Bloggify</p>
        <p className="text-gray-400 mt-2 text-xs sm:text-sm">Share your thoughts on web development and more!</p>
        <p className="text-gray-400 mt-4 text-sm">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
      
    </div>
  </footer>
  );
};

export default Footer;
