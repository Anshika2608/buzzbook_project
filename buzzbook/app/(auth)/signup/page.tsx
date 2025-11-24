import SignupForm from '@/components/forms/SignupForm'
import React from 'react'

const Signup = () => {
  return (
    <div className="
      min-h-screen 
      flex flex-col items-end justify-center 
      bg-cover bg-center 
      md:bg-[url('/login1.png')] 
      bg-[url('/login2.png')] 
      md:pr-20
      xl:pr-40
    ">
      <div className="bg-opacity-80 p-8 rounded-lg shadow-lg">
        <SignupForm />
      </div>
    </div>
  )
}

export default Signup