import React, { useState } from 'react'
import logo from '../assets/logo.jpg'
import google from "../assets/google.png";
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../utils/Firebase'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
    const [name,setName]= useState("")
    const [email,setEmail]= useState("")
    const [password,setPassword]= useState("")
    const [role,setRole]= useState("student")
    const [step, setStep] = useState(1)
    const [otp, setOtp] = useState("")
    const navigate = useNavigate()
    let [show,setShow] = useState(false)
    const [loading,setLoading]= useState(false)
    let dispatch = useDispatch()

    const handleSignUp = async () => {
        if (!name || !email || !password || !role) {
            return toast.error("Please fill in all details");
        }
        setLoading(true)
        try {
            if (step === 1) {
                const result = await axios.post(serverUrl + "/api/auth/send-signup-otp" , { email } , {withCredentials:true} )
                toast.success(result.data.message || "OTP sent successfully")
                setStep(2)
            } else {
                if (!otp) {
                    toast.error("Please enter the OTP sent to your email");
                    return;
                }
                const result = await axios.post(serverUrl + "/api/auth/signup" , {name , email , password , role, otp} , {withCredentials:true} )
                dispatch(setUserData(result.data))
                navigate("/")
                toast.success("SignUp Successfully")
            }
        } 
        catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message || "SignUp failed")
        } finally {
            setLoading(false)
        }
    }

    const googleSignUp = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            console.log(response)
            let user = response.user
            let name = user.displayName;
            let email=user.email
            
            const result = await axios.post(serverUrl + "/api/auth/googlesignup" , {name , email ,role}
                , {withCredentials:true}
            )
            dispatch(setUserData(result.data))
            navigate("/")
            toast.success("SignUp Successfully")
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || error.message || "Google signup failed")
        }
    }

    return (
        <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
            <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex' onSubmit={(e)=>e.preventDefault()}>
                <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
                    <div>
                        <h1 className='font-semibold text-black text-2xl'>Let's get Started</h1>
                        <h2 className='text-[#999797] text-[18px]'>{step === 1 ? "Create your account" : "Verify your email"}</h2>
                    </div>

                    {step === 1 ? (
                        <>
                            <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                                <label htmlFor="name" className='font-semibold text-black text-md'>
                                    Name
                                </label>
                                <input id='name' type="text" className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] text-black text-2xl outline-none focus:border-black rounded' placeholder='Enter your name' onChange={(e)=>setName(e.target.value)} value={name} />
                            </div>
                            <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                                <label htmlFor="email" className='font-semibold text-black text-md'>
                                    Email
                                </label>
                                <input id='email' type="text" className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] text-black text-2xl outline-none focus:border-black rounded' placeholder='Enter your email' onChange={(e)=>setEmail(e.target.value)} value={email} />
                            </div>
                            <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
                                <label htmlFor="password" className='font-semibold text-black text-md'>
                                    Password
                                </label>
                                <input id='password' type={show?"text":"password"} className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] text-black text-2xl outline-none focus:border-black rounded' placeholder='***********' onChange={(e)=>setPassword(e.target.value)} value={password}/>
                                {!show && <MdOutlineRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={()=>setShow(prev => !prev)}/>}
                                {show && <MdRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={()=>setShow(prev => !prev)} />}
                            </div>
                            <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
                                <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl cursor-pointer text-black ${role === 'student' ? "border-black" : "border-[#646464]"}`} onClick={()=>setRole("student")}>Student</span>
                                <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl cursor-pointer text-black ${role === 'educator' ? "border-black" : "border-[#646464]"}`} onClick={()=>setRole("educator")}>Educator</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
                                <p className="text-gray-500 text-sm text-center w-full">We sent a 4-digit verification code to <span className="font-semibold text-black">{email}</span></p>
                                <label htmlFor="otp" className='font-semibold text-black text-md mt-3'>
                                    Enter OTP
                                </label>
                                <input id='otp' type="text" className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px] text-black text-2xl outline-none focus:border-black rounded text-center tracking-widest' placeholder='1234' maxLength={4} onChange={(e)=>setOtp(e.target.value)} value={otp} />
                            </div>
                            <span className="text-sm text-black cursor-pointer underline underline-offset-2 hover:text-gray-700" onClick={() => setStep(1)}>
                                Change Email / Edit Form
                            </span>
                        </>
                    )}

                    <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]' disabled={loading} onClick={handleSignUp}>
                        {loading ? <ClipLoader size={30} color='white' /> : (step === 1 ? "Send Verification OTP" : "Verify & Create Account")}
                    </button>
                    
                    <div className='w-[80%] flex items-center gap-2'>
                        <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
                        <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center '>Or continue with</div>
                        <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
                    </div>
                    
                    <div className='w-[80%] h-[40px] border-1 border-black rounded-[5px] flex items-center justify-center cursor-pointer hover:bg-gray-50' onClick={googleSignUp}>
                        <img src={google} alt="google" className='w-[25px]' />
                        <span className='text-[18px] text-gray-500 ml-1'>Google</span>
                    </div>
                    
                    <div className='text-[#6f6f6f]'>
                        Already have an account? <span className='underline underline-offset-1 text-black cursor-pointer' onClick={()=>navigate("/login")}>Login</span>
                    </div>
                </div>
                
                <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden'>
                    <img src={logo} className='w-30 shadow-2xl rounded-full' alt="Logo" />
                </div>
            </form>
        </div>
    )
}

export default SignUp

