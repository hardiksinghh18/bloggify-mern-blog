import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../features/auth/authApiSlice';
import { setAuthenticated } from '../features/auth/authSlice';
import LoadingButton from '@mui/lab/LoadingButton';

const Enter = () => {
    const dispatch = useDispatch();
    const [isActive, setisActive] = useState(false)
    const [show, setShow] = useState(false)
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const [login, { isLoading: loginLoading }] = useLoginMutation();
    const [register, { isLoading: registerLoading }] = useRegisterMutation();

    const handleRegister = () => {
        setisActive(false)
    }
    const handleLogin = () => {
        setisActive(true)
    }


    const handleregister = async (e) => {
        e.preventDefault();

        try {
            const res = await register({ name, email, password }).unwrap();
            if (res?.valid) {
                toast.success('Registered Successfully !')
                dispatch(setAuthenticated(true));
                navigate('/')
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
            const res = await login({ email, password }).unwrap();

            if (res?.Login) {
                dispatch(setAuthenticated(true));
                toast.success('Login successful!');
                navigate('/')
            } else {
                dispatch(setAuthenticated(false));
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

                <div className={isActive ? 'form_container activeForm justify-center items-center w-full     sm:w-[50vw] ' : 'form_container justify-center items-center w-full sm:w-[50vw]'} id="form_container">

                    <div className='form-container sign-up sm:translate-x-full'>
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
                            <LoadingButton fullWidth loading={loginLoading} className='mt-16' type='submit'>Sign In</LoadingButton>

                            <div className=" flex   gap-2 mt-4 justify-center text-xs sm:text-base items-center sm:hidden">
                                <h1 className='font-semibold'>Don't have an account ?</h1>
                                <p className=" font-semibold  border-black  border-b-[.5px]  hover:cursor-pointer" id="register" onClick={handleRegister}>Register</p>
                            </div>
                        </form>

                    </div>
                    <div className="form-container sign-in">
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
                            <LoadingButton fullWidth loading={registerLoading} type='submit'>Register</LoadingButton>

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
                                <button className="hiddennew" id="register" onClick={handleRegister}>Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </>
    )
}

export default Enter
