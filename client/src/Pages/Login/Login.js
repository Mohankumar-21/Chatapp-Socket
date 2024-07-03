import React, { useState } from 'react';
import './Login.css';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {message} from 'antd';
import { FaUserSecret } from "react-icons/fa";
import { useAuth } from '../../Component/AuthContext';

const Login = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(
    {
      email : "",
      password : ""
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



  const handleSubmit = async(e) =>
  {
   e.preventDefault();
   e.stopPropagation();
   
   const URL = `${process.env.REACT_APP_BACKEND_URL}/route/login`

   try
   {
      const res = await axios.post(URL, data);  
      if(res.data.success)  
        {
        
          localStorage.setItem('token', res.data.token);
          // localStorage.setItem('user', JSON.stringify(res.data.user));
          setCurrentUser(res.data.user);
          message.success(res.data.message || "Login successfull");
          setData(
           {
              email : "",
              password:""
            });
            
            navigate('/',{
              state : res?.data?.data
            });
        } 
        else {
            message.error(res.data.message || "Login failed");
          } 
   }
   catch(error)
   {
      message.error(error?.response?.data?.message || "something went wrong")
   }
  }


  return (
    <div className=' mt-5'>
       <div className=' bg-white w-full max mx-2 px-5 py-4 rounded overflow-hidden mx-auto  shadow'>
             <div className='new-class'>
                <FaUserSecret style={{ borderRadius: '50%'}}  size={50}/>
             </div>

             <h3 className='text-center'>Welcome to Login!</h3>
             <form className='d-grid gap-3 mt-4' onSubmit={handleSubmit} >
               
             
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
                  <label className="custom-bold" htmlFor='password' >Password :</label>
                  <input type='password' 
                  id='password'
                  name='password'
                  placeholder='Enter your password'
                  className=' px-2 py-1 custom-focus-outline'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  />
                </div>
          


                <button className='background-btn px-2 py-1'>
                  Verify
                </button>
             </form>

             <p className='my-3 text-center' >New User? <Link className='custom-link' to={"/register"} >Register</Link> </p>
       </div>
    </div>
  )
}

export default Login;
