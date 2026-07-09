import React from 'react'
import logo from '../assets/logo.jpg'

function SignUp() {
  return (
    <div className='bg-[#dddddb] w-[100vw] h-[100vh] flex items-center justify-center'>
      <form className='w-[90%] md:w-[900px] h-[600px] bg-white shadow-xl rounded-2xl flex'>

        {/* Left Div */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3'>
          <div>
            <h1 className='font-semibold text-black text-2xl'>
              Let's get started
            </h1>

            <h2 className='text-[#999797] text-[18px]'>
              Create your account
            </h2>
          </div>
          <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
  <label htmlFor='name' className='font-semibold'>
    Name
  </label>

  <input
    id='name'
    type='text'
    className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
    placeholder='Your name'
  />
</div>
        </div>

        {/* Right Div */}
        <div className='w-[50%] h-[100%] rounded-r-2xl bg-black hidden md:flex items-center justify-center flex-col'>
          <img
            src={logo}
            alt='logo'
            className='w-[120px] shadow-2xl'
          />

          <span className='text-white text-2xl font-semibold mt-4'>
            VIRTUAL COURSES
          </span>
        </div>

      </form>
    </div>
  )
}

export default SignUp