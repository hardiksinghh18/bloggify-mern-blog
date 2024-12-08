import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios';
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState();



  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/dashboard`)
      if (res.data) {
        setUserInfo(res?.data?.user)
        setIsAuthenticated(res?.data?.valid)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  // console.log(userInfo)

  return (
    <AuthContext.Provider value={{ userInfo, setUserInfo, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}


const useAuthContext = () => {
  return useContext(AuthContext);
};

export { AuthProvider, AuthContext, useAuthContext };
