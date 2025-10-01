import React, { useState } from 'react';
import '../styles/login.css'

export default function App() {
  
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  

  return (
    <>
   
      <div className="talkbrush-container">
        <div className='inner-container'>
        <div className="left-panel">
            <div className="left-panel-container">
            <h1>TalkBrush</h1>
            <p>Paint your voice with the right accent</p>
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
            

            <div className="or-divider">Or</div>

            <form autoComplete='off' onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="input-wrapper">
                  <input type="text" placeholder="Full Name" className="input-field" autoComplete='off' name='userName' />
                   <i className="fas fa-user input-icon"></i>
                </div>
              )}
              <div className="input-wrapper">
                <input type="email" placeholder="Email Address" className="input-field" autoComplete='off' name='userEmail' />
                <i className="fas fa-envelope input-icon"></i>
              </div>
              <div className="input-wrapper">
                <input type="password" placeholder="Password" className="input-field" autoComplete='off' name="userPassword"/>
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
                  <input type="radio" id="remember" />
                  <label htmlFor="remember">Remember Me</label>
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
            </form>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

