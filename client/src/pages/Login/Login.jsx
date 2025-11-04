import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, signUp } from "../../features/userSlice";


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toastMsg, setToastMsg] = useState('');
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSignPassword, setShowSignPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  const switchForm = (loginState) => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhoneNumber('');
    setIsLogin(loginState);
    setLoginErrors({});
    setSignupErrors({});
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (isLogin && !email) newErrors.email = true;
    if (isLogin && !password) newErrors.password = true;


    if (Object.keys(newErrors).length > 0) {
      setLoginErrors(newErrors);
      showToast('Please fill in all required fields');
      return;
    }

    setLoginErrors({});


    if (isLogin) {
      const result = await dispatch(login({ email, password, rememberMe }));
      if (login.fulfilled.match(result)) {
      
        const userRole = result.payload.user.type;

        localStorage.setItem("role", userRole);

        showToast('Login successful!');
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);

      } else {
        showToast('Invalid credentials');
        console.log(result.payload || "Login failed");
      }
    }
    // handle signup logic here
    if (!isLogin) {
      const newErrors = {};
      if (!fullName) newErrors.fullName = true;
      if (!phoneNumber) newErrors.phoneNumber = true;
      if (!email) newErrors.email = true;
      if (!password) newErrors.password = true;
      if (!confirmPassword) newErrors.confirmPassword = true;

      if (password !== confirmPassword) {
        newErrors.confirmPassword = true;
      }

      

      if (Object.keys(newErrors).length > 0) {
          setSignupErrors(newErrors);

          if (password !== confirmPassword) {
            showToast("Your password mismatched!");
          } else {
            showToast("Please fill in all fields");
          }
          return;
        }

      setSignupErrors({});
      const result = await dispatch(signUp({ fullName, phoneNumber, email, type: "3", password, confirmPassword }));
      if (signUp.fulfilled.match(result)) {
        showToast('SignUp successfull!');
        setTimeout(() => {
          switchForm(true);
        }, 1000);
      } else {
        showToast(result.payload || "SignUp failed");
        console.log(result.payload || "SignUp failed")
      }
    }
  };

  const showToast = (message) => {
    setToastMsg(message);
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => {
      setToastMsg('');
    }, 2500);
  };


  return (
    <>
      {toastMsg && <div className="custom-toast">{toastMsg}</div>}
      <div className="talkbrush-container">
        <div className="inner-container">
          <div className="left-panel">
            <div className="left-panel-container">
              <img src="/logo.png" alt="" />

              <p>To make an accent suitable for an audience or purpose</p>
            </div>
          </div>
          <div className="right-panel">
            <div className="form-container">
              <div className="form-toggle">
                <h2
                  className={isLogin ? "" : "active"}
                // onClick={() => setIsLogin(true)}
                >
                  Login
                </h2>
                <h2 style={{ color: "rgba(255, 255, 255, 0.5)", fontWeight: 200 }}>|</h2>
                <h2
                  className={!isLogin ? "" : "active"}
                // onClick={() => setIsLogin(false)}
                >
                  Signup
                </h2>
              </div>
              <p className={`form-description ${!isLogin ? "register" : ""}`}>
                {isLogin
                  ? <>Log in to Personalize the English<br />accent you listen to</>
                  : <>Register Now to Personalize the <br /> English accent you listen to</>}
              </p>

              {isLogin && (
                <form autoComplete="off" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="fake_email"
                    style={{ position: 'absolute', top: '-9999px' }}
                    tabIndex={-1}
                  />
                  <input
                    type="password"
                    name="fake_password"
                    style={{ position: 'absolute', top: '-9999px' }}
                    tabIndex={-1}
                  />
                  <div className="input-wrapper">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={`input-field ${loginErrors.email ? 'error' : ''}`}
                      autoComplete="new-email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (loginErrors.email) {
                          setLoginErrors((prev) => ({ ...prev, email: false }));
                        }
                      }}
                    />
                    <i className="fas fa-envelope input-icon"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`input-field ${loginErrors.password ? 'error' : ''}`}
                      autoComplete="new-password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (loginErrors.password) {
                          setLoginErrors((prev) => ({ ...prev, password: false }));
                        }
                      }}

                    />
                    <i className="fas fa-lock input-icon"></i>
                    <i
                      className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"} toggle-icon`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>

                  <div className="remember-me">
                    <div className="remember-left">
                      <input type="checkbox" id="remember" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)}/>
                      <label htmlFor="remember">Remember Me</label>
                    </div>
                    <button className="forgetPassword" disabled>
                      Forgot Password?
                    </button>
                  </div>

                  <button type="submit" className="submit-btn">
                    LOGIN
                  </button>

                  <div className="DDHA">
                    {" "}
                    <div className="DHA">
                      Don't have an Account?
                      <button
                        type="button"
                        className="DHAS"
                        onClick={() => switchForm(false)}
                      >
                        SignUp
                      </button>
                    </div>{" "}
                  </div>
                </form>
              )}

              {!isLogin && (
                <form onSubmit={handleSubmit}>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className={`input-field ${signupErrors.fullName ? 'error' : ''}`}
                      autoComplete="off"
                      name="userName"
                      value={fullName}
                      onChange={(e) => {setFullName(e.target.value);
                        if(signupErrors.fullName){
                          setSignupErrors((prev)=> ({...prev, fullName: false}))
                        }
                      }   
                      }
                    />
                    <i className="fas fa-user input-icon"></i>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={`input-field ${signupErrors.email ? 'error' : ''}`}
                      autoComplete="new-email"
                      name="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value);
                        if (signupErrors.email){
                          setSignupErrors((prev)=> ({...prev, email: false}))
                        }
                      }
                      }
                    />
                    <i className="fas fa-envelope input-icon"></i>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className={`input-field ${signupErrors.phoneNumber ? 'error' : ''}`}
                      autoComplete="off"
                      name="userPhoneNumber"
                      value={phoneNumber}
                      onChange={(e) => {
                              setPhoneNumber(e.target.value);
                              if (signupErrors.phoneNumber) {
                                setSignupErrors((prev) => ({ ...prev, phoneNumber: false }));
                              }
                            }}
                    />
                    <i className="fas fa-phone-alt input-icon"></i>
                  </div>


                  <div className="input-wrapper">
                    <input
                      type={showSignPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`input-field ${signupErrors.password ? 'error' : ''}`}
                      autoComplete="new-password"
                      name="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value)
                        if(signupErrors.password){
                          setSignupErrors((prev)=> ({...prev, password: false}))
                        }
                      }}
                    />
                    <i className="fas fa-lock input-icon"></i>
                    <i
                      className={`fas ${showSignPassword ? "fa-eye" : "fa-eye-slash"} toggle-icon`}
                      onClick={() => setShowSignPassword(!showSignPassword)}
                    ></i>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`input-field ${signupErrors.confirmPassword ? 'error' : ''}`}
                      autoComplete="off"
                      name="userPasswordc"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value)
                        if(signupErrors.confirmPassword){
                          setSignupErrors((prev)=> ({...prev, confirmPassword: false}))
                        }
                      }
                      }
                    />
                    <i className="fas fa-lock input-icon"></i>
                    <i
                      className={`fas ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} toggle-icon`}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    ></i>
                  </div>

                  <label className="T-C">
                    <input
                      type="checkbox"
                      name="T&C"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    I agree to the{" "}
                    <p
                      style={{
                        color: "white",
                        paddingLeft: 2,
                        paddingRight: 2,
                      }}
                    >
                      privacy policy{" "}
                    </p>{" "}
                    &{" "}
                    <p
                      style={{
                        color: "white",
                        paddingLeft: 2,
                        paddingRight: 2,
                      }}
                    >
                      Terms and conditions.{" "}
                    </p>
                  </label>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={!agreedToTerms}
                    style={{
                      opacity: agreedToTerms ? 1 : 0.5,
                      cursor: agreedToTerms ? 'pointer' : 'not-allowed'
                    }}
                  >
                    SIGNUP
                  </button>

                  <div className="DDHA">
                    {" "}
                    <div className="DHA">
                      Already have an Account?
                      <button
                        type="button"
                        className="DHAS"
                        onClick={() => switchForm(true)}
                      >
                        Login
                      </button>
                    </div>{" "}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { login, signUp } from "../../features/userSlice";

