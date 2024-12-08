import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios';
const BlogContext = createContext();
const BlogProvider = ({ children }) => {
    const [blogsData, setBlogsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false);


      axios.defaults.withCredentials = true; 

    const fetchBlogData = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard`)
     
            setIsAuthenticated(res?.data?.valid)
            setBlogsData(res?.data?.allBlogs)
            
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    } 
  

    useEffect(() => {
     
            fetchBlogData();
       
      }, []);
    // console.log(blogsData)

   

    return (
        <BlogContext.Provider value={{ blogsData,setBlogsData, loading, setLoading }}>
            {children}
        </BlogContext.Provider>
    )
}


const useBlogContext = () => {
    return useContext(BlogContext);
};

export { BlogProvider, BlogContext, useBlogContext };
