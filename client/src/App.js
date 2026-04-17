
import './App.css';
import { StyledEngineProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Enter from './Pages/Enter';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import CreatePost from './Pages/CreatePost';
import Navbar from './components/Navbar';
import SingleBlog from './Pages/SingleBlog';
import UserProfile from './Pages/UserProfile';
import Footer from './components/Footer';

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
            <Route path="/blogs" element={<Dashboard />} />
            <Route path="/newpost" element={<CreatePost />} />
            <Route path='/blogs/:id/:title' element={<SingleBlog />} />
            <Route path='/profile/:id/:name' element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </StyledEngineProvider>
  );
}

export default App;