// export default function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(true);
//   const [fullName, setFullName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [toastMsg, setToastMsg] = useState('');
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showSignPassword, setShowSignPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const switchForm = (loginState) => {
//     setEmail('');
//     setPassword('');
//     setConfirmPassword('');
//     setFullName('');
//     setPhoneNumber('');
//     setIsLogin(loginState);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newErrors = {};

//     if (isLogin && !email) newErrors.email = true;
//     if (isLogin && !password) newErrors.password = true;

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       showToast('Please fill in all required fields');
//       return;
//     }

//     setErrors({});

//     if (isLogin) {
//       const result = await dispatch(login({ email, password }));
//       if (login.fulfilled.match(result)) {
//         showToast('Login successful!');
//         setTimeout(() => {
//           navigate("/dashboard");
//         }, 1500);
//       } else {
//         showToast('Invalid credentials');
//         console.log(result.payload || "Login failed");
//       }
//     }

//     if (!isLogin) {
//       if (!fullName || !phoneNumber || !email || !password || !confirmPassword) {
//         showToast('Please fill in all fields');
//         return;
//       }
//       if (password !== confirmPassword) {
//         showToast('Passwords do not match');
//         return;
//       }
//       const result = await dispatch(signUp({ fullName, phoneNumber, email, password, confirmPassword }));
//       if (signUp.fulfilled.match(result)) {
//         showToast('SignUp successful!');
//         setTimeout(() => {
//           switchForm(true);
//         }, 1000);
//       } else {
//         showToast(result.payload || "SignUp failed");
//         console.log(result.payload || "SignUp failed")
//       }
//     }
//   };

//   const showToast = (message) => {
//     setToastMsg(message);
//     clearTimeout(showToast.timeout);
//     showToast.timeout = setTimeout(() => {
//       setToastMsg('');
//     }, 2500);
//   };

//   return (
//     <>
//       {/* Toast Notification */}
//       {toastMsg && (
//         <div className="fixed top-[30px] right-[30px] bg-[rgba(40,40,60,0.9)] text-[#ECE4FF] px-[18px] py-3 rounded-lg text-sm font-poppins shadow-[0_6px_20px_rgba(0,0,0,0.25)] z-[9999] animate-[fadeSlideIn_0.4s_ease]">
//           {toastMsg}
//         </div>
//       )}

//       {/* Main Container */}
//       <div className="font-poppins text-white flex min-h-screen w-full relative z-0 overflow-hidden">
//         {/* Background Layer */}
//         <div
//           className="absolute top-0 left-0 w-full h-full opacity-90 -z-10"
//           style={{
//             background: "linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%), url('/bgimg.jpg') no-repeat center center",
//             backgroundSize: 'cover'
//           }}
//         />

//         {/* Inner Container */}
//         <div className="my-[35px] mx-auto max-w-[1200px] w-[90%] flex justify-between items-center relative opacity-100 rounded-[10px] z-[1]">

//           {/* Left Panel */}
//           <div className="flex-[1.2] flex justify-center items-center pr-[8%] box-border lg:flex-[0.5] lg:text-center lg:px-8 lg:pt-16 lg:pb-8 md:px-4 md:pt-8 md:pb-4">
//             <div className="flex flex-col items-center text-center border-none -translate-y-[50px] font-nunito font-bold lg:-translate-y-0">
//               <img
//                 src="/logo.png"
//                 alt="Logo"
//                 className="w-[290px] h-[250px] object-contain"
//               />
//               <p className="text-white text-[52px] font-nunito font-bold text-center leading-[1.2] font-normal lg:text-[1.5rem] md:text-[1.2rem]">
//                 To make an accent suitable for an audience or purpose
//               </p>
//             </div>
//           </div>

//           {/* Right Panel */}
//           <div className="h-full flex-1 flex items-center justify-center box-border backdrop-blur-[49px] bg-[#594D5B33] shadow-[0_8px_32px_0_rgba(38,37,37,0.37)] rounded-[20px] border-[3px] border-[rgba(255,255,255,0.1)] lg:w-full lg:px-8 lg:pb-8">
//             <div className="py-10 px-[60px] w-full max-w-[420px] md:px-6">

//               {/* Form Toggle */}
//               <div className="flex justify-center gap-5 mb-[5px]">
//                 <h2 className={`font-poppins font-light text-[25px] relative transition-colors duration-300 ${isLogin ? 'text-white font-extrabold' : 'text-primary'}`}>
//                   Login
//                 </h2>
//                 <h2 className="text-[rgba(255,255,255,0.5)] font-extralight text-[25px]">|</h2>
//                 <h2 className={`font-poppins font-light text-[25px] relative transition-colors duration-300 ${!isLogin ? 'text-white font-extrabold' : 'text-primary'}`}>
//                   Signup
//                 </h2>
//               </div>

//               {/* Form Description */}
//               <p className={`text-center mb-[25px] text-xs font-poppins ${isLogin ? 'text-[rgba(255,255,255,0.7)]' : 'text-[#ECE4FF]'}`}>
//                 {isLogin ? (
//                   <>Log in to Personalize the English<br />accent you listen to</>
//                 ) : (
//                   <>Register Now to Personalize the <br /> English accent you listen to</>
//                 )}
//               </p>

//               {/* Login Form */}
//               {isLogin && (
//                 <form autoComplete="off" onSubmit={handleSubmit}>
//                   {/* Hidden fields to prevent autofill */}
//                   <input type="text" name="fake_email" className="absolute -top-[9999px]" tabIndex={-1} />
//                   <input type="password" name="fake_password" className="absolute -top-[9999px]" tabIndex={-1} />

//                   {/* Email Input */}
//                   <div className="relative mb-[15px]">
//                     <input
//                       type="email"
//                       placeholder="Email Address"
//                       className={`w-full py-[18px] pr-[10px] pl-[50px] bg-[#ffd7601a] border rounded-lg text-white text-xs font-normal leading-[120%] font-poppins box-border transition-all duration-300 focus:outline-none focus:border-[#ffc107] focus:shadow-[0_0_0_3px_rgba(255,193,7,0.3)] placeholder:text-white placeholder:text-xs ${errors.email ? 'border-[#ff4d4f] bg-[rgba(255,77,79,0.08)]' : 'border-primary'}`}
//                       autoComplete="new-email"
//                       name="email"
//                       value={email}
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                         if (errors.email) {
//                           setErrors((prev) => ({ ...prev, email: false }));
//                         }
//                       }}
//                     />
//                     <i className="fas fa-envelope absolute top-1/2 left-[15px] -translate-y-1/2 text-white pointer-events-none"></i>
//                   </div>

//                   {/* Password Input */}
//                   <div className="relative mb-[15px]">
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       placeholder="Password"
//                       className={`w-full py-[18px] pr-[10px] pl-[50px] bg-[#ffd7601a] border rounded-lg text-white text-xs font-normal leading-[120%] font-poppins box-border transition-all duration-300 focus:outline-none focus:border-[#ffc107] focus:shadow-[0_0_0_3px_rgba(255,193,7,0.3)] placeholder:text-white placeholder:text-xs ${errors.password ? 'border-[#ff4d4f] bg-[rgba(255,77,79,0.08)]' : 'border-primary'}`}
//                       autoComplete="new-password"
//                       name="password"
//                       value={password}
//                       onChange={(e) => {
//                         setPassword(e.target.value);
//                         if (errors.password) {
//                           setErrors((prev) => ({ ...prev, password: false }));
//                         }
//                       }}
//                     />
//                     <i className="fas fa-lock absolute top-1/2 left-[15px] -translate-y-1/2 text-white pointer-events-none"></i>
//                     <i
//                       className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"} absolute top-1/2 right-[15px] -translate-y-1/2 text-white cursor-pointer transition-colors duration-300 hover:text-primary`}
//                       onClick={() => setShowPassword(!showPassword)}
//                     ></i>
//                   </div>

//                   {/* Remember Me & Forgot Password */}
//                   <div className="font-poppins flex justify-between items-center mt-[5px] text-white text-[13px]">
//                     <div className="flex items-center gap-[10px]">
//                       <input type="radio" id="remember" className="w-4 h-4 accent-white cursor-pointer" />
//                       <label htmlFor="remember">Remember Me</label>
//                     </div>
//                     <button className="font-poppins text-[13px] bg-transparent border-none text-white cursor-pointer" disabled>
//                       Forgot Password?
//                     </button>
//                   </div>

//                   {/* Login Button */}
//                   <button
//                     type="submit"
//                     className="w-full py-4 px-[50px] border-none rounded-lg bg-secondary text-white font-poppins text-[10px] font-medium leading-[120%] cursor-pointer mt-[15px] transition-all duration-[1000ms] hover:bg-[#ffca2c] active:scale-[0.98]"
//                   >
//                     LOGIN
//                   </button>

//                   {/* Sign Up Link */}
//                   <div className="font-poppins text-xs flex justify-center items-center pt-[25px]">
//                     <div className="flex text-white">
//                       Don't have an Account?
//                       <button
//                         type="button"
//                         className="text-[#ffca2c] bg-transparent border-none cursor-pointer ml-[3px]"
//                         onClick={() => switchForm(false)}
//                       >
//                         SignUp
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               )}

