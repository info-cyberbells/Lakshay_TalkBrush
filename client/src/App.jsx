import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import Navbar from './Component/Navbar/Navbar';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import { verify } from './features/userSlice';
import Profile from './pages/Profile/Profile'
import './App.css';

function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      setIsVerifying(true);
      const result = await dispatch(verify());
      if (verify.rejected.match(result) && location.pathname !== '/') {
        navigate('/');
      } else if (verify.fulfilled.match(result) && location.pathname === '/') {
        navigate('/dashboard');
      }
      setIsVerifying(false);
    };
    verifyUser();
  }, [dispatch, navigate, location.pathname]);

  if (isVerifying) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const showNavbar = location.pathname !== '/';

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
      </Routes>
    </div >
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;