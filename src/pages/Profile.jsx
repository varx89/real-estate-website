import React, { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';



export default function Profile() {

  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);

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

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  }

  const onClick = () => {
    changeDetail && onSubmit();
    setChangeDetail((prevState) => !prevState);
  }

  const onSubmit = async() => {
    try {
      if(auth.currentUser.displayName !== name){
        //update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //update name in the firestore
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, {
          name: name,
        });
        toast.success('Profile details updated!');
      }
    } catch (error) {
      toast.error('Could not update the profile details!');
    }
  }

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center flex-col items-center'>
        <h1 className='text-3xl text-center font-bold mt-6'>My Profile</h1>
      <div className='w-full md:w-[50%] mt-6 px-3'>
        <form>
          {/* Name input */}

          <input type='text' id='name' value={name} onChange={onChange} disabled={!changeDetail} className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && 'bg-red-200 focus:bg-red-200'}`} />
          {/* Email input */}

          <input type='email' id='email' value={email} disabled={!changeDetail} className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-outS' />

          <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
            <p className='flex items-center'>Do you want to change your name?
            <span onClick={onClick} className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer'>
              {changeDetail ? 'Apply change' : 'Edit'}
            </span>
            </p>
            <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer'>Sign out</p>
          </div>
        
        </form>
      </div>
      </section>
    </>
  )
}