//               {/* Signup Form */}
//               {!isLogin && (
//                 <form onSubmit={handleSubmit}>
//                   {/* Full Name Input */}
//                   <div className="relative mb-[15px]">
//                     <input
//                       type="text"
//                       placeholder="Full Name"
//                       className="w-full py-[18px] pr-[10px] pl-[50px] bg-[#ffd7601a] border border-primary rounded-lg text-white text-xs font-normal leading-[120%] font-poppins box-border transition-all duration-300 focus:outline-none focus:border-[#ffc107] focus:shadow-[0_0_0_3px_rgba(255,193,7,0.3)] placeholder:text-white placeholder:text-xs"
//                       autoComplete="off"
//                       name="userName"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                     />
//                     <i className="fas fa-user absolute top-1/2 left-[15px] -translate-y-1/2 text-white pointer-events-none"></i>
//                   </div>

//                   {/* Email Input */}
//                   <div className="relative mb-[15px]">
//                     <input
//                       type="email"
//                       placeholder="Email Address"
//                       className="w-full py-[18px] pr-[10px] pl-[50px] bg-[#ffd7601a] border border-primary rounded-lg text-white text-xs font-normal leading-[120%] font-poppins box-border transition-all duration-300 focus:outline-none focus:border-[#ffc107] focus:shadow-[0_0_0_3px_rgba(255,193,7,0.3)] placeholder:text-white placeholder:text-xs"
//                       autoComplete="new-email"
//                       name="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                     />
//                     <i className="fas fa-envelope absolute top-1/2 left-[15px] -translate-y-1/2 text-white pointer-events-none"></i>
//                   </div>

