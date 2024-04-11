
import './App.css';
import { AuthProvider, useAuthContext } from './context/userContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Enter from './Pages/Enter';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import CreatePost from './Pages/CreatePost';
import Navbar from './components/Navbar';
import SingleBlog from './Pages/SingleBlog';
import { BlogProvider } from './context/BlogContext';
import UserProfile from './Pages/UserProfile';
import Footer from './components/Footer';

function App() {

  return (
    <>
      <AuthProvider>
        <BlogProvider>
          {/* <ToastContainer floatingTime={5000} /> */}
          <ToastContainer
          className={'text-sm '}
            position="bottom-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          // transition: Bounce,
          />

          <Navbar/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Enter />} />
            <Route path="/blogs" element={<Dashboard />} />
            <Route path="/newpost" element={<CreatePost />} />
            <Route path='/blogs/:id/:title' element={<SingleBlog />} />
            <Route path='/profile/:id/:name' element={<UserProfile />} />


            {/* 
          <Route path="*" element={<NotFound />} /> */}
          </Routes>
          <Footer/>
        </BlogProvider>
      </AuthProvider>
    </>
  );
}

export default App;
