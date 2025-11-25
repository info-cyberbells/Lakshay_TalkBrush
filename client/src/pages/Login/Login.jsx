import React, { useState } from "react";
import "./login.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, signUp } from "../../features/userSlice";
import PasswordResetModal from "../Model/PasswordResetModal.jsx";
import { showToast } from "../../features/toastSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("room");
  const { isLoading } = useSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSignPassword, setShowSignPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const switchForm = (loginState) => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setPhoneNumber("");
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

      dispatch(
        showToast({
          message: "Please fill all fields!",
          type: "error",
        })
      );
      return;
    }

    setLoginErrors({});

    if (isLogin) {
      const result = await dispatch(login({ email, password, rememberMe }));
      if (login.fulfilled.match(result)) {
        const userRole = result.payload.user.type;

        localStorage.setItem("role", userRole);

        dispatch(
          showToast({
            message: "Login successful!!",
            type: "success",
          })
        );

        setTimeout(() => {
          if (roomCode) {
            navigate(`/accent/room/${roomCode}`, { replace: true });
          } else {
            if (userRole === "1") {
              navigate("/dashboard");
            } else if (userRole === "2") {
              navigate("/admin-dashboard");
            } else if (userRole === "3") {
              navigate("/user-dashboard");
            } else {
              navigate("/user-dashboard");
            }
          }
        }, 1500);
      } else {
        dispatch(
          showToast({
            message: "Invalid credentials!",
            type: "error",
          })
        );
        console.log(result.payload || "Login failed");
      }
    }

if (!isLogin) {
  const newErrors = {};

  if (!fullName) newErrors.fullName = true;
  if (!phoneNumber) newErrors.phoneNumber = true;
  if (!email) newErrors.email = true;
  if (!password) newErrors.password = true;
  if (!confirmPassword) newErrors.confirmPassword = true;

  if (Object.keys(newErrors).length > 0) {
    setSignupErrors(newErrors);
    dispatch(
      showToast({
        message: "Please fill all fields!",
        type: "error",
      })
    );
    return; 
  }


if (trimmedName.length > 15) {
  setSignupErrors({ fullName: true });
  dispatch(
    showToast({
      message: "Name must not exceed 15 characters!",
      type: "error",
    })
  );
  return;
}

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    setSignupErrors({ email: true });
    dispatch(
      showToast({
        message: "Please enter a valid email address!",
        type: "error",
      })
    );
    return;
  }


const phoneRegex = /^\+?\d+$/;

if (!phoneRegex.test(trimmedPhone)) {
  setSignupErrors({ phoneNumber: true });
  dispatch(
    showToast({
      message: "Please enter digits only in phone number!",
      type: "error",
    })
  );
  return;
}