//                   {/* Phone Number Input */}
//                   <div className="relative mb-[15px]">
//                     <input
//                       type="text"
//                       placeholder="Phone Number"
//                       className="w-full py-[18px] pr-[10px] pl-[50px] bg-[#ffd7601a] border border-primary rounded-lg text-white text-xs font-normal leading-[120%] font-poppins box-border transition-all duration-300 focus:outline-none focus:border-[#ffc107] focus:shadow-[0_0_0_3px_rgba(255,193,7,0.3)] placeholder:text-white placeholder:text-xs"
//                       autoComplete="off"
//                       name="userPhoneNumber"
//                       value={phoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value)}
//                     />
//                     <i className="fas fa-phone absolute top-1/2 left-[15px] -translate-y-1/2 text-white pointer-events-none"></i>
//                   </div>

//                   {/* Password Input */}
//                   <div className="relative mb-[15px]">
//                     <input
//                       type={showSignPassword ? "text" : "password"}
//                       placeholder="Password"
//                       className="w-full py-[18px] pr-[10px] pl-[50px] bg-[#ffd7601a] border border-primary rounded-lg text-white text-xs font-normal leading-[120%] font-poppins box-border transition-all duration-300 focus:outline-none focus:border-[#ffc107] focus:shadow-[0_0_0_3px_rgba(255,193,7,0.3)] placeholder:text-white placeholder:text-xs"
//                       autoComplete="new-password"
//                       name="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <i className="fas fa-lock absolute top-1/2 left-[15px] -translate-y-1/2 text-white pointer-events-none"></i>
//                     <i
//                       className={`fas ${showSignPassword ? "fa-eye" : "fa-eye-slash"} absolute top-1/2 right-[15px] -translate-y-1/2 text-white cursor-pointer transition-colors duration-300 hover:text-primary`}
//                       onClick={() => setShowSignPassword(!showSignPassword)}
//                     ></i>
//                   </div>

