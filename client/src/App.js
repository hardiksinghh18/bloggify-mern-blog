
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Enter from './Pages/Enter';
import Home from './Pages/Home';
import Explore from './Pages/Explore';
import MyBlogs from './Pages/MyBlogs';
import CreatePost from './Pages/CreatePost';
import SingleBlog from './Pages/SingleBlog';
import UserProfile from './Pages/UserProfile';
import Navbar from './components/Navbar';

function App() {

  return (
    <StyledEngineProvider injectFirst>
      <div className="flex flex-col min-h-screen w-full">
        <ToastContainer
          className={'text-sm '}
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Enter />} />
            <Route path="/blogs" element={<Explore />} />
            <Route path="/my-blogs" element={<MyBlogs />} />
            <Route path="/newpost" element={<CreatePost />} />
            <Route path='/blogs/:slug' element={<SingleBlog />} />
            <Route path='/profile/:username' element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </StyledEngineProvider>
  );
}

export default App;
