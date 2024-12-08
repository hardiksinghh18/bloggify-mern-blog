import React, { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/userContext';
 
const Enter = () => {
    const { isAuthenticated, setIsAuthenticated } = useAuthContext()
    const [isActive, setisActive] = useState(false)
    const [show, setShow] = useState(false)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState(false);
    const navigate = useNavigate()

    axios.defaults.withCredentials = true;

    const handleRegister = () => {
        setisActive(false)
        // container.classList.remove("active");
    }
    const handleLogin = () => {
        setisActive(true)
        // container.classList.add("active");
    }


    const handleregister = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/register`, {
                name, email, password

            })
            if (res?.data?.valid) {
                toast.success('Registered Successfully !')
                setIsAuthenticated(true)
                navigate('/blogs')
            } else {
                toast.error('Please try again.')
                navigate('/login')
            }


        } catch (error) {
            toast.error('Email already registered. ')
            console.log(error)
        }

    }


    const handlelogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, {
                email, password
            })

            if (res?.data?.Login) {
                setIsAuthenticated(true)
                toast.success('Login successful!');
                navigate('/')
            } else {
                setIsAuthenticated(false)
                toast.error('Login failed. Please check your credentials.');
                navigate('/login')
            }

        } catch (error) {
            toast.error('An error occurred. Please try again later.');
            console.log(error)

        }
    }


    const handleShow = () => {
        setShow(!show)
    }

    return (
        <>


            <div className="signup_page  ">

                <div className={isActive ? 'form_container activeForm justify-center items-center w-full     sm:w-[60vw] ' : 'form_container justify-center items-center w-full sm:w-[60vw]'} id="form_container">

                    <div className='form-container   sign-up sm:translate-x-full '>
                        <form action='/login' method='POST' onSubmit={handlelogin} >
                            <h1 className='mb-4 font-bold text-xl'>Sign In</h1>

                            <input type="email" placeholder="Email" name='email' autoComplete='email' id='emaillogin' required onChange={(e) => setEmail(e.target.value)} />
                            <div className='relative flex w-full'>

                                <input type={show ? 'text' : "password"} placeholder="Password" name='password' autoComplete='password' required onChange={(e) => setPassword(e.target.value)} />


                                {show ? (
                                    <i onClick={handleShow} className='bx bxs-show absolute top-[1.25rem] right-4 hover:cursor-pointer'></i>
                                ) : (
                                    <i onClick={handleShow} className='bx bxs-hide absolute top-[1.25rem] right-4 hover:cursor-pointer'></i>
                                )}

                            </div>
                            <button className='mt-16'>Sign In</button>



                            <div className=" flex   gap-2 mt-4 justify-center text-xs sm:text-base items-center sm:hidden">
                                <h1 className='font-semibold'>Don't have an account ?</h1>
                                <p className=" font-semibold  border-black  border-b-[.5px]  hover:cursor-pointer" id="register" onClick={handleRegister}>Sign Up</p>
                            </div>
                        </form>

                    </div>
                    <div className="form-container sign-in sm:px-6 ">
                        <form onSubmit={handleregister}>
                            <h1 className='  font-bold'>New to Bloggify ?</h1>
                            <h1 className='mb-4 font-bold text-xl'>Create Account</h1>

                            <input type="text" placeholder="Name" name='name' id='name' required onChange={(e) => setName(e.target.value)} />
                            <input type="email" placeholder="Email" name='email' id='email' required onChange={(e) => setEmail(e.target.value)} />
                            <div className='relative flex w-full'>

                                <input type={show ? 'text' : "password"} placeholder="Password" name='password' autoComplete='password' required onChange={(e) => setPassword(e.target.value)} />


                                {show ? (
                                    <i onClick={handleShow} className='bx bxs-show absolute top-[1.25rem] right-4 hover:cursor-pointer'></i>
                                ) : (
                                    <i onClick={handleShow} className='bx bxs-hide absolute top-[1.25rem] right-4 hover:cursor-pointer'></i>
                                )}

                            </div>
                            <button type='submit'>Sign Up</button>

                            <div className=" flex gap-2 mt-4 justify-center text-xs sm:text-base items-center sm:hidden">
                                <h1 className='font-semibold'>Already a User ?</h1>
                                <p className=" font-semibold  border-black  border-b-[.5px] hover:cursor-pointer" id="login" onClick={handleLogin}>Sign In</p>
                            </div>
                        </form>


                    </div>



                    <div className="toggle-container  sm:block ">
                        <div className="toggle">
                            <div className="toggle-panel toggle-right">
                                <h1 className='font-semibold'>Already a User ?</h1>
                                <p>Enter your  details to  login.</p>
                                <button className="hiddennew" id="login" onClick={handleLogin}>Sign In</button>
                            </div>
                            <div className="toggle-panel toggle-left">
                                <h1 className='font-semibold'>Don't have an account ?</h1>
                                <p>Register and create a new account for free !</p>
                                <button className="hiddennew" id="register" onClick={handleRegister}>Sign Up</button>
                            </div>
                        </div>
                    </div>
                </div>






            </div>







{/* 

            <div className='flex'>
                <div className={isActive ? 'form_container active  justify-center items-center w-full flex sm:hidden    sm:w-[60vw] ' : 'form_container flex sm:hidden  justify-center items-center w-full sm:w-[60vw]'} id="form_container">

                    <div className='form-container   sign-up '>
                        <form action='/login' method='POST' onSubmit={handlelogin} >
                            <h1 className='mb-4 font-bold text-xl'>Sign In</h1>

                            <input type="email" placeholder="Email" name='email' autoComplete='email' id='emaillogin' required onChange={(e) => setEmail(e.target.value)} />
                            <div className='relative flex w-full'>

                                <input type={show ? 'text' : "password"} placeholder="Password" name='password' autoComplete='password' required onChange={(e) => setPassword(e.target.value)} />


                                {show ? (
                                    <i onClick={handleShow} className='bx bxs-show absolute top-[1.25rem] right-4 hover:cursor-pointer'></i>
                                ) : (
                                    <i onClick={handleShow} className='bx bxs-hide absolute top-[1.25rem] right-4 hover:cursor-pointer'></i>
                                )}

                            </div>
                            <button className='mt-16'>Sign In</button>



                            <div className=" flex   gap-2 mt-4 justify-center items-center sm:hidden">
                                <h1 className='font-semibold'>Don't have an account ?</h1>
                                <p className=" font-semibold  border-black  border-b-[1px] text-xl hover:cursor-pointer" id="register" onClick={handleRegister}>Sign Up</p>
                            </div>
                        </form>

                    </div>
                    <div className="form-container sign-in sm:px-6 ">
                        <form onSubmit={handleregister}>
                            <h1 className='  font-bold'>New to Bloggify ?</h1>
                            <h1 className='mb-4 font-bold text-xl'>Create Account</h1>

                            <input type="text" placeholder="Name" name='name' id='name' required onChange={(e) => setName(e.target.value)} />
                            <input type="email" placeholder="Email" name='email' id='email' required onChange={(e) => setEmail(e.target.value)} />
                            <div className='relative flex w-full'>

                                <input type={show ? 'text' : "password"} placeholder="Password" name='password' autoComplete='password' required onChange={(e) => setPassword(e.target.value)} />


                                {show ? (
                                    <i onClick={handleShow} className='bx bxs-show absolute top-[1.25rem] right-4 hover:cursor-pointer'></i>
                                ) : (
                                    <i onClick={handleShow} className='bx bxs-hide absolute top-[1.25rem] right-4 hover:cursor-pointer'></i>
                                )}

                            </div>
                            <button type='submit'>Sign Up</button>

                            <div className=" flex gap-2 mt-4 justify-center items-center sm:hidden">
                                <h1 className='font-semibold'>Already a User ?</h1>
                                <p className=" font-semibold  border-black  border-b-[1px] text-xl hover:cursor-pointer" id="login" onClick={handleLogin}>Sign In</p>
                            </div>
                        </form>


                    </div>




                </div>
            </div> */}

        </>
    )
}

export default Enter
