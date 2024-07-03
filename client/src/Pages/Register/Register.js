import React, { useState } from 'react';
import './Register.css';
import { IoCloseCircle } from "react-icons/io5";
import {Link, useNavigate} from 'react-router-dom';
import UploadFile from '../../Cloudinary/Cloudinary';
import axios from 'axios';
import {message} from 'antd';

const RegisterPage = () => {

  const [uploadphoto, setUploadphoto] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState(
    {
      name : "",
      password : "",
      email : "",
      profile_pic : ""
    }
  );
  


  const handleOnChange = (e)=>
  {
     const {name, value} = e.target;

    setData((prev)=>
    {
      return {
        ...prev,
        [name] : value
      }
    })
  }; 

  const handleUpload = async(e)=>
  {
     const file = e.target.files[0];
     
     const uploadPhoto = await UploadFile(file)
     setUploadphoto(file);

    setData((prev)=>
    {
       return (
        {
          ...prev,
          profile_pic : uploadPhoto?.url
        }
       )
    })
  };

  const handleClearphoto = (e)=>
  {
    e.stopPropagation();
    setUploadphoto(null)
    e.preventDefault();
  };


  const handleSubmit = async(e) =>
  {
   e.preventDefault();
   e.stopPropagation();
   
   const URL = `${process.env.REACT_APP_BACKEND_URL}/route/register`

   try
   {
      const res = await axios.post(URL, data);
      message.success(res.data.message);   
      if(res.data.success)  
        {
          setData(
           {
              name : "",
              password : "",
              email : "",
              profile_pic : ""
            });
            
            navigate('/login');
        }  
   }
   catch(error)
   {
      message.error(error?.response?.data?.message || "something went wrong")
   }

  }


  return (
    <div className='Register-align pt-3'>
       <div className=' bg-white w-full max mx-2 px-5 py-4 rounded overflow-hidden mx-auto shadow'>
             <h3 className='text-center'>Welcome!</h3>
             <form className='d-grid gap-3 mt-4' onSubmit={handleSubmit} >
                <div className='d-flex flex-column gap-1 ' >
                  <label htmlFor='name' className="custom-bold" >Name :</label>
                  <input type='text' 
                  id='name'
                  name='name'
                  placeholder='Enter your name'
                  className=' px-2 py-1 custom-focus-outline custom-d'
                  value={data.name}
                  onChange={handleOnChange}
                  required
                  />
                </div>
                <div className='d-flex flex-column gap-1' >
                  <label className="custom-bold" htmlFor='email' >Email :</label>
                  <input type='email' 
                  id='email'
                  name='email'
                  placeholder='Enter your email'
                  className=' px-2 py-1 custom-focus-outline'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                  />
                </div>
                <div className='d-flex flex-column gap-1' >
                  <label htmlFor='password' className="custom-bold" >Password :</label>
                  <input type='password' 
                  id='password'
                  name='password'
                  placeholder='Enter your password'
                  className=' px-2 py-1 custom-focus-outline'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  autoComplete='off'
                  />
                </div>
                <div className='d-flex flex-column gap-1' >
                  <label htmlFor='profile_pic' className="custom-bold ">Photo :
                  <div className='custom-design rounded' >
                      <p className='font-size-sm new-width' >
                        {
                          uploadphoto?.name ? uploadphoto?.name :   "Upload profile photo"
                        }  
                      </p>

                      {
                        uploadphoto?.name && (
                          <button className="no-border-btn ms-2 font-size-md" onClick={handleClearphoto}> 
                             <IoCloseCircle/>
                           </button>
                        )
                      }
                     
                  </div>
                  </label>
                  <input type='file' 
                  id='profile_pic'
                  name='profile_pic'
                  className=' px-2 py-1 custom-focus-outline d-none'
                  onChange={handleUpload}
                  />
                </div>

                <button className='background-btn px-2 py-1'>
                  Register
                </button>
             </form>

             <p className='my-3 text-center' >Already have an account ? <Link className='custom-link' to={"/login"} >Login</Link> </p>
       </div>
    </div>
  )
}

export default RegisterPage;
