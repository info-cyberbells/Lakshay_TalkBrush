import React, { useState } from "react";
import "../../styles/login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');

  const switchForm = (loginState) => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsLogin(loginState);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      const result = await dispatch(login({ email, password }));
      if (login.fulfilled.match(result)) {
        alert("Login successfull");
        navigate("/dashboard");
      } else {
        alert(result.payload || "Login failed");
        console.log(result.payload || "Login failed");
      }
    }
  };

  return (
    <>
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
                  className={isLogin ? "active" : ""}
                // onClick={() => setIsLogin(true)}
                >
                  Login
                </h2>
                <h2 style={{ color: "white", fontWeight: 200 }}>|</h2>
                <h2
                  className={!isLogin ? "active" : ""}
                // onClick={() => setIsLogin(false)}
                >
                  Signup
                </h2>
              </div>
              <p className="form-description">
                {isLogin
                  ? "Log in to Personalize the English accent you listen to"
                  : "Register Now to Personalize the English accent you listen to"}
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
                      className="input-field"
                      autoComplete="new-email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <i className="fas fa-envelope input-icon"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      placeholder="Password"
                      className="input-field"
                      autoComplete="new-password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <i className="fas fa-lock input-icon"></i>
                  </div>

                  <div className="remember-me">
                    <div className="remember-left">
                      <input type="radio" id="remember" />
                      <label htmlFor="remember">Remember Me</label>
                    </div>
                    <button className="forgetPassword" disabled>
                      Forget Password
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
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="input-field"
                      autoComplete="off"
                      name="userName"
                    />
                    <i className="fas fa-user input-icon"></i>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="input-field"
                      autoComplete="new-email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <i className="fas fa-envelope input-icon"></i>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="password"
                      placeholder="Password"
                      className="input-field"
                      autoComplete="new-password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <i className="fas fa-lock input-icon"></i>
                  </div>

                  <div className="input-wrapper">
                    <input
                      type="password"
                      placeholder="Password"
                      className="input-field"
                      autoComplete="off"
                      name="userPasswordc"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <i className="fas fa-lock input-icon"></i>
                  </div>

                  <label className="T-C">
                    <input
                      type="radio"
                      name="T&C
                               "
                    />{" "}
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

                  <button type="submit" className="submit-btn">
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