//                   {/* Confirm Password Input */}
//                   <div className="relative mb-[15px]">
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       placeholder="Confirm Password"
//                       className="w-full py-[18px] pr-[10px] pl-[50px] bg-[#ffd7601a] border border-primary rounded-lg text-white text-xs font-normal leading-[120%] font-poppins box-border transition-all duration-300 focus:outline-none focus:border-[#ffc107] focus:shadow-[0_0_0_3px_rgba(255,193,7,0.3)] placeholder:text-white placeholder:text-xs"
//                       autoComplete="off"
//                       name="userPasswordc"
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                     />
//                     <i className="fas fa-lock absolute top-1/2 left-[15px] -translate-y-1/2 text-white pointer-events-none"></i>
//                     <i
//                       className={`fas ${showConfirmPassword ? "fa-eye" : "fa-eye-slash"} absolute top-1/2 right-[15px] -translate-y-1/2 text-white cursor-pointer transition-colors duration-300 hover:text-primary`}
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     ></i>
//                   </div>

//                   {/* Terms & Conditions */}
//                   <label className="flex mt-[5px] text-primary text-[10px]">
//                     <input type="radio" name="T&C" className="mr-[10px] w-4 h-4 accent-white cursor-pointer" />
//                     I agree to the{" "}
//                     <p className="text-white px-[2px]">privacy policy</p> &{" "}
//                     <p className="text-white px-[2px]">Terms and conditions.</p>
//                   </label>

//                   {/* Signup Button */}
//                   <button
//                     type="submit"
//                     className="w-full py-4 px-[50px] border-none rounded-lg bg-secondary text-white font-poppins text-[10px] font-medium leading-[120%] cursor-pointer mt-[15px] transition-all duration-[1000ms] hover:bg-[#ffca2c] active:scale-[0.98]"
//                   >
//                     SIGNUP
//                   </button>

//                   {/* Login Link */}
//                   <div className="font-poppins text-xs flex justify-center items-center pt-[25px]">
//                     <div className="flex text-white">
//                       Already have an Account?
//                       <button
//                         type="button"
//                         className="text-[#ffca2c] bg-transparent border-none cursor-pointer ml-[3px]"
//                         onClick={() => switchForm(true)}
//                       >
//                         Login
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


