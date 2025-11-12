import React from 'react'
import { useNavigate } from 'react-router-dom'


const Logout = () => {
 const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/login'); 
  };

    return (
        <div className='min-h-screen flex items-center justify-center p-4 bg-[url("https://i.pinimg.com/736x/e2/3d/fe/e23dfe43da22ddcef418d551be2161df.jpg")] bg-cover bg-center'>
            <div className="bg-gradient-to-br from-[#2D1B0E] to-[#4a372a]  rounded-xl p-6 w-full max-w-[480px] relative border-4 border-amber-700/30 shadow-[0_0_30px] shadow-amber-500/30">
                <div className='justify-items-center'>
                    <h1 className='font-serif text-amber-500 font-bold text-xl p-5'>Create Account</h1>
                </div>
                <div className=' relative  mb-5 text-amber-500 '>

                    <input type='text' placeholder='username' className='w-full rounded-lg  px-4 py-3 border-1 border-amber-500 placeholder-amber-300' />
                </div>

                <div className=' relative  mb-5 text-amber-500 '>

                    <input type='Email' placeholder='Email' className='w-full rounded-lg  px-4 py-3 border-1 border-amber-500 placeholder-amber-300' />
                </div>
                <div className=' relative mb-5   text-amber-500 '>

                    <input type='password' placeholder='password' className='w-full rounded-lg  px-4 py-3 border-1 border-amber-500 placeholder-amber-300' />
                </div>

                <div className='mb-4'>
                    <button className='w-full bg-amber-500 text-black font-serif cursor-pointer rounded-lg px-4 py-3 font-bold'>Sign Up</button>
                </div>
                <div className='relative flex'>

                    <button 
                     onClick={handleBackToLogin}
                    className='w-full text-amber-500 cursor-pointer hover:text-amber-700 font-serif text-lg'>Back to Login</button>
                </div>
            </div>
        </div>
    )
}

export default Logout