if (password.length < 6) {
  setSignupErrors({ password: true });
  dispatch(
    showToast({
      message: "Password must be at least 6 characters!",
      type: "error",
    })
  );
  return;
}



  if (password !== confirmPassword) {
    setSignupErrors({ confirmPassword: true });

    dispatch(
      showToast({
        message: "Your password mismatched!!",
        type: "error",
      })
    );
    return;
  }

  if (!agreedToTerms) {
    dispatch(
      showToast({
        message: "Please agree to Terms & Conditions!",
        type: "error",
      })
    );
    return; 
  }

  setSignupErrors({});

  const result = await dispatch(
    signUp({
      fullName,
      phoneNumber,
      email,
      type: "3",
      password,
      confirmPassword,
    })
  );

  if (signUp.fulfilled.match(result)) {
    dispatch(
      showToast({
        message: "SignUp successfull!!",
        type: "success",
      })
    );

    setTimeout(() => {
      switchForm(true);
    }, 1000);
  } else {
    dispatch(
      showToast({
        message: result.payload || "SignUp failed",
        type: "error",
      })
    );
    console.log(result.payload || "SignUp failed");
  }
}

  };

 

  return (
    <>
      {/* {toastMsg && <div className="custom-toast">{toastMsg}</div>} */}
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
                <h2
                  style={{ color: "rgba(255, 255, 255, 0.5)", fontWeight: 200 }}
                >
                  |
                </h2>
                <h2
                  className={!isLogin ? "" : "active"}
                  // onClick={() => setIsLogin(false)}
                >
                  Signup
                </h2>
              </div>
              <p className={`form-description ${!isLogin ? "register" : ""}`}>
                {isLogin ? (
                  <>
                    Log in to Personalize the English
                    <br />
                    accent you listen to
                  </>
                ) : (
                  <>
                    Register Now to Personalize the <br /> English accent you
                    listen to
                  </>
                )}
              </p>

              {isLogin && (
                <form autoComplete="off" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="fake_email"
                    style={{ position: "absolute", top: "-9999px" }}
                    tabIndex={-1}
                  />
                  <input
                    type="password"
                    name="fake_password"
                    style={{ position: "absolute", top: "-9999px" }}
                    tabIndex={-1}
                  />
                  <div className="input-wrapper">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className={`input-field ${
                        loginErrors.email ? "error" : ""
                      }`}
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
                      className={`input-field ${
                        loginErrors.password ? "error" : ""
                      }`}
                      autoComplete="new-password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (loginErrors.password) {
                          setLoginErrors((prev) => ({
                            ...prev,
                            password: false,
                          }));
                        }
                      }}
                    />
                    <i className="fas fa-lock input-icon"></i>
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye" : "fa-eye-slash"
                      } toggle-icon`}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </div>

                  <div className="remember-me">
                    <div className="remember-left">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="remember">Remember Me</label>
                    </div>
                    <button
                      type="button"
                      className="forgetPassword"
                      onClick={() => setShowResetModal(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={isLoading}
                    style={{
                      opacity: isLoading ? 0.6 : 1,
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? "Logging..." : "LOGIN"}
                  </button>

                  <div className="DDHA">
                    {" "}
                    <div className="DHA">
                      Don't have an account?{" "}
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
                      className={`input-field ${
                        signupErrors.fullName ? "error" : ""
                      }`}
                      autoComplete="off"
                      name="userName"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (signupErrors.fullName) {
                          setSignupErrors((prev) => ({
                            ...prev,
                            fullName: false,
                          }));
                        }
                      }}
                    />
                    <i className="fas fa-user input-icon"></i>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Email Address"
                      className={`input-field ${
                        signupErrors.email ? "error" : ""
                      }`}
                      autoComplete="new-email"
                      name="email"
                      maxLength={40}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (signupErrors.email) {
                          setSignupErrors((prev) => ({
                            ...prev,
                            email: false,
                          }));
                        }
                      }}
                    />
                    <i className="fas fa-envelope input-icon"></i>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className={`input-field ${
                        signupErrors.phoneNumber ? "error" : ""
                      }`}
                      autoComplete="off"
                      maxLength={15}
                      name="userPhoneNumber"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (signupErrors.phoneNumber) {
                          setSignupErrors((prev) => ({
                            ...prev,
                            phoneNumber: false,
                          }));
                        }
                      }}
                    />
                    <i className="fas fa-phone-alt input-icon"></i>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type={showSignPassword ? "text" : "password"}
                      placeholder="Password"
                      className={`input-field ${
                        signupErrors.password ? "error" : ""
                      }`}
                      autoComplete="new-password"
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (signupErrors.password) {
                          setSignupErrors((prev) => ({
                            ...prev,
                            password: false,
                          }));
                        }
                      }}
                    />
                    <i className="fas fa-lock input-icon"></i>
                    <i
                      className={`fas ${
                        showSignPassword ? "fa-eye" : "fa-eye-slash"
                      } toggle-icon`}
                      onClick={() => setShowSignPassword(!showSignPassword)}
                    ></i>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className={`input-field ${
                        signupErrors.confirmPassword ? "error" : ""
                      }`}
                      autoComplete="off"
                      name="userPasswordc"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (signupErrors.confirmPassword) {
                          setSignupErrors((prev) => ({
                            ...prev,
                            confirmPassword: false,
                          }));
                        }
                      }}
                    />
                    <i className="fas fa-lock input-icon"></i>
                    <i
                      className={`fas ${
                        showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                      } toggle-icon`}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                    // disabled={!agreedToTerms}
                    style={
                      {
                        // opacity: agreedToTerms ? 1 : 0.5,
                        // cursor: agreedToTerms ? 'pointer' : 'not-allowed'
                      }
                    }
                  >
                    SIGNUP
                  </button>

                  <div className="DDHA">
                    {" "}
                    <div className="DHA">
                      Already have an account?{" "}
                      <button
                        type="submit"
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
        <PasswordResetModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          // showToast={showToast}
          // showToast={(msg, type) => dispatch(showToast({ message: msg, type }))}
        />
      </div>
    </>
  );
}
