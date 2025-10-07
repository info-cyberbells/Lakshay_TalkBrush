import React, { useState } from 'react';
import '../styles/login.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';

export default function App() {

  const dispatch = useDispatch();

  
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(isLogin){
      const result = await dispatch(login({email, password}));
      if(login.fulfilled.match(result)){
        alert("Login successfull")
      }
      else{
         alert(result.payload || "Login failed");
      }
    }
  }
  

  return (
    <>
   
      <div className="talkbrush-container">
        <div className='inner-container'>
        <div className="left-panel">
            <div className="left-panel-container">
            <img src="/logo.png" alt="" />

            <p>To make an accent suitable for an audience or purpose</p>
        </div>

            </div>
        <div className="right-panel">
          <div className="form-container">
            <div className="form-toggle">
              <h2 className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
                Login
              </h2>
              <h2 style={{color: 'white', fontWeight: 200,}}>|</h2>
              <h2 className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
                Signup
              </h2>
            </div>
            <p className="form-description">
              {isLogin ? 'Log in to Personalize the English accent you listen to' : 'Register Now to Personalize the English accent you listen to'}
            </p>
            

      

            <form autoComplete='off' onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="input-wrapper">
                  <input type="text" placeholder="Full Name" className="input-field" autoComplete='off' name='userName' />
                   <i className="fas fa-user input-icon"></i>
                </div>
              )}
              <div className="input-wrapper">
                <input type="email" placeholder="Email Address" className="input-field" autoComplete='off' name='userEmail' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <i className="fas fa-envelope input-icon"></i>
              </div>
              <div className="input-wrapper">
                <input type="password" placeholder="Password" className="input-field" autoComplete='off' name="userPassword" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <i className="fas fa-lock input-icon"></i>
              </div>
              {!isLogin &&
              
              <div className="input-wrapper">
                <input type="password" placeholder="Password" className="input-field" autoComplete='off' name='userPasswordc' />
                <i className="fas fa-lock input-icon"></i>
              </div>
              }

              {isLogin && (
                <div className="remember-me">
                  <div className="remember-left">
                    <input type="radio" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                  <button className="forgetPassword">Forget Password</button>
                </div>
              )}

              {!isLogin && (
                        
                            <label className='T-C' >
                               <input type="radio" name="T&C
                               "  /> I agree to the privacy policy & Terms and conditions.
                            </label>
                        
                    )}
              
              <button type="submit" className="submit-btn">
                {isLogin ? 'LOGIN' : 'SIGNUP'}
              </button>
            {isLogin && <div className="DDHA"> <div className='DHA'>
              Don't have an account?<button className='DHAS' onClick={() => setIsLogin(false)}>SignUp</button>
              </div> </div>}
              {!isLogin && <div className="DDHA"> <div className='DHA'>
                Already have an account?<button className='DHAS' onClick={() => setIsLogin(true)}>Login</button>
              </div> </div>}
            </form>

          </div>
        </div>
      </div>
      </div>
    </>
  );
}

