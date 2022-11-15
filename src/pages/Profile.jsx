import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';



export default function Profile() {

  const auth = getAuth();
  const navigate = useNavigate();

  const initialValues = {
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  }
  
  const [formData, setFormData] = useState(initialValues);
  
  const {name, email} = formData;

  const onLogout = () => {
    auth.signOut();
    toast.error('Signed out successfully!');
    navigate('/');
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center flex-col items-center'>
        <h1 className='text-3xl text-center font-bold mt-6'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          {/* Name input */}

          <input type='text' id='name' value={name} disabled className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-outS' />
          {/* Email input */}

          <input type='email' id='email' value={email} disabled className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-outS' />

          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
            <p className='flex items-center'>Do you want to change your name?
            <span className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>Edit</span>
            </p>
            <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer'>Sign out</p>
          </div>
        
        </form>
      </div>
      </section>
    </>
  )
}